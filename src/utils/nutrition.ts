/**
 * Nutrition Calculation Utilities
 * 
 * Functions for aggregating daily totals and progress calculations.
 * Note: AI returns pre-calculated nutrition values, so we no longer need
 * per-100g calculation functions.
 */

import type { FoodLogEntry, DailyFoodTotals } from '../types/food';

/**
 * Sum all food entries to get daily totals.
 * 
 * @param entries - Array of food log entries
 * @returns Aggregated daily nutrition totals
 */
export function calculateDailyTotals(entries: FoodLogEntry[]): DailyFoodTotals {
  return entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

/**
 * Calculate calories from macros (for display/verification).
 * Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g
 * 
 * @param protein - Grams of protein
 * @param carbs - Grams of carbohydrates
 * @param fat - Grams of fat
 * @returns Calculated calories
 */
export function calculateCaloriesFromMacros(
  protein: number,
  carbs: number,
  fat: number
): number {
  return Math.round((protein * 4) + (carbs * 4) + (fat * 9));
}

/**
 * Calculate remaining calories for the day.
 * 
 * @param consumed - Calories consumed
 * @param goal - Daily calorie goal
 * @returns Remaining calories (can be negative if over goal)
 */
export function calculateRemainingCalories(consumed: number, goal: number): number {
  return goal - consumed;
}

/**
 * Calculate progress percentage (capped at 100%).
 * 
 * @param current - Current value
 * @param goal - Goal value
 * @returns Percentage (0-100)
 */
export function calculateProgressPercentage(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min((current / goal) * 100, 100);
}
