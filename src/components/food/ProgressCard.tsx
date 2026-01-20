/**
 * ProgressCard - Daily nutrition progress summary
 * 
 * Container that combines:
 * - CalorieProgressBar at top
 * - Divider
 * - Three MacroProgressItems (Protein, Carbs, Fat)
 */

import CalorieProgressBar from './CalorieProgressBar';
import MacroProgressItem from './MacroProgressItem';

interface ProgressCardProps {
  calories: { current: number; goal: number };
  protein: { current: number; goal: number };
  carbs: { current: number; goal: number };
  fat: { current: number; goal: number };
}

function ProgressCard({ calories, protein, carbs, fat }: ProgressCardProps) {
  return (
    <div className="progress-card">
      {/* Calorie progress */}
      <CalorieProgressBar
        current={calories.current}
        goal={calories.goal}
      />
      
      {/* Divider */}
      <div className="progress-card__divider" />
      
      {/* Macro progress row */}
      <div className="progress-card__macros">
        <MacroProgressItem
          label="Protein"
          current={protein.current}
          goal={protein.goal}
        />
        <div className="progress-card__macro-divider" />
        <MacroProgressItem
          label="Carbs"
          current={carbs.current}
          goal={carbs.goal}
        />
        <div className="progress-card__macro-divider" />
        <MacroProgressItem
          label="Fat"
          current={fat.current}
          goal={fat.goal}
        />
      </div>
    </div>
  );
}

export default ProgressCard;
