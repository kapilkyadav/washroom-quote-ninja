
// This file provides type declarations for the Supabase client

declare module '@supabase/supabase-js' {
  export interface User {
    id: string;
    app_metadata: {
      provider?: string;
      [key: string]: any;
    };
    user_metadata: {
      [key: string]: any;
    };
    aud: string;
    email?: string;
    phone?: string;
    created_at: string;
    confirmed_at?: string;
    last_sign_in_at?: string;
    role?: string;
    updated_at?: string;
    banned?: boolean;
  }

  export interface Session {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at?: number;
    token_type: string;
    user: User;
  }

  export interface ApiError {
    message: string;
    status: number;
  }

  export interface AdminUserManagement {
    listUsers: () => Promise<{
      data: { users: User[] };
      error: ApiError | null;
    }>;
    createUser: (attributes: {
      email: string;
      password: string;
      email_confirm?: boolean;
      user_metadata?: Record<string, any>;
    }) => Promise<{ data: { user: User | null }; error: ApiError | null }>;
    updateUserById: (
      uid: string,
      attributes: { user_metadata?: Record<string, any>; banned?: boolean }
    ) => Promise<{ data: { user: User | null }; error: ApiError | null }>;
    deleteUser: (
      uid: string
    ) => Promise<{ data: { user: User | null }; error: ApiError | null }>;
  }

  export interface SupabaseClient<Database = any> {
    from<TableName extends keyof Database['public']['Tables']>(
      table: TableName
    ): {
      select: (columns?: string) => {
        eq: (column: string, value: any) => {
          single: () => Promise<{
            data: Database['public']['Tables'][TableName]['Row'] | null;
            error: ApiError | null;
          }>;
          maybeSingle: () => Promise<{
            data: Database['public']['Tables'][TableName]['Row'] | null;
            error: ApiError | null;
          }>;
        };
        order: (column: string, options?: { ascending?: boolean }) => {
          limit: (count: number) => Promise<{
            data: Database['public']['Tables'][TableName]['Row'][] | null;
            error: ApiError | null;
          }>;
        };
      };
      upsert: (
        values: Database['public']['Tables'][TableName]['Insert'] | Database['public']['Tables'][TableName]['Insert'][],
        options?: { onConflict?: string }
      ) => Promise<{
        data: Database['public']['Tables'][TableName]['Row'] | null;
        error: ApiError | null;
      }>;
      insert: (
        values: Database['public']['Tables'][TableName]['Insert'] | Database['public']['Tables'][TableName]['Insert'][],
        options?: { returning?: string }
      ) => Promise<{
        data: Database['public']['Tables'][TableName]['Row'] | null;
        error: ApiError | null;
      }>;
      update: (
        values: Database['public']['Tables'][TableName]['Update'],
        options?: { returning?: string }
      ) => {
        eq: (column: string, value: any) => Promise<{
          data: Database['public']['Tables'][TableName]['Row'] | null;
          error: ApiError | null;
        }>;
        match: (query: Record<string, any>) => Promise<{
          data: Database['public']['Tables'][TableName]['Row'] | null;
          error: ApiError | null;
        }>;
      };
      delete: () => {
        eq: (column: string, value: any) => Promise<{
          data: any;
          error: ApiError | null;
        }>;
        match: (query: Record<string, any>) => Promise<{
          data: any;
          error: ApiError | null;
        }>;
      };
      select: (columns?: string) => Promise<{
        data: Database['public']['Tables'][TableName]['Row'][] | null;
        error: ApiError | null;
      }>;
    };
    auth: {
      signUp: (options: {
        email: string;
        password: string;
        options?: {
          data?: Record<string, any>;
          captchaToken?: string;
          redirectTo?: string;
        };
      }) => Promise<{
        data: { user: User | null; session: Session | null };
        error: ApiError | null;
      }>;
      signInWithPassword: (options: {
        email: string;
        password: string;
        options?: {
          captchaToken?: string;
          redirectTo?: string;
        };
      }) => Promise<{
        data: { user: User | null; session: Session | null };
        error: ApiError | null;
      }>;
      signInWithOAuth: (options: {
        provider: string;
        options?: {
          redirectTo?: string;
          scopes?: string;
        };
      }) => Promise<{
        data: { provider?: string; url?: string };
        error: ApiError | null;
      }>;
      signOut: () => Promise<{
        error: ApiError | null;
      }>;
      getSession: () => Promise<{
        data: { session: Session | null };
        error: ApiError | null;
      }>;
      onAuthStateChange: (
        callback: (event: string, session: Session | null) => void
      ) => {
        data: { subscription: { unsubscribe: () => void } };
      };
      admin: AdminUserManagement;
    };
  }

  export function createClient<Database = any>(
    supabaseUrl: string,
    supabaseKey: string,
    options?: {
      auth?: {
        persistSession?: boolean;
        storage?: any | null;
        autoRefreshToken?: boolean;
      };
    }
  ): SupabaseClient<Database>;
}
