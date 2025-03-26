
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      fixtures: {
        Row: {
          id: number
          created_at: string | null
          updated_at: string | null
          name: string
          fixture_id: string
          type: string
          description: string | null
          price: number
        }
        Insert: {
          id?: number
          created_at?: string | null
          updated_at?: string | null
          name: string
          fixture_id: string
          type: string
          description?: string | null
          price: number
        }
        Update: {
          id?: number
          created_at?: string | null
          updated_at?: string | null
          name?: string
          fixture_id?: string
          type?: string
          description?: string | null
          price?: number
        }
      }
      settings: {
        Row: {
          id: number
          category: string
          settings: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          category: string
          settings: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          category?: string
          settings?: Json
          created_at?: string | null
          updated_at?: string | null
        }
      }
      submissions: {
        Row: {
          id: number
          customer_details: Json
          estimate_amount: number
          form_data: Json
          breakdown: Json
          status: string
          submitted_at: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          customer_details: Json
          estimate_amount: number
          form_data: Json
          breakdown: Json
          status?: string
          submitted_at: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          customer_details?: Json
          estimate_amount?: number
          form_data?: Json
          breakdown?: Json
          status?: string
          submitted_at?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          created_at: string
          updated_at: string
          avatar_url: string | null
          full_name: string | null
        }
        Insert: {
          id: string
          username?: string | null
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          full_name?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          full_name?: string | null
        }
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
  }
}

// Helper type for Supabase paths
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
