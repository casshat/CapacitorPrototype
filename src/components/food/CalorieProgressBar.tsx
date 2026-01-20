/**
 * CalorieProgressBar - Display daily calorie progress
 * 
 * Shows:
 * - Current calories consumed (large number)
 * - Goal calories
 * - Remaining calories
 * - Visual progress bar with gradient
 */

interface CalorieProgressBarProps {
  /** Current calories consumed */
  current: number;
  /** Daily calorie goal */
  goal: number;
}

function CalorieProgressBar({ current, goal }: CalorieProgressBarProps) {
  // Calculate progress percentage (capped at 100%)
  const percentage = Math.min((current / goal) * 100, 100);
  
  // Calculate remaining (can be negative if over goal)
  const remaining = goal - current;
  const isComplete = remaining <= 0;
  
  return (
    <div className="calorie-progress">
      {/* Header row */}
      <div className="calorie-progress__header">
        <div className="calorie-progress__current">
          <span className="calorie-progress__value">{current}</span>
          <span className="calorie-progress__goal">/ {goal} cal</span>
        </div>
        <span className={`calorie-progress__remaining ${isComplete ? 'calorie-progress__remaining--complete' : ''}`}>
          {isComplete ? 'Goal reached!' : `${remaining} left`}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="calorie-progress__track">
        <div 
          className="calorie-progress__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default CalorieProgressBar;
