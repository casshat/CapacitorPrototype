/**
 * CalorieCard Component
 * 
 * Displays daily calorie consumption with a progress bar.
 * 
 * TypeScript Concepts:
 * - Computed values (remaining, percentage)
 * - Number formatting with toLocaleString()
 * - Conditional class names
 */

import ProgressBar from '../ui/ProgressBar';

interface CalorieCardProps {
  /** Calories consumed today */
  consumed: number;
  /** Daily calorie goal */
  goal: number;
  /** Show loading skeleton */
  isLoading?: boolean;
}

/**
 * CalorieCard - Large calorie display with progress bar
 * 
 * Usage:
 * <CalorieCard consumed={1450} goal={2000} />
 */
function CalorieCard({ consumed, goal, isLoading = false }: CalorieCardProps) {
  // Calculate remaining calories
  const remaining = Math.max(goal - consumed, 0);
  
  // Format numbers with commas (1450 → "1,450")
  const formattedConsumed = consumed.toLocaleString();
  const formattedGoal = goal.toLocaleString();
  const formattedRemaining = remaining.toLocaleString();

  // Loading state
  if (isLoading) {
    return (
      <section className="calorie-card">
        <div className="section-header">CALORIES</div>
        <div className="calorie-content">
          <div className="skeleton skeleton--number" />
        </div>
        <ProgressBar value={0} max={100} height={14} variant="solid" isLoading />
      </section>
    );
  }

  return (
    <section className="calorie-card">
      <div className="section-header">CALORIES</div>
      
      <div className="calorie-content">
        {/* Large consumed number */}
        <span className="calorie-consumed">{formattedConsumed}</span>
        
        {/* Goal and remaining */}
        <div className="calorie-meta">
          <span className="calorie-goal">/ {formattedGoal} kcal</span>
          <span className="calorie-remaining">{formattedRemaining} left</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <ProgressBar 
        value={consumed} 
        max={goal} 
        height={14} 
        variant="solid" 
      />
    </section>
  );
}

export default CalorieCard;

