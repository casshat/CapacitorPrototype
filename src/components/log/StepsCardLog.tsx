/**
 * StepsCardLog - Display-only steps card for Log page
 * 
 * Different from Dashboard StepsCard:
 * - Has background card
 * - Shows "Auto-synced" label
 * - No progress ring
 */

interface StepsCardLogProps {
  /** Current step count */
  steps: number;
  /** Daily step goal */
  goal: number;
}

/**
 * StepsCardLog - Steps display with card background
 */
function StepsCardLog({ steps, goal }: StepsCardLogProps) {
  return (
    <div className="steps-card-log">
      <div className="steps-card-log-header">
        <span className="steps-card-log-label">Steps</span>
        <span className="steps-card-log-sync">Auto-synced</span>
      </div>
      <div className="steps-card-log-value">{steps.toLocaleString()}</div>
      <div className="steps-card-log-goal">/ {goal.toLocaleString()}</div>
    </div>
  );
}

export default StepsCardLog;

