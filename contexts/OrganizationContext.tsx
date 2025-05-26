'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { organizationAPI } from '@/lib/api/organizations';
import {
  Organization,
  OrganizationMembership,
  OrganizationContext as OrganizationContextType,
  CreateOrganizationRequest,
  InviteUserRequest,
  UpdateMembershipRequest,
  UpdateOrganizationRequest,
  UserOrganizationsResult,
} from '@/lib/types/organization';

const OrganizationContext = createContext<OrganizationContextType | null>(null);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [current, setCurrent] = useState<Organization | null>(null);
  const [memberships, setMemberships] = useState<OrganizationMembership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: any) => {
    console.error('Organization error:', err);
    setError(err.message || 'An error occurred');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadOrganizations = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      clearError();

      // Load user's organizations
      const userOrgs = await organizationAPI.getUserOrganizations();

      // Convert to membership format
      const membershipsData: OrganizationMembership[] = userOrgs.map((org) => ({
        id: 0, // This will be populated by a proper API call
        organization_id: org.organization_id,
        user_id: user.id,
        role: org.user_role as any,
        status: org.user_status as any,
        joined_at: org.joined_at,
        invited_at: null,
        invited_by: null,
        last_accessed_at: org.last_accessed_at,
        display_name: null,
        notifications_enabled: true,
        organization: {
          id: org.organization_id,
          name: org.organization_name,
          slug: org.organization_slug,
          // Add other required fields with defaults
          description: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: user.id,
          max_members: 100,
          is_active: true,
          domain: null,
          subdomain: org.organization_slug,
          plan_type: 'free',
          subscription_id: null,
          billing_email: null,
          data_region: 'us-east-1',
          retention_days: 365,
        },
      }));

      setMemberships(membershipsData);

      // Set current organization
      const currentOrg = userOrgs.find((org) => org.is_current);
      if (currentOrg) {
        setCurrent(
          membershipsData.find((m) => m.organization_id === currentOrg.organization_id)
            ?.organization || null,
        );
      } else if (membershipsData.length > 0) {
        // If no current org is set, use the first one
        setCurrent(membershipsData[0].organization);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, handleError, clearError]);

  const switchOrganization = useCallback(
    async (orgId: number) => {
      try {
        clearError();
        setIsLoading(true);

        await organizationAPI.switchOrganization(orgId);

        // Update current organization
        const newCurrent = memberships.find((m) => m.organization_id === orgId)?.organization;
        if (newCurrent) {
          setCurrent(newCurrent);
        }

        // Reload to get fresh data
        await loadOrganizations();
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [memberships, loadOrganizations, handleError, clearError],
  );

  const createOrganization = useCallback(
    async (data: CreateOrganizationRequest): Promise<Organization> => {
      try {
        clearError();
        setIsLoading(true);

        const newOrg = await organizationAPI.createOrganization(data);

        // Reload organizations to include the new one
        await loadOrganizations();

        return newOrg;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [loadOrganizations, handleError, clearError],
  );

  const updateOrganization = useCallback(
    async (orgId: number, data: UpdateOrganizationRequest) => {
      try {
        clearError();

        await organizationAPI.updateOrganization(orgId, data);

        // Update local state
        if (current && current.id === orgId) {
          setCurrent({ ...current, ...data });
        }

        // Reload to get fresh data
        await loadOrganizations();
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [current, loadOrganizations, handleError, clearError],
  );

  const deleteOrganization = useCallback(
    async (orgId: number) => {
      try {
        clearError();

        await organizationAPI.deleteOrganization(orgId);

        // Remove from local state
        setMemberships((prev) => prev.filter((m) => m.organization_id !== orgId));

        // If this was the current org, switch to another one
        if (current && current.id === orgId) {
          const remaining = memberships.filter((m) => m.organization_id !== orgId);
          if (remaining.length > 0) {
            await switchOrganization(remaining[0].organization_id);
          } else {
            setCurrent(null);
          }
        }
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [current, memberships, switchOrganization, handleError, clearError],
  );

  const inviteUser = useCallback(
    async (orgId: number, data: InviteUserRequest) => {
      try {
        clearError();

        await organizationAPI.inviteUser(orgId, data);

        // Reload to get fresh member data
        await loadOrganizations();
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [loadOrganizations, handleError, clearError],
  );

  const updateMembership = useCallback(
    async (membershipId: number, data: UpdateMembershipRequest) => {
      try {
        clearError();

        await organizationAPI.updateMembership(membershipId, data);

        // Reload to get fresh data
        await loadOrganizations();
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [loadOrganizations, handleError, clearError],
  );

  const removeMember = useCallback(
    async (membershipId: number) => {
      try {
        clearError();

        await organizationAPI.removeMember(membershipId);

        // Reload to get fresh data
        await loadOrganizations();
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [loadOrganizations, handleError, clearError],
  );

  const refresh = useCallback(async () => {
    await loadOrganizations();
  }, [loadOrganizations]);

  // Load organizations when user changes
  useEffect(() => {
    if (user) {
      loadOrganizations();
    } else {
      setCurrent(null);
      setMemberships([]);
      setIsLoading(false);
    }
  }, [user, loadOrganizations]);

  const value: OrganizationContextType = {
    current,
    memberships,
    isLoading,
    error,
    switchOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    inviteUser,
    updateMembership,
    removeMember,
    refresh,
  };

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
}

export function useOrganization(): OrganizationContextType {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}
