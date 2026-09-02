import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { App } from './App.js';

vi.mock('../../utils/avatarLoader.js', () => ({
  loadAvatarModel: vi.fn().mockResolvedValue({
    gltf: { scene: { add: vi.fn() }, animations: [] }
  })
}));

describe('FaceLine Web Application', () => {
  it('renders AuthPage initially when unauthenticated', () => {
    render(<App />);
    expect(screen.getByText('FaceLine')).toBeInTheDocument();
    expect(screen.getByText('E2EE 3D Avatar Messaging')).toBeInTheDocument();
  });
});
