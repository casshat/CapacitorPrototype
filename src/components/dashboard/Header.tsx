/**
 * Header Component
 * 
 * Displays the current date and optional cycle badge.
 * 
 * TypeScript Concepts:
 * - Date formatting with Intl.DateTimeFormat
 * - Optional props with conditional rendering
 */

import CycleBadge from './CycleBadge';
import type { CycleData } from '../../context/AppContext';

interface HeaderProps {
  /** Date to display */
  date: Date;
  /** Cycle data (optional - user may not have cycle tracking enabled) */
  cycle?: CycleData;
}

/**
 * Header - Dashboard header with date and cycle badge
 * 
 * Usage:
 * <Header date={new Date()} cycle={{ phase: 'follicular', day: 8 }} />
 * <Header date={new Date()} /> // Without cycle tracking
 */
function Header({ date, cycle }: HeaderProps) {
  // Format date as "Wednesday, Dec 25"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(date);

  return (
    <header className="dashboard-header">
      <span className="dashboard-date">{formattedDate}</span>
      
      {/* Only render CycleBadge if cycle data exists */}
      {cycle && (
        <CycleBadge phase={cycle.phase} day={cycle.day} />
      )}
    </header>
  );
}

export default Header;

