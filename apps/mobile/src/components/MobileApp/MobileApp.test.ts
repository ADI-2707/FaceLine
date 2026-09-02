import { describe, it, expect } from 'vitest';
import { mobileTokens } from '../../theme/tokens';

describe('Mobile Tokens', () => {
  it('should have correct touch target and color tokens', () => {
    expect(mobileTokens.metrics.touchTargetMin).toBe(44);
    expect(mobileTokens.colors.primaryAzure).toBe('#2563eb');
  });
});
