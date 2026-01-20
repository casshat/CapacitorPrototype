/**
 * MacroProgressItem - Display single macro progress
 * 
 * Shows current/goal grams for a single macro (Protein, Carbs, or Fat)
 * in a compact vertical layout.
 */

interface MacroProgressItemProps {
  /** Macro label */
  label: 'Protein' | 'Carbs' | 'Fat';
  /** Current grams consumed */
  current: number;
  /** Goal grams */
  goal: number;
}

function MacroProgressItem({ label, current, goal }: MacroProgressItemProps) {
  // Round up to whole number for display
  const displayCurrent = Math.ceil(current);
  
  return (
    <div className="macro-progress-item">
      <div className="macro-progress-item__values">
        <span className="macro-progress-item__current">{displayCurrent}</span>
        <span className="macro-progress-item__goal"> / {goal}g</span>
      </div>
      <span className="macro-progress-item__label">{label}</span>
    </div>
  );
}

export default MacroProgressItem;
