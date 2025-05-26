import { createClient } from '@/utils/supabase/client';
import {
  Organization,
  OrganizationMembership,
  UserProfile,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  InviteUserRequest,
  UpdateMembershipRequest,
  UserOrganizationsResult,
  OrganizationWithMembership,
} from '@/lib/types/organization';

export class OrganizationAPI {
  private supabase = createClient();

  /**
   * Get current user's organization profile
   */
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await this.supabase
      .from('user_profiles')
      .select(
        `
        *,
        current_organization:organizations!current_organization_id(*),
        default_organization:organizations!default_organization_id(*)
      `,
      )
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get user's organizations using the database function
   */
  async getUserOrganizations(): Promise<UserOrganizationsResult[]> {
    const { data, error } = await this.supabase.rpc('get_user_organizations');

    if (error) throw error;
    return data || [];
  }

  /**
   * Get current organization
   */
  async getCurrentOrganization(): Promise<Organization[] | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await this.supabase
      .from('user_profiles')
      .select(
        `
        current_organization:organizations!current_organization_id(*)
      `,
      )
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data?.current_organization as Organization[] | null;
  }

  /**
   * Get organization by ID with membership info
   */
  async getOrganization(orgId: number): Promise<OrganizationWithMembership | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) return null;

    // Get organization
    const { data: org, error: orgError } = await this.supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();

    if (orgError) throw orgError;

    // Get user's membership
    const { data: membership, error: membershipError } = await this.supabase
      .from('organization_users')
      .select('*')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (membershipError) return null;

    return {
      ...org,
      user_membership: membership,
    };
  }

  /**
   * Switch to a different organization
   */
  async switchOrganization(orgId: number): Promise<void> {
    const { error } = await this.supabase.rpc('switch_organization_context', { new_org_id: orgId });

    if (error) throw error;
  }

  /**
   * Create a new organization
   */
  async createOrganization(data: CreateOrganizationRequest): Promise<Organization> {
    const { data: result, error } = await this.supabase.rpc('create_organization', {
      org_name: data.name,
      org_description: data.description || null,
    });

    if (error) throw error;

    // Get the created organization
    const { data: org, error: orgError } = await this.supabase
      .from('organizations')
      .select('*')
      .eq('id', result)
      .single();

    if (orgError) throw orgError;
    return org;
  }

  /**
   * Update organization
   */
  async updateOrganization(orgId: number, data: UpdateOrganizationRequest): Promise<void> {
    const { error } = await this.supabase.from('organizations').update(data).eq('id', orgId);

    if (error) throw error;
  }

  /**
   * Delete organization
   */
  async deleteOrganization(orgId: number): Promise<void> {
    const { error } = await this.supabase.from('organizations').delete().eq('id', orgId);

    if (error) throw error;
  }

  /**
   * Get organization members
   */
  async getOrganizationMembers(orgId: number): Promise<OrganizationMembership[]> {
    const { data, error } = await this.supabase
      .from('organization_users')
      .select(
        `
        *,
        organization:organizations!inner(*),
        user_profile:user_profiles!inner(*)
      `,
      )
      .eq('organization_id', orgId)
      .eq('status', 'active')
      .order('joined_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Invite user to organization
   */
  async inviteUser(orgId: number, data: InviteUserRequest): Promise<void> {
    const { error } = await this.supabase.rpc('invite_user_to_organization', {
      org_id: orgId,
      user_email: data.email,
      user_role: data.role,
    });

    if (error) throw error;
  }

  /**
   * Update organization membership
   */
  async updateMembership(membershipId: number, data: UpdateMembershipRequest): Promise<void> {
    const { error } = await this.supabase
      .from('organization_users')
      .update(data)
      .eq('id', membershipId);

    if (error) throw error;
  }

  /**
   * Remove member from organization
   */
  async removeMember(membershipId: number): Promise<void> {
    const { error } = await this.supabase
      .from('organization_users')
      .delete()
      .eq('id', membershipId);

    if (error) throw error;
  }

  /**
   * Get user's membership in specific organization
   */
  async getUserMembership(orgId: number): Promise<OrganizationMembership | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await this.supabase
      .from('organization_users')
      .select(
        `
        *,
        organization:organizations!inner(*)
      `,
      )
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Check if user has permission in organization
   */
  async hasPermission(orgId: number, requiredRoles: string[]): Promise<boolean> {
    const membership = await this.getUserMembership(orgId);
    if (!membership) return false;

    return requiredRoles.includes(membership.role);
  }

  /**
   * Get organization analytics/stats
   */
  async getOrganizationStats(orgId: number): Promise<{
    memberCount: number;
    projectCount: number;
    taskCount: number;
    formCount: number;
  }> {
    // Get member count
    const { count: memberCount } = await this.supabase
      .from('organization_users')
      .select('*', { count: 'exact' })
      .eq('organization_id', orgId)
      .eq('status', 'active');

    // Get project count
    const { count: projectCount } = await this.supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .eq('organization_id', orgId);

    // Get task count (through projects)
    const { count: taskCount } = await this.supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .in(
        'project_id',
        await this.supabase
          .from('projects')
          .select('id')
          .eq('organization_id', orgId)
          .then(({ data }) => data?.map((p) => p.id) || []),
      );

    // Get form count
    const { count: formCount } = await this.supabase
      .from('forms')
      .select('*', { count: 'exact' })
      .eq('organization_id', orgId);

    return {
      memberCount: memberCount || 0,
      projectCount: projectCount || 0,
      taskCount: taskCount || 0,
      formCount: formCount || 0,
    };
  }

  /**
   * Search organizations by name/slug
   */
  async searchOrganizations(query: string): Promise<Organization[]> {
    const { data, error } = await this.supabase
      .from('organizations')
      .select('*')
      .or(`name.ilike.%${query}%,slug.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(10);

    if (error) throw error;
    return data || [];
  }
}

// Export singleton instance
export const organizationAPI = new OrganizationAPI();
