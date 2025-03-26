
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// Mock the useAuth hook for testing
const AuthConsumer = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="loading">{auth.isLoading.toString()}</div>
      <div data-testid="user">{auth.user ? 'User exists' : 'No user'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation for getSession
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null
    });
  });

  test('provides initial auth state', async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // Initially loading should be true
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    // Wait for auth to initialize
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    
    // No user should be logged in initially
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
  });

  test('handles authenticated user', async () => {
    // Mock an authenticated user
    const mockUser = { 
      id: 'user123', 
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };
    
    const mockSession = {
      access_token: 'token123',
      refresh_token: 'refresh123',
      expires_in: 3600,
      user: mockUser,
      token_type: 'bearer'
    };
    
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );
    
    // Wait for auth to initialize and reflect user state
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('User exists');
    });
  });
});
