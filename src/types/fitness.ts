/**
 * FitTrack TypeScript Types
 * 
 * This file defines all the data types used throughout the app.
 * Using TypeScript helps catch errors early and provides autocomplete.
 */

// ============================================================================
// CYCLE TRACKING
// ============================================================================

/**
 * Union type for menstrual cycle phases
 * 
 * TypeScript Concept: Union Types
 * The | symbol means "or" — phase can be ONE of these four values, nothing else.
 * This prevents typos like 'folliculer' (misspelled) from sneaking in.
 */
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

/**
 * Cycle data for the badge
 */
export interface CycleData {
  phase: CyclePhase;
  day: number;
}

/**
 * Cycle info (calculated server-side from period history)
 */
export interface CycleInfo {
  phase: CyclePhase;
  cycleDay: number;
  nextPeriodIn: number;
}

// ============================================================================
// NUTRITION
// ============================================================================

/**
 * Calorie tracking data
 * 
 * TypeScript Concept: Interface
 * An interface defines the "shape" of an object — what properties it must have
 * and what types those properties are.
 */
export interface CalorieData {
  consumed: number;
  goal: number;
}

/**
 * Single macro nutrient data
 */
export interface MacroNutrient {
  current: number;
  goal: number;
}

/**
 * All three macro nutrients
 */
export interface MacroData {
  protein: MacroNutrient;
  carbs: MacroNutrient;
  fat: MacroNutrient;
}

// ============================================================================
// ACTIVITY
// ============================================================================

/**
 * Step count data
 */
export interface StepsData {
  steps: number;
  goal: number;
}

/**
 * Sleep tracking data
 */
export interface SleepData {
  hours: number;
  goal: number;
}

// ============================================================================
// DASHBOARD STATE
// ============================================================================

/**
 * Loading state type
 * 
 * TypeScript Concept: Union Type for State
 * This pattern is great for UI state — you always know exactly what
 * states your component can be in.
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Complete dashboard data
 * 
 * TypeScript Concept: Optional Properties (?)
 * The ? after a property name means it's optional.
 * cycle?: CycleData means the user might not have cycle tracking enabled.
 */
export interface DashboardData {
  date: Date;
  cycle?: CycleData;
  calories: CalorieData;
  macros: MacroData;
  steps: StepsData;
  sleep: SleepData;
}

// ============================================================================
// TAB NAVIGATION
// ============================================================================

/**
 * Tab identifiers
 */
export type TabId = 'dashboard' | 'log' | 'overview';

/**
 * Tab configuration
 */
export interface TabConfig {
  id: TabId;
  label: string;
  path: string;
}

// ============================================================================
// DAILY LOG (Persisted Data)
// ============================================================================

/**
 * Rating value type (1-5 scale)
 * 
 * TypeScript Concept: Literal Union Types
 * This ensures a rating can only be 1, 2, 3, 4, or 5 — nothing else.
 */
export type Rating = 1 | 2 | 3 | 4 | 5;

/**
 * DailyLog - All data for a single day
 * 
 * This is the main data structure that gets persisted to localStorage.
 * Both Dashboard and Log pages read/write to this.
 */
export interface DailyLog {
  /** ISO date string: "2024-12-25" */
  date: string;
  
  // Macros (stored as running totals for the day)
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  // Note: calories are CALCULATED from macros, not stored:
  // calories = (protein * 4) + (carbs * 4) + (fat * 9)
  
  // Body measurements
  sleepHours: number | null;
  weightLbs: number | null;
  
  // Cycle tracking
  isPeriodDay: boolean | null;
  
  // Activity (from HealthKit in V2, mock data in V1)
  steps: number;
  
  // Subjective ratings (how you feel)
  energyRating: Rating | null;
  hungerRating: Rating | null;
  motivationRating: Rating | null;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Gets a date as YYYY-MM-DD string in local timezone.
 * This ensures logs reset at midnight in the user's timezone, not UTC.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Helper function to create an empty daily log
 */
export function createEmptyDailyLog(date: Date): DailyLog {
  const dateString = getLocalDateString(date);
  const now = new Date().toISOString();
  
  return {
    date: dateString,
    proteinGrams: 0,
    carbsGrams: 0,
    fatGrams: 0,
    sleepHours: null,
    weightLbs: null,
    isPeriodDay: null,
    steps: 0,
    energyRating: null,
    hungerRating: null,
    motivationRating: null,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Calculate total calories from macros
 */
export function calculateCalories(protein: number, carbs: number, fat: number): number {
  return (protein * 4) + (carbs * 4) + (fat * 9);
}

// ============================================================================
// GOALS (User preferences)
// ============================================================================

/**
 * User's daily goals
 */
export interface UserGoals {
  caloriesGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  stepsGoal: number;
  sleepGoal: number;
}

/**
 * Default goals for new users
 */
export const DEFAULT_GOALS: UserGoals = {
  caloriesGoal: 2000,
  proteinGoal: 120,
  carbsGoal: 250,
  fatGoal: 65,
  stepsGoal: 10000,
  sleepGoal: 8,
};

