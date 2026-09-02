import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

export const supabaseAdmin: SupabaseClient = createClient(
  env.SUPABASE_URL || 'https://placeholder.supabase.co',
  env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_role_key'
);
