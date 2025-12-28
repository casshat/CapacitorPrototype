/**
 * QuickStatCard - Card showing 7-day average with progress bar
 * 
 * TypeScript Concepts:
 * - Conditional rendering for empty states
 * - Progress calculation
 */

import ProgressBar from '../ui/ProgressBar';

interface QuickStatCardProps {
  /** Label: "Avg Calories", "Avg Protein", etc. */
  label: string;
  /** 7-day average value */
  average: number | null;
  /** Goal value */
  goal: number;
  /** Unit: "kcal", "g", "h", or empty string */
  unit: string;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * QuickStatCard - Stat card with average, goal, and progress bar
 */
function QuickStatCard({ label, average, goal, unit, isLoading = false }: QuickStatCardProps) {
  // Check if we have enough data (need at least some data points)
  const hasData = average !== null && !isNaN(average);
  const hasEnoughData = hasData; // Calculate from available days per PM decision

  const formatValue = (val: number): string => {
    if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'k';
    }
    return val.toFixed(1);
  };

  return (
    <div className="quick-stat-card">
      <div className="quick-stat-label">{label}</div>
      
      {isLoading ? (
        <div className="quick-stat-skeleton">
          <div className="skeleton skeleton--text" style={{ width: '60%', marginBottom: '8px' }} />
          <ProgressBar value={0} max={100} height={10} isLoading={true} />
        </div>
      ) : !hasEnoughData ? (
        <div className="quick-stat-empty">
          <div className="quick-stat-empty-value">—</div>
          <div className="quick-stat-empty-subtext">Need 7 days of data</div>
        </div>
      ) : (
        <>
          <div className="quick-stat-values">
            <span className="quick-stat-average">
              {average !== null ? formatValue(average) : '—'}
            </span>
            <span className="quick-stat-goal">
              {' / '}
              {formatValue(goal)}
              {unit ? ` ${unit}` : ''}
            </span>
          </div>
          <ProgressBar 
            value={average || 0} 
            max={goal} 
            height={10}
            variant="gradient"
          />
        </>
      )}
    </div>
  );
}

export default QuickStatCard;

