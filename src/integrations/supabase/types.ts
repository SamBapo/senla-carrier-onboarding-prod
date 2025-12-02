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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      carriers: {
        Row: {
          additional_services: string[] | null
          base_location: string
          business_registration_url: string | null
          comments: string | null
          company_address: string
          company_name: string
          contact_person: string
          contact_role: string
          created_at: string
          email: string
          id: string
          number_of_trucks: number
          preferred_load_types: string[] | null
          preferred_routes: string[] | null
          status: string
          tax_code: string | null
          truck_registration_urls: string[] | null
          updated_at: string
          user_id: string | null
          zalo_number: string
        }
        Insert: {
          additional_services?: string[] | null
          base_location: string
          business_registration_url?: string | null
          comments?: string | null
          company_address: string
          company_name: string
          contact_person: string
          contact_role: string
          created_at?: string
          email: string
          id?: string
          number_of_trucks: number
          preferred_load_types?: string[] | null
          preferred_routes?: string[] | null
          status?: string
          tax_code?: string | null
          truck_registration_urls?: string[] | null
          updated_at?: string
          user_id?: string | null
          zalo_number: string
        }
        Update: {
          additional_services?: string[] | null
          base_location?: string
          business_registration_url?: string | null
          comments?: string | null
          company_address?: string
          company_name?: string
          contact_person?: string
          contact_role?: string
          created_at?: string
          email?: string
          id?: string
          number_of_trucks?: number
          preferred_load_types?: string[] | null
          preferred_routes?: string[] | null
          status?: string
          tax_code?: string | null
          truck_registration_urls?: string[] | null
          updated_at?: string
          user_id?: string | null
          zalo_number?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          carrier_id: string
          created_at: string
          destination: string
          detour_distance: number
          dropoff_deadline: string
          id: string
          load_id: string
          origin: string
          pallets: number | null
          pickup_deadline: string
          price_estimate: number
          status: string
          temperature: string
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          carrier_id: string
          created_at?: string
          destination: string
          detour_distance: number
          dropoff_deadline: string
          id?: string
          load_id: string
          origin: string
          pallets?: number | null
          pickup_deadline: string
          price_estimate: number
          status?: string
          temperature: string
          updated_at?: string
          user_id: string
          weight: number
        }
        Update: {
          carrier_id?: string
          created_at?: string
          destination?: string
          detour_distance?: number
          dropoff_deadline?: string
          id?: string
          load_id?: string
          origin?: string
          pallets?: number | null
          pickup_deadline?: string
          price_estimate?: number
          status?: string
          temperature?: string
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      trucks: {
        Row: {
          carrier_id: string
          created_at: string
          id: string
          license_plate: string
          load_capacity: number
          truck_type: string
          updated_at: string
        }
        Insert: {
          carrier_id: string
          created_at?: string
          id?: string
          license_plate: string
          load_capacity: number
          truck_type: string
          updated_at?: string
        }
        Update: {
          carrier_id?: string
          created_at?: string
          id?: string
          license_plate?: string
          load_capacity?: number
          truck_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trucks_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
