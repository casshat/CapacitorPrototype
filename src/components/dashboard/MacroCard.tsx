/**
 * MacroCard Component
 * 
 * Displays all three macronutrients with progress bars.
 * 
 * TypeScript Concepts:
 * - Nested object types in props
 * - Destructuring complex objects
 */

import MacroRow from './MacroRow';
import type { MacroNutrient } from '../../context/AppContext';

interface MacroCardProps {
  /** Protein data */
  protein: MacroNutrient;
  /** Carbs data */
  carbs: MacroNutrient;
  /** Fat data */
  fat: MacroNutrient;
  /** Show loading skeleton */
  isLoading?: boolean;
}

/**
 * MacroCard - Three macro rows with gradient progress bars
 * 
 * Usage:
 * <MacroCard 
 *   protein={{ current: 85, goal: 120 }}
 *   carbs={{ current: 180, goal: 250 }}
 *   fat={{ current: 45, goal: 65 }}
 * />
 */
function MacroCard({ protein, carbs, fat, isLoading = false }: MacroCardProps) {
  // Loading state with skeleton rows
  if (isLoading) {
    return (
      <section className="macro-card">
        <div className="section-header">MACROS</div>
        <div className="macro-rows">
          {[1, 2, 3].map((i) => (
            <div key={i} className="macro-row">
              <div className="macro-row-header">
                <div className="skeleton" style={{ width: 60, height: 15 }} />
                <div className="skeleton" style={{ width: 70, height: 15 }} />
              </div>
              <div className="skeleton skeleton--bar" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="macro-card">
      <div className="section-header">MACROS</div>
      
      <div className="macro-rows">
        <MacroRow name="Protein" current={protein.current} goal={protein.goal} />
        <MacroRow name="Carbs" current={carbs.current} goal={carbs.goal} />
        <MacroRow name="Fat" current={fat.current} goal={fat.goal} />
      </div>
    </section>
  );
}

export default MacroCard;

