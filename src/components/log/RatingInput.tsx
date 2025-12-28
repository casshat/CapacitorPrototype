/**
 * RatingInput - 1-5 rating selector with Save button
 * 
 * TypeScript Concepts:
 * - Array.from for generating button range
 * - Saved vs unsaved state
 */

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import PrimaryButton from '../ui/PrimaryButton';
import type { Rating } from '../../context/AppContext';

interface RatingInputProps {
  /** Label: "Energy", "Hunger", or "Motivation" */
  label: string;
  /** Current rating value */
  value: Rating | null;
  /** Last saved rating */
  savedValue: Rating | null;
  /** Selection handler (temporary, before save) */
  onChange: (value: Rating) => void;
  /** Save handler */
  onSave: () => void;
}

/**
 * RatingInput - 5 rating buttons with Save
 */
function RatingInput({ label, value, savedValue, onChange, onSave }: RatingInputProps) {
  // Track the locally selected value (before save)
  const [localValue, setLocalValue] = useState<Rating | null>(value);
  // Track whether to show the "Saved" indicator
  const [showSaved, setShowSaved] = useState(false);
  
  // Sync local value with prop when value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // Auto-hide "Saved" after 1.25 seconds
  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => {
        setShowSaved(false);
      }, 1250);
      return () => clearTimeout(timer);
    }
  }, [showSaved]);
  
  const hasUnsavedChanges = localValue !== null && localValue !== savedValue;
  
  const handleSelect = (rating: Rating) => {
    setLocalValue(rating);
    onChange(rating);
  };
  
  const handleSave = () => {
    if (localValue !== null) {
      onSave();
      setShowSaved(true);
      setLocalValue(null); // Deselect after saving
    }
  };

  return (
    <div className="rating-input-row">
      {/* Header with label and saved indicator */}
      <div className="rating-input-header">
        <span className="rating-input-label">{label}</span>
        {showSaved && (
          <span className="rating-input-saved">
            <Check size={14} />
            Saved
          </span>
        )}
      </div>
      
      {/* Rating buttons and Save */}
      <div className="rating-input-controls">
        <div className="rating-buttons">
          {([1, 2, 3, 4, 5] as Rating[]).map((rating) => (
            <button
              key={rating}
              className={`rating-button ${localValue === rating ? 'selected' : ''}`}
              onClick={() => handleSelect(rating)}
            >
              {rating}
            </button>
          ))}
        </div>
        <PrimaryButton
          variant="small"
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
        >
          Save
        </PrimaryButton>
      </div>
    </div>
  );
}

export default RatingInput;

