import { describe, it, expect } from 'vitest';
import { supabaseAdmin } from '../db/supabase.js';

describe('Supabase Admin Client', () => {
  it('should initialize Supabase client instance', () => {
    expect(supabaseAdmin).toBeDefined();
    expect(supabaseAdmin.auth).toBeDefined();
    expect(supabaseAdmin.storage).toBeDefined();
  });
});
