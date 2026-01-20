/**
 * ThemeCard - Individual theme preview card
 * 
 * Shows color swatches and selection state.
 * 
 * TypeScript Concepts:
 * - Theme configuration props
 * - Conditional rendering for checkmark
 */

import { Check } from 'lucide-react';
import type { ThemeConfig } from '../../context/ThemeContext';

interface ThemeCardProps {
  /** Theme configuration */
  theme: ThemeConfig;
  /** Whether this theme is currently selected */
  isSelected: boolean;
  /** Handler when card is clicked */
  onSelect: () => void;
}

/**
 * ThemeCard - Theme preview with color swatches
 */
function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
  return (
    <button
      className={`theme-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      aria-label={`Select ${theme.name} theme`}
      aria-pressed={isSelected}
    >
      {/* Color swatches */}
      <div className="theme-card-swatches">
        <div
          className="theme-card-swatch theme-card-swatch--bg"
          style={{ backgroundColor: theme.colors.bgPrimary }}
        />
        <div
          className="theme-card-swatch"
          style={{ backgroundColor: theme.colors.accent }}
        />
        <div
          className="theme-card-swatch"
          style={{ backgroundColor: theme.colors.gradientStart }}
        />
      </div>

      {/* Footer with name and checkmark */}
      <div className="theme-card-footer">
        <span className="theme-card-name">{theme.name}</span>
        {isSelected && (
          <div className="theme-card-check" aria-label="Currently selected">
            <Check size={12} strokeWidth={3} />
          </div>
        )}
      </div>
    </button>
  );
}

export default ThemeCard;



