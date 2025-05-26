'use client';

import { useEffect, useState } from 'react';
import { Database } from '@/lib/supabase/types.generated';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase/client';

export type UserData = User & {
  activeProjectId: number;
  activeOrganizationId: number;
};

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    const getUser = async () => {
      setLoading(true);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        // use this for testing only
        if (!session?.user?.user_metadata?.avatar_url) {
          const avatars = [
            'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80',
            'https://github.com/shadcn.png',
            'https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80',
          ];
          const avatarUrl = avatars[Math.floor(Math.random() * avatars.length)];

          await supabase.auth.updateUser({
            data: {
              name: session?.user?.email, // use email for now as we dont ask for first and last names yet
              avatar_url: avatarUrl,
            },
          });
        }

        const { data: userProfile, error: userProfileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session?.user?.id)
          .single();
        const organizationId =
          userProfile?.current_organization_id ?? userProfile?.default_organization_id;
        if (!organizationId) {
          console.error('No organization found for user:', session?.user?.id);
          setUser(null);
          setLoading(false);
          return;
        }

        // get projects for the organization
        let projectId: number;
        // const { data: projects } = await supabase.from('projects').select('id').eq('owner_id', session?.user?.id)
        const { data: projects } = await supabase
          .from('projects')
          .select('id')
          .eq('organization_id', organizationId);
        if (!projects?.length) {
          // Create project first
          const { data: newProject, error: projectError } = await supabase
            .from('projects')
            .insert({
              organization_id: organizationId,
              owner_id: session?.user?.id,
              name: `${session?.user?.email}'s Project`,
              description: `${session?.user?.email}'s Project Description`,
              created_by: session?.user?.id,
            })
            .select('id')
            .single();

          if (projectError || !newProject) {
            // Enhanced error logging
            console.error('Error creating project:', {
              message: projectError?.message,
              code: projectError?.code,
              details: projectError?.details,
              hint: projectError?.hint,
              fullError: projectError,
            });
            setUser(null);
            setLoading(false);
            return;
          }

          projectId = newProject.id;
        } else {
          // use the first project in the organization for now
          projectId = projects[0].id;
        }

        const { data: projectUser } = await supabase
          .from('projects_users')
          .select('id')
          .eq('project_id', projectId)
          .eq('user_id', session?.user?.id)
          .single();

        if (!projectUser) {
          // Create project-user relationship
          const { error: relationError } = await supabase.from('projects_users').insert({
            project_id: projectId,
            user_id: session?.user?.id,
            role: 'owner',
            created_by: session?.user?.id,
          });

          if (relationError) {
            console.error('Error creating project-user relationship:', relationError);
            setUser(null);
            setLoading(false);
            return;
          }
        }

        setUser({
          ...session?.user,
          activeProjectId: projectId,
          activeOrganizationId: organizationId,
        });
      } catch (error) {
        console.error('Error getting auth session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      getUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
