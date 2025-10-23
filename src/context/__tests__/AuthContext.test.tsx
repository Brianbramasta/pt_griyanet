import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock component that uses the auth context
const TestComponent = () => {
  const { isAuthenticated, login, logout, user, isLoading, error } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="loading-status">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="error-message">{error || 'No Error'}</div>
      <div data-testid="user-info">{user ? JSON.stringify(user) : 'No User'}</div>
      <button onClick={() => login({ email: 'admin@example.com', password: 'password' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('provides initial authentication state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('error-message')).toHaveTextContent('No Error');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
  });

  test('updates state on successful login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));
    
    // Wait for the login process to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
    
    expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('error-message')).toHaveTextContent('No Error');
    expect(screen.getByTestId('user-info')).not.toHaveTextContent('No User');
    
    // Check localStorage was updated
    expect(localStorage.getItem('auth_token')).not.toBeNull();
    expect(localStorage.getItem('user')).not.toBeNull();
  });

  test('clears state on logout', async () => {
    // Setup initial authenticated state
    localStorage.setItem('auth_token', 'test_token');
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Test User', email: 'test@example.com', role: 'admin' }));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Verify initial authenticated state
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    
    // Trigger logout
    fireEvent.click(screen.getByText('Logout'));
    
    // Verify state after logout
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
    
    // Check localStorage was cleared
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});