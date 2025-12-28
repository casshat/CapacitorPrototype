/**
 * CycleBadge Component
 * 
 * Displays the current menstrual cycle phase and day.
 * 
 * TypeScript Concepts:
 * - Importing and using custom types
 * - Capitalizing strings in TypeScript
 */

import { Droplet } from 'lucide-react';
import type { CyclePhase } from '../../context/AppContext';

interface CycleBadgeProps {
  /** Current cycle phase */
  phase: CyclePhase;
  /** Day within current phase */
  day: number;
}

/**
 * CycleBadge - Pill-shaped badge showing cycle info
 * 
 * Usage:
 * <CycleBadge phase="follicular" day={8} />
 */
function CycleBadge({ phase, day }: CycleBadgeProps) {
  // Capitalize first letter of phase for display
  const displayPhase = phase.charAt(0).toUpperCase() + phase.slice(1);

  return (
    <div className="cycle-badge">
      <Droplet size={14} fill="currentColor" />
      <span>{displayPhase} · Day {day}</span>
    </div>
  );
}

export default CycleBadge;

