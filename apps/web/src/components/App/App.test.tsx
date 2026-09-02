import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { App } from './App.js';

describe('App Component', () => {
  it('renders title and handles theme toggle button click', () => {
    render(<App />);
    expect(screen.getByText('FaceLine')).toBeInTheDocument();
    
    const toggleButton = screen.getByTestId('theme-toggle');
    expect(toggleButton).toHaveTextContent('Toggle Theme (light)');
    
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('Toggle Theme (dark)');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
