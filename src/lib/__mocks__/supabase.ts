
export const supabase = {
  auth: {
    signUp: jest.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null
    }),
    signInWithPassword: jest.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null
    }),
    signInWithOAuth: jest.fn().mockResolvedValue({
      data: { provider: 'google', url: 'https://example.com' },
      error: null
    }),
    signOut: jest.fn().mockResolvedValue({
      error: null
    }),
    getSession: jest.fn().mockResolvedValue({
      data: { session: null },
      error: null
    }),
    onAuthStateChange: jest.fn().mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } }
    }),
  },
};

export default supabase;
