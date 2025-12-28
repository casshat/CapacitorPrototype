/**
 * CycleSection - Cycle tracking section with phase badge and period toggle
 * 
 * TypeScript Concepts:
 * - Boolean toggle state
 * - Conditional class names
 */

import CycleBadge from '../dashboard/CycleBadge';
import type { CyclePhase } from '../../context/AppContext';

interface CycleSectionProps {
  /** Current cycle phase */
  phase: CyclePhase;
  /** Day within cycle */
  cycleDay: number;
  /** Days until next predicted period */
  nextPeriodIn: number;
  /** Today's period status */
  isPeriodDay: boolean;
  /** Update handler */
  onPeriodDayChange: (value: boolean) => void;
}

/**
 * CycleSection - Cycle info with Yes/No toggle for period day
 */
function CycleSection({ 
  phase, 
  cycleDay, 
  nextPeriodIn, 
  isPeriodDay, 
  onPeriodDayChange 
}: CycleSectionProps) {
  return (
    <div>
      {/* Phase badge */}
      <div className="cycle-section-badge">
        <CycleBadge phase={phase} day={cycleDay} />
      </div>
      
      {/* Prediction */}
      <div className="cycle-section-prediction">
        Next period in ~{nextPeriodIn} days
      </div>
      
      {/* Period day question */}
      <div className="cycle-section-question">Period day?</div>
      
      {/* Yes/No toggle */}
      <div className="cycle-toggle-buttons">
        <button
          className={`cycle-toggle-button ${isPeriodDay === true ? 'active' : ''}`}
          onClick={() => onPeriodDayChange(true)}
        >
          Yes
        </button>
        <button
          className={`cycle-toggle-button ${isPeriodDay === false ? 'active' : ''}`}
          onClick={() => onPeriodDayChange(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default CycleSection;

