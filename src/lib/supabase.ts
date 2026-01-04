/**
 * Supabase Client Configuration
 * 
 * This file creates and exports the Supabase client used throughout the app.
 * The client handles authentication and database operations.
 * 
 * TypeScript Concepts:
 * - Module exports
 * - Environment configuration
 */

import { createClient } from '@supabase/supabase-js';

// Supabase project credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

/**
 * The Supabase client instance
 * 
 * Use this to:
 * - Authenticate users (supabase.auth.signIn, signUp, signOut)
 * - Query the database (supabase.from('table').select())
 * - Subscribe to real-time changes
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

