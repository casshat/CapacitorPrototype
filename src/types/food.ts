/**
 * Food Logging Types
 * 
 * Type definitions for AI-powered food logging.
 * Uses GPT-4 mini to parse natural language food descriptions.
 */

// ============================================================================
// SERVING UNIT
// ============================================================================

/**
 * Serving unit type (AI always returns grams)
 */
export type ServingUnit = 'g';

// ============================================================================
// AI RESPONSE (from GPT-4 mini)
// ============================================================================

/**
 * Single food item parsed by AI
 */
export interface AIFoodItem {
  name: string;
  amount: number;
  unit: 'g';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Response from GPT-4 mini food parsing
 */
export interface AIFoodResponse {
  foods: AIFoodItem[];
  confidence?: 'high' | 'medium' | 'low';
  source?: string;
  notes?: string;
  error?: string;
  suggestion?: string;
}

// ============================================================================
// FOOD LOG ENTRY (stored in database)
// ============================================================================

/**
 * A single logged food entry stored in the database.
 * Nutrition values are pre-calculated for the specific serving size.
 */
export interface FoodLogEntry {
  /** Unique entry ID (UUID) */
  id: string;
  /** User ID */
  userId: string;
  /** ISO date string: "2026-01-19" */
  date: string;
  
  /** Food information */
  name: string;
  
  /** Serving size (always in grams from AI) */
  amount: number;
  unit: ServingUnit;
  
  /** Calculated nutrition for this serving */
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  
  /** Timestamps */
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// DAILY TOTALS
// ============================================================================

/**
 * Aggregated daily nutrition totals.
 */
export interface DailyFoodTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// ============================================================================
// NUTRITION GOALS (for progress display)
// ============================================================================

/**
 * Daily nutrition goals for display.
 */
export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// ============================================================================
// DATABASE ROW TYPES (Supabase snake_case format)
// ============================================================================

/**
 * Database row format for food_log_entries table.
 * Used for mapping between camelCase and snake_case.
 * Note: brand, source, source_id, barcode are kept nullable for backwards compatibility
 */
export interface DbFoodLogEntry {
  id: string;
  user_id: string;
  log_date: string;
  name: string;
  brand?: string | null;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source?: string | null;
  source_id?: string | null;
  barcode?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Convert database row to app format.
 */
export function dbToFoodLogEntry(row: DbFoodLogEntry): FoodLogEntry {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.log_date,
    name: row.name,
    amount: row.amount,
    unit: row.unit as ServingUnit,
    calories: row.calories,
    protein: row.protein,
    carbs: row.carbs,
    fat: row.fat,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Convert app format to database row.
 */
export function foodLogEntryToDb(entry: FoodLogEntry): Omit<DbFoodLogEntry, 'created_at'> {
  return {
    id: entry.id,
    user_id: entry.userId,
    log_date: entry.date,
    name: entry.name,
    amount: entry.amount,
    unit: entry.unit,
    calories: entry.calories,
    protein: entry.protein,
    carbs: entry.carbs,
    fat: entry.fat,
    updated_at: entry.updatedAt,
  };
}
