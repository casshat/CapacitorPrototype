/**
 * CollapsibleSection - Expandable/collapsible section wrapper
 * 
 * TypeScript Concepts:
 * - Conditional rendering
 * - CSS transitions for animations
 */

import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';

interface CollapsibleSectionProps {
  /** Section header text */
  title: string;
  /** Current expanded state */
  isExpanded: boolean;
  /** Toggle handler */
  onToggle: () => void;
  /** Section content */
  children: ReactNode;
}

/**
 * CollapsibleSection - Expandable section with smooth animation
 */
function CollapsibleSection({ title, isExpanded, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="collapsible-section">
      {/* Clickable header */}
      <button 
        className="collapsible-section-header"
        onClick={onToggle}
        type="button"
        style={{
          marginBottom: isExpanded ? '20px' : '0',
        }}
      >
        <span className="collapsible-section-title">{title}</span>
        <div className="collapsible-section-icon">
          {isExpanded ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </div>
      </button>

      {/* Content with smooth expand/collapse */}
      <div 
        className={`collapsible-section-content ${isExpanded ? 'expanded' : ''}`}
      >
        {children}
      </div>
    </div>
  );
}

export default CollapsibleSection;

