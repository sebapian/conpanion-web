export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      approval_approvers: {
        Row: {
          approval_id: number
          approver_id: string
        }
        Insert: {
          approval_id: number
          approver_id: string
        }
        Update: {
          approval_id?: number
          approver_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_approvers_approval_id_fkey"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "approvals"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          created_at: string
          entity_id: number
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: number
          last_updated: string
          requester_id: string | null
          status: Database["public"]["Enums"]["approval_status"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          entity_id?: number
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: number
          last_updated?: string
          requester_id?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: number
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: number
          last_updated?: string
          requester_id?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          user_id?: string | null
        }
        Relationships: []
      }
      entity_assignees: {
        Row: {
          assigned_at: string
          assigned_by: string
          entity_id: number
          entity_type: string
          id: number
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          entity_id: number
          entity_type: string
          id?: number
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          entity_id?: number
          entity_type?: string
          id?: number
          user_id?: string
        }
        Relationships: []
      }
      entity_labels: {
        Row: {
          created_at: string
          created_by: string
          entity_id: number
          entity_type: string
          id: number
          label_id: number
        }
        Insert: {
          created_at?: string
          created_by: string
          entity_id: number
          entity_type: string
          id?: number
          label_id: number
        }
        Update: {
          created_at?: string
          created_by?: string
          entity_id?: number
          entity_type?: string
          id?: number
          label_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "entity_labels_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_positions: {
        Row: {
          context: string
          created_at: string
          entity_id: number
          entity_type: string
          id: number
          position: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          context: string
          created_at?: string
          entity_id: number
          entity_type: string
          id?: number
          position: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          context?: string
          created_at?: string
          entity_id?: number
          entity_type?: string
          id?: number
          position?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      form_entries: {
        Row: {
          created_at: string
          deleted_at: string | null
          form_id: number
          id: number
          is_synced: boolean
          last_synced_at: string | null
          name: string | null
          submitted_by_user_id: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          form_id: number
          id?: never
          is_synced?: boolean
          last_synced_at?: string | null
          name?: string | null
          submitted_by_user_id: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          form_id?: number
          id?: never
          is_synced?: boolean
          last_synced_at?: string | null
          name?: string | null
          submitted_by_user_id?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_entries_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_entry_answers: {
        Row: {
          answer_value: Json | null
          created_at: string
          entry_id: number
          id: number
          item_id: number
        }
        Insert: {
          answer_value?: Json | null
          created_at?: string
          entry_id: number
          id?: never
          item_id: number
        }
        Update: {
          answer_value?: Json | null
          created_at?: string
          entry_id?: number
          id?: never
          item_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "form_entry_answers_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "form_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_entry_answers_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "form_items"
            referencedColumns: ["id"]
          },
        ]
      }
      form_items: {
        Row: {
          display_order: number
          form_id: number
          id: number
          is_required: boolean | null
          item_type: Database["public"]["Enums"]["item_type"]
          options: Json | null
          question_value: string | null
        }
        Insert: {
          display_order: number
          form_id: number
          id?: never
          is_required?: boolean | null
          item_type: Database["public"]["Enums"]["item_type"]
          options?: Json | null
          question_value?: string | null
        }
        Update: {
          display_order?: number
          form_id?: number
          id?: never
          is_required?: boolean | null
          item_type?: Database["public"]["Enums"]["item_type"]
          options?: Json | null
          question_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_items_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          is_synced: boolean
          last_synced_at: string | null
          name: string
          owner_id: string
          project_id: number | null
          team_id: string | null
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: never
          is_synced?: boolean
          last_synced_at?: string | null
          name: string
          owner_id: string
          project_id?: number | null
          team_id?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: never
          is_synced?: boolean
          last_synced_at?: string | null
          name?: string
          owner_id?: string
          project_id?: number | null
          team_id?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "forms_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      labels: {
        Row: {
          color: string | null
          created_at: string
          created_by: string
          description: string | null
          id: number
          name: string
          project_id: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: number
          name: string
          project_id: number
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          name?: string
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "labels_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_users: {
        Row: {
          id: number
          invited_at: string | null
          invited_by: string | null
          joined_at: string
          last_accessed_at: string | null
          notifications_enabled: boolean | null
          organization_id: number
          role: string
          status: string | null
          user_id: string
        }
        Insert: {
          id?: number
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string
          last_accessed_at?: string | null
          notifications_enabled?: boolean | null
          organization_id: number
          role: string
          status?: string | null
          user_id: string
        }
        Update: {
          id?: number
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string
          last_accessed_at?: string | null
          notifications_enabled?: boolean | null
          organization_id?: number
          role?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: number
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      priorities: {
        Row: {
          color: string | null
          created_at: string
          created_by: string
          id: number
          is_default: boolean
          name: string
          position: number
          project_id: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by: string
          id?: number
          is_default?: boolean
          name: string
          position?: number
          project_id: number
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string
          id?: number
          is_default?: boolean
          name?: string
          position?: number
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "priorities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          archived_at: string | null
          archived_by: string | null
          created_at: string
          created_by: string
          description: string | null
          id: number
          is_archived: boolean
          name: string
          organization_id: number | null
          owner_id: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          archived_by?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: number
          is_archived?: boolean
          name: string
          organization_id?: number | null
          owner_id: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          archived_by?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          is_archived?: boolean
          name?: string
          organization_id?: number | null
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      projects_users: {
        Row: {
          created_at: string
          created_by: string
          id: number
          project_id: number
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: number
          project_id: number
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          project_id?: number
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_users_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      site_diaries: {
        Row: {
          created_at: string
          date: string
          deleted_at: string | null
          id: number
          metadata: Json | null
          name: string
          project_id: number
          submitted_by_user_id: string
          template_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          date?: string
          deleted_at?: string | null
          id?: never
          metadata?: Json | null
          name: string
          project_id: number
          submitted_by_user_id: string
          template_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          deleted_at?: string | null
          id?: never
          metadata?: Json | null
          name?: string
          project_id?: number
          submitted_by_user_id?: string
          template_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_diaries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_diaries_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "site_diary_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      site_diary_answers: {
        Row: {
          answer_value: Json | null
          created_at: string
          diary_id: number
          id: number
          item_id: number
        }
        Insert: {
          answer_value?: Json | null
          created_at?: string
          diary_id: number
          id?: never
          item_id: number
        }
        Update: {
          answer_value?: Json | null
          created_at?: string
          diary_id?: number
          id?: never
          item_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "site_diary_answers_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "site_diaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_diary_answers_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "site_diary_template_items"
            referencedColumns: ["id"]
          },
        ]
      }
      site_diary_template_items: {
        Row: {
          display_order: number
          id: number
          is_required: boolean | null
          item_type: Database["public"]["Enums"]["item_type"]
          metadata: Json | null
          options: Json | null
          question_value: string | null
          template_id: number
        }
        Insert: {
          display_order: number
          id?: never
          is_required?: boolean | null
          item_type: Database["public"]["Enums"]["item_type"]
          metadata?: Json | null
          options?: Json | null
          question_value?: string | null
          template_id: number
        }
        Update: {
          display_order?: number
          id?: never
          is_required?: boolean | null
          item_type?: Database["public"]["Enums"]["item_type"]
          metadata?: Json | null
          options?: Json | null
          question_value?: string | null
          template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "site_diary_template_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "site_diary_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      site_diary_templates: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          id: number
          metadata: Json | null
          name: string
          project_id: number
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          id?: never
          metadata?: Json | null
          name: string
          project_id: number
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          id?: never
          metadata?: Json | null
          name?: string
          project_id?: number
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "site_diary_templates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      statuses: {
        Row: {
          color: string | null
          created_at: string
          created_by: string
          id: number
          is_default: boolean
          name: string
          position: number
          project_id: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by: string
          id?: number
          is_default?: boolean
          name: string
          position?: number
          project_id: number
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string
          id?: number
          is_default?: boolean
          name?: string
          position?: number
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "statuses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          content: string
          created_at: string
          id: number
          task_id: number
          user_avatar: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          task_id: number
          user_avatar?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          task_id?: number
          user_avatar?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_metadata: {
        Row: {
          created_at: string
          created_by: string
          id: number
          task_id: number
          title: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: number
          task_id: number
          title: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          task_id?: number
          title?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_metadata_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: number
          parent_task_id: number | null
          priority_id: number
          project_id: number | null
          status_id: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: number
          parent_task_id?: number | null
          priority_id: number
          project_id?: number | null
          status_id: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: number
          parent_task_id?: number | null
          priority_id?: number
          project_id?: number | null
          status_id?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_priority_id_fkey"
            columns: ["priority_id"]
            isOneToOne: false
            referencedRelation: "priorities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          current_organization_id: number | null
          default_organization_id: number | null
          failed_login_attempts: number | null
          global_avatar_url: string | null
          global_display_name: string | null
          id: string
          last_organization_switch_at: string | null
          locked_until: string | null
          preferred_language: string | null
          preferred_timezone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_organization_id?: number | null
          default_organization_id?: number | null
          failed_login_attempts?: number | null
          global_avatar_url?: string | null
          global_display_name?: string | null
          id: string
          last_organization_switch_at?: string | null
          locked_until?: string | null
          preferred_language?: string | null
          preferred_timezone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_organization_id?: number | null
          default_organization_id?: number | null
          failed_login_attempts?: number | null
          global_avatar_url?: string | null
          global_display_name?: string | null
          id?: string
          last_organization_switch_at?: string | null
          locked_until?: string | null
          preferred_language?: string | null
          preferred_timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_current_organization_id_fkey"
            columns: ["current_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_default_organization_id_fkey"
            columns: ["default_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_change_member_role: {
        Args: {
          changer_user_id: string
          target_member_id: number
          new_role: string
          org_id: number
        }
        Returns: boolean
      }
      convert_slugs_to_hash: {
        Args: Record<PropertyKey, never>
        Returns: {
          org_id: number
          old_slug: string
          new_slug: string
          updated: boolean
        }[]
      }
      create_organization: {
        Args: {
          org_name: string
          org_description?: string
        }
        Returns: number
      }
      create_organization_for_existing_user: {
        Args: {
          target_user_id: string
        }
        Returns: number
      }
      ensure_user_has_organization: {
        Args: {
          target_user_id: string
        }
        Returns: number
      }
      generate_organization_slug: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_or_create_default_organization: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_organization_members: {
        Args: {
          org_id: number
        }
        Returns: {
          membership_id: number
          user_id: string
          role: string
          status: string
          joined_at: string
          invited_by: string
          display_name: string
          user_email: string
        }[]
      }
      get_user_details: {
        Args: {
          user_ids: string[]
        }
        Returns: {
          id: string
          raw_user_meta_data: Json
        }[]
      }
      get_user_organization_ids: {
        Args: {
          target_user_id: string
        }
        Returns: {
          organization_id: number
        }[]
      }
      get_user_organizations: {
        Args: Record<PropertyKey, never>
        Returns: {
          organization_id: number
          organization_name: string
          organization_slug: string
          user_role: string
          user_status: string
          joined_at: string
          last_accessed_at: string
          is_current: boolean
        }[]
      }
      invite_user_to_organization: {
        Args: {
          org_id: number
          user_email: string
          user_role?: string
        }
        Returns: boolean
      }
      rerun_slug_conversion: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      switch_organization_context: {
        Args: {
          new_org_id: number
        }
        Returns: boolean
      }
      test_user_signup_process: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_organization_member_role: {
        Args: {
          member_id: number
          new_role: string
        }
        Returns: boolean
      }
      user_has_org_permission: {
        Args: {
          org_id: number
          required_roles?: string[]
        }
        Returns: boolean
      }
    }
    Enums: {
      approval_status:
        | "draft"
        | "submitted"
        | "approved"
        | "declined"
        | "revision_requested"
      entity_type: "site_diary" | "form" | "entries" | "tasks"
      item_type: "question" | "checklist" | "radio_box" | "photo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

