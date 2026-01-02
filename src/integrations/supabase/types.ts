export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      credits: {
        Row: {
          balance: number
          created_at: string
          id: string
          last_renewal: string
          updated_at: string
          user_id: string
          weekly_allowance: number
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          last_renewal?: string
          updated_at?: string
          user_id: string
          weekly_allowance?: number
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          last_renewal?: string
          updated_at?: string
          user_id?: string
          weekly_allowance?: number
        }
        Relationships: []
      }
      photos: {
        Row: {
          created_at: string
          expires_at: string | null
          file_name: string
          file_size: number | null
          id: string
          mime_type: string | null
          storage_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          file_name: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          storage_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          file_name?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          storage_path?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_prompts: {
        Row: {
          created_at: string
          id: string
          name: string
          prompt: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          prompt: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          prompt?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          paddle_customer_id: string | null
          paddle_subscription_id: string | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          paddle_customer_id?: string | null
          paddle_subscription_id?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          paddle_customer_id?: string | null
          paddle_subscription_id?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          order_index: number
          photo_id: string
          video_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          order_index: number
          photo_id: string
          video_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          order_index?: number
          photo_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_photos_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_photos_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          created_at: string
          credits_used: number | null
          duration_seconds: number | null
          error_message: string | null
          id: string
          metadata: Json | null
          photo_count: number | null
          preview_path: string | null
          prompt: string | null
          status: Database["public"]["Enums"]["video_status"]
          storage_path: string | null
          text_template: Database["public"]["Enums"]["text_template"] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_used?: number | null
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          photo_count?: number | null
          preview_path?: string | null
          prompt?: string | null
          status?: Database["public"]["Enums"]["video_status"]
          storage_path?: string | null
          text_template?: Database["public"]["Enums"]["text_template"] | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_used?: number | null
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          photo_count?: number | null
          preview_path?: string | null
          prompt?: string | null
          status?: Database["public"]["Enums"]["video_status"]
          storage_path?: string | null
          text_template?: Database["public"]["Enums"]["text_template"] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      subscription_plan: "free" | "pro" | "vip"
      text_template:
        | "fade_in"
        | "bounce"
        | "typewriter"
        | "slide_up_glow"
        | "rotate_zoom"
      video_status: "pending" | "processing" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      subscription_plan: ["free", "pro", "vip"],
      text_template: [
        "fade_in",
        "bounce",
        "typewriter",
        "slide_up_glow",
        "rotate_zoom",
      ],
      video_status: ["pending", "processing", "completed", "failed"],
    },
  },
} as const
