import { Database } from "@/lib/supabase/types.generated"

export type TaskWithRelations = Database['public']['Tables']['tasks']['Row'] & {
    priorities: Database['public']['Tables']['priorities']['Row'] | null
    statuses: Database['public']['Tables']['statuses']['Row'] | null
    entity_assignees: Array<{
      entity_id: number
      user_id: string
      users: {
        id: string
        raw_user_meta_data: {
          name: string
          avatar_url?: string
        }
      }
    }>
    entity_labels: Array<{
      entity_id: number
      label_id: number
      labels: Database['public']['Tables']['labels']['Row'] | null
    }>
  }

  // Define interface for user data
export interface UserData {
    id: string;
    raw_user_meta_data: {
      name: string;
      avatar_url?: string;
    };
  }
