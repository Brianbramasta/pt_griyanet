import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input Component', () => {
  test('renders input with label', () => {
    render(<Input label="Username" name="username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  test('calls onChange handler when input value changes', () => {
    const handleChange = jest.fn();
    render(<Input label="Username" name="username" onChange={handleChange} />);
    
    const input = screen.getByLabelText('Username');
    fireEvent.change(input, { target: { value: 'testuser' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('displays error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<Input label="Username" name="username" error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toHaveClass('border-red-500');
  });

  test('applies disabled state when disabled prop is true', () => {
    render(<Input label="Username" name="username" disabled />);
    
    expect(screen.getByLabelText('Username')).toBeDisabled();
  });

  test('renders with placeholder text', () => {
    const placeholder = 'Enter your username';
    render(<Input label="Username" name="username" placeholder={placeholder} />);
    
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  test('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input label="Username" name="username" ref={ref} />);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
  });
});