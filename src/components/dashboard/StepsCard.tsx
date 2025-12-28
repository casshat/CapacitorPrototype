/**
 * StepsCard Component
 * 
 * Displays daily step count with a circular progress ring.
 * 
 * TypeScript Concepts:
 * - Number formatting (6234 → "6.2k")
 * - Conditional rendering based on data
 */

import ProgressRing from '../ui/ProgressRing';

interface StepsCardProps {
  /** Steps taken today */
  steps: number;
  /** Daily step goal */
  goal: number;
  /** Show loading state */
  isLoading?: boolean;
}

/**
 * Format steps as "X.Xk" (e.g., 6234 → "6.2k")
 */
function formatSteps(steps: number): string {
  if (steps >= 1000) {
    return (steps / 1000).toFixed(1) + 'k';
  }
  return steps.toString();
}

/**
 * Format goal as "Xk" (e.g., 10000 → "10k")
 */
function formatGoal(goal: number): string {
  if (goal >= 1000) {
    return (goal / 1000).toFixed(0) + 'k';
  }
  return goal.toString();
}

/**
 * StepsCard - Circular progress ring with step count
 * 
 * Usage:
 * <StepsCard steps={6234} goal={10000} />
 */
function StepsCard({ steps, goal, isLoading = false }: StepsCardProps) {
  return (
    <div className="steps-card">
      <ProgressRing 
        value={steps} 
        max={goal} 
        isLoading={isLoading}
      >
        {/* Center content inside the ring */}
        <span className="steps-value">
          {isLoading ? '—' : formatSteps(steps)}
        </span>
        <span className="steps-unit">steps</span>
      </ProgressRing>
      
      <span className="steps-goal">of {formatGoal(goal)} goal</span>
    </div>
  );
}

export default StepsCard;

