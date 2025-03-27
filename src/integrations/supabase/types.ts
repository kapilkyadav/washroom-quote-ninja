export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      fixtures: {
        Row: {
          created_at: string | null
          description: string | null
          fixture_id: string
          id: number
          name: string
          price: number
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fixture_id: string
          id?: number
          name: string
          price?: number
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fixture_id?: string
          id?: number
          name?: string
          price?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      import_configurations: {
        Row: {
          column_mappings: Json
          created_at: string
          id: number
          last_used: string
          name: string
          source_type: string
          source_url: string | null
          updated_at: string
        }
        Insert: {
          column_mappings?: Json
          created_at?: string
          id?: number
          last_used?: string
          name: string
          source_type: string
          source_url?: string | null
          updated_at?: string
        }
        Update: {
          column_mappings?: Json
          created_at?: string
          id?: number
          last_used?: string
          name?: string
          source_type?: string
          source_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          brand_id: number | null
          client_price: number
          created_at: string
          description: string | null
          extra_data: Json | null
          id: number
          margin: number
          name: string
          quotation_price: number
          sku: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          brand_id?: number | null
          client_price?: number
          created_at?: string
          description?: string | null
          extra_data?: Json | null
          id?: number
          margin?: number
          name: string
          quotation_price?: number
          sku?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          brand_id?: number | null
          client_price?: number
          created_at?: string
          description?: string | null
          extra_data?: Json | null
          id?: number
          margin?: number
          name?: string
          quotation_price?: number
          sku?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          category: string
          created_at: string | null
          id: number
          settings: Json
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: number
          settings?: Json
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: number
          settings?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          breakdown: Json
          created_at: string | null
          customer_details: Json
          estimate_amount: number
          form_data: Json
          id: number
          status: string
          submitted_at: string
          updated_at: string | null
        }
        Insert: {
          breakdown: Json
          created_at?: string | null
          customer_details: Json
          estimate_amount: number
          form_data: Json
          id?: number
          status?: string
          submitted_at: string
          updated_at?: string | null
        }
        Update: {
          breakdown?: Json
          created_at?: string | null
          customer_details?: Json
          estimate_amount?: number
          form_data?: Json
          id?: number
          status?: string
          submitted_at?: string
          updated_at?: string | null
        }
        Relationships: []
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
