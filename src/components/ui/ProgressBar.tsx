/**
 * ProgressBar Component
 * 
 * A horizontal progress bar with solid or gradient fill options.
 * 
 * TypeScript Concepts:
 * - Interface for props with optional properties (?)
 * - Default parameter values
 * - Computed values from props
 */

interface ProgressBarProps {
  /** Current value */
  value: number;
  /** Maximum/goal value */
  max: number;
  /** Height in pixels (optional, defaults to 12) */
  height?: number;
  /** Fill style: 'solid' or 'gradient' (optional, defaults to 'gradient') */
  variant?: 'solid' | 'gradient';
  /** Show loading skeleton instead of bar */
  isLoading?: boolean;
}

/**
 * ProgressBar - Horizontal progress indicator
 * 
 * Usage:
 * <ProgressBar value={75} max={100} />
 * <ProgressBar value={1450} max={2000} variant="solid" height={14} />
 */
function ProgressBar({ 
  value, 
  max, 
  height = 12, 
  variant = 'gradient',
  isLoading = false 
}: ProgressBarProps) {
  // Calculate percentage (capped at 100%)
  const percentage = Math.min((value / max) * 100, 100);

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div 
        className="progress-bar skeleton"
        style={{ height: `${height}px` }}
      />
    );
  }

  return (
    <div 
      className={`progress-bar ${height > 12 ? 'progress-bar--large' : ''}`}
      style={{ height: `${height}px` }}
    >
      <div 
        className={`progress-bar__fill ${variant === 'gradient' ? 'progress-bar__fill--gradient' : ''}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default ProgressBar;

