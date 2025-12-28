/**
 * CaloriesSummary - Displays calculated calories from macros
 * 
 * TypeScript Concepts:
 * - Computed values passed as props
 */

import { calculateCalories } from '../../context/AppContext';

interface CaloriesSummaryProps {
  /** Protein in grams */
  protein: number;
  /** Carbs in grams */
  carbs: number;
  /** Fat in grams */
  fat: number;
  /** Daily calorie goal */
  goal: number;
}

/**
 * CaloriesSummary - Card showing total calculated calories
 * 
 * Calories are calculated: (protein * 4) + (carbs * 4) + (fat * 9)
 */
function CaloriesSummary({ protein, carbs, fat, goal }: CaloriesSummaryProps) {
  const calories = calculateCalories(protein, carbs, fat);
  
  return (
    <div className="calories-summary">
      <span className="calories-summary-label">Total Calories</span>
      <span className="calories-summary-value">
        {calories.toLocaleString()}
        <span className="calories-summary-goal"> / {goal.toLocaleString()} kcal</span>
      </span>
    </div>
  );
}

export default CaloriesSummary;

