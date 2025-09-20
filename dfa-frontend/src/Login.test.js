import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';


jest.mock('./api', () => ({
  login: jest.fn()
}));
import { login } from './api';

describe('Login component', () => {
  it('calls onLogin with user and token on successful login', async () => {
    const mockOnLogin = jest.fn();
    login.mockResolvedValueOnce({ user: { id: 1, email: 'test@example.com' }, token: 'abc123' });
    render(<Login onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({ user: { id: 1, email: 'test@example.com' }, token: 'abc123' });
    });
  });

  it('shows error on failed login', async () => {
    const mockOnLogin = jest.fn();
    login.mockRejectedValueOnce(new Error('Login failed'));
    render(<Login onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'fail@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
    expect(mockOnLogin).not.toHaveBeenCalled();
  });
});
