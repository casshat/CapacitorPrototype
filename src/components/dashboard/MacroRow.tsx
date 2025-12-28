/**
 * MacroRow Component
 * 
 * A single row displaying one macronutrient (protein, carbs, or fat).
 * 
 * TypeScript Concepts:
 * - Simple props interface
 * - String interpolation with template literals
 */

import ProgressBar from '../ui/ProgressBar';

interface MacroRowProps {
  /** Name of the macro (e.g., "Protein") */
  name: string;
  /** Grams consumed */
  current: number;
  /** Goal in grams */
  goal: number;
}

/**
 * MacroRow - Single macro nutrient row with gradient bar
 * 
 * Usage:
 * <MacroRow name="Protein" current={85} goal={120} />
 */
function MacroRow({ name, current, goal }: MacroRowProps) {
  return (
    <div className="macro-row">
      <div className="macro-row-header">
        <span className="macro-label">{name}</span>
        <span className="macro-value">{current} / {goal}g</span>
      </div>
      <ProgressBar value={current} max={goal} variant="gradient" />
    </div>
  );
}

export default MacroRow;

