/**
 * Unit Conversion Utilities
 * 
 * Functions for converting between grams and ounces.
 */

/** Conversion factor: 1 oz = 28.35 grams */
const GRAMS_PER_OZ = 28.35;

/**
 * Convert grams to ounces, rounded to 1 decimal place.
 * 
 * @param grams - Weight in grams
 * @returns Weight in ounces
 * 
 * @example
 * gramsToOz(100) // returns 3.5
 * gramsToOz(28.35) // returns 1.0
 */
export function gramsToOz(grams: number): number {
  return Math.round((grams / GRAMS_PER_OZ) * 10) / 10;
}

/**
 * Convert ounces to grams, rounded to whole number.
 * 
 * @param oz - Weight in ounces
 * @returns Weight in grams
 * 
 * @example
 * ozToGrams(1) // returns 28
 * ozToGrams(3.5) // returns 99
 */
export function ozToGrams(oz: number): number {
  return Math.round(oz * GRAMS_PER_OZ);
}

/**
 * Format a weight value for display with appropriate precision.
 * 
 * @param amount - Weight amount
 * @param unit - Unit type ('g' or 'oz')
 * @returns Formatted string
 * 
 * @example
 * formatWeight(100, 'g') // returns "100g"
 * formatWeight(3.5, 'oz') // returns "3.5oz"
 */
export function formatWeight(amount: number, unit: 'g' | 'oz'): string {
  if (unit === 'g') {
    return `${Math.round(amount)}g`;
  }
  // For oz, show 1 decimal place
  return `${Math.round(amount * 10) / 10}oz`;
}
