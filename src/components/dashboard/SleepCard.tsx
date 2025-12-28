/**
 * SleepCard Component
 * 
 * Displays sleep hours from last night.
 * 
 * TypeScript Concepts:
 * - Simple number display (no progress bar)
 * - Null/undefined handling with optional chaining
 */

interface SleepCardProps {
  /** Hours slept last night */
  hours: number | null;
  /** Sleep goal in hours */
  goal: number;
  /** Show loading state */
  isLoading?: boolean;
}

/**
 * SleepCard - Large number display for sleep hours
 * 
 * Usage:
 * <SleepCard hours={7.5} goal={8} />
 * <SleepCard hours={null} goal={8} /> // Not logged
 */
function SleepCard({ hours, goal, isLoading = false }: SleepCardProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="sleep-card">
        <div className="section-header">SLEEP</div>
        <div className="skeleton" style={{ width: 100, height: 52, marginBottom: 4 }} />
        <span className="sleep-subtext">loading...</span>
      </div>
    );
  }

  // Not logged state
  if (hours === null) {
    return (
      <div className="sleep-card">
        <div className="section-header">SLEEP</div>
        <div className="sleep-value-row">
          <span className="sleep-value">—</span>
        </div>
        <span className="sleep-subtext">not logged</span>
      </div>
    );
  }

  return (
    <div className="sleep-card">
      <div className="section-header">SLEEP</div>
      
      <div className="sleep-value-row">
        <span className="sleep-value">{hours.toFixed(1)}</span>
        <span className="sleep-goal">/ {goal}h</span>
      </div>
      
      <span className="sleep-subtext">last night</span>
    </div>
  );
}

export default SleepCard;

