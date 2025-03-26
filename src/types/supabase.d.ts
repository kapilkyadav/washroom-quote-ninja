
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

  export interface SupabaseClient {
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
    };
  }

  export function createClient(
    supabaseUrl: string,
    supabaseKey: string,
    options?: {
      auth?: {
        persistSession?: boolean;
        storage?: any | null;
        autoRefreshToken?: boolean;
      };
    }
  ): SupabaseClient;
}
