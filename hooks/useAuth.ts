'use client'

import { useEffect, useState } from 'react'
import { Database } from '@/lib/supabase/types.generated'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase/client'

export type UserData = User & {
  activeProjectId: number
}

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()
    
    const getUser = async () => {
      setLoading(true)

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          setUser(null)
          setLoading(false)
          return
        }

        // const { data: projects } = await supabase.from('projects').select('id').eq('owner_id', session?.user?.id)
        const { data: projects } = await supabase.from('projects').select('id').eq('id', 1) // use this for testing
        if (!projects?.length) {
          
          // Create project first
          const { data: newProject, error: projectError } = await supabase.from('projects').insert({
            owner_id: session?.user?.id,
            name: `${session?.user?.email}'s Project`,
            description: `${session?.user?.email}'s Project Description`,
            created_by: session?.user?.id
          }).select('id').single();

          if (projectError || !newProject) {
            console.error('Error creating project:', projectError)
            setUser(null)
            setLoading(false)
            return
          }

          // Create project-user relationship
          const { error: relationError } = await supabase.from('projects_users').insert({
            project_id: newProject.id,
            user_id: session?.user?.id,
            role: 'owner',
            created_by: session?.user?.id
          });

          if (relationError) {
            console.error('Error creating project-user relationship:', relationError)
            setUser(null)
            setLoading(false)
            return
          }

          setUser({
            ...session?.user,
            activeProjectId: newProject.id
          })
        } else {
          setUser({
            ...session?.user,
            activeProjectId: projects[0].id
          })
        }
      } catch (error) {
        console.error('Error getting auth session:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      getUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
} 