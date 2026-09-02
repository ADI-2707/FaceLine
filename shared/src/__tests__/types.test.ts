import { describe, it, expect } from 'vitest';
import { User, Conversation } from '../index.js';

describe('Shared Types', () => {
  it('should instantiate valid User and Conversation objects', () => {
    const user: User = {
      id: 'usr_1',
      name: 'Alice',
      email: 'alice@example.com',
      createdAt: new Date().toISOString()
    };

    const conversation: Conversation = {
      id: 'conv_1',
      isGroup: false,
      createdAt: new Date().toISOString()
    };

    expect(user.id).toBe('usr_1');
    expect(conversation.isGroup).toBe(false);
  });
});
