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
// Fallback to hardcoded values for development if env vars not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hxlifqbckrsnatkajdeu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bGlmcWJja3JzbmF0a2FqZGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MTc1NDQsImV4cCI6MjA4MjI5MzU0NH0.kpOE2g-hkY0NV6PE_wxCOqJBFC__bRc0dNgbB5TW_sA';

/**
 * The Supabase client instance
 * 
 * Use this to:
 * - Authenticate users (supabase.auth.signIn, signUp, signOut)
 * - Query the database (supabase.from('table').select())
 * - Subscribe to real-time changes
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

