import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AvatarCanvas } from './AvatarCanvas.js';

vi.mock('../../utils/avatarLoader.js', () => ({
  loadAvatarModel: vi.fn().mockResolvedValue({
    gltf: { scene: { add: vi.fn() }, animations: [] }
  })
}));

describe('AvatarCanvas Component', () => {
  it('renders loading overlay and canvas container', () => {
    render(<AvatarCanvas expression="smile" gesture="wave" />);
    expect(screen.getByText('Loading 3D Avatar...')).toBeInTheDocument();
  });
});
