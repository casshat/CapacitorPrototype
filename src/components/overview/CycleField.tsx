/**
 * CycleField - Input field for cycle settings
 * 
 * TypeScript Concepts:
 * - Union types for field variants
 * - Date input handling
 */

import { useState, useEffect } from 'react';
import PrimaryButton from '../ui/PrimaryButton';

interface CycleFieldProps {
  /** Label: "Cycle Length", "Average Period Days", "Last Period Start Date" */
  label: string;
  /** Field value (number or date string) */
  value: number | string | null;
  /** Change handler */
  onChange: (value: number | string) => Promise<void>;
  /** Unit: "days" (not used for date) */
  unit?: string;
  /** Input type */
  type?: 'number' | 'date';
}

/**
 * CycleField - Cycle setting input field with save button
 */
function CycleField({ label, value, onChange, unit, type = 'number' }: CycleFieldProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  // Initialize from prop value
  useEffect(() => {
    if (value !== null) {
      setInputValue(value.toString());
    } else {
      setInputValue('');
    }
    setHasChanged(false);
  }, [value]);

  const handleChange = (val: string) => {
    setInputValue(val);
    setHasChanged(val !== (value?.toString() || ''));
  };

  const handleSave = async () => {
    if (!hasChanged) return;

    setIsSaving(true);
    try {
      if (type === 'date') {
        await onChange(inputValue);
      } else {
        const numValue = parseFloat(inputValue) || 0;
        await onChange(numValue);
      }
      setHasChanged(false);
    } catch (error) {
      console.error('Failed to save cycle field:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isValid = type === 'date'
    ? inputValue.length > 0
    : !isNaN(parseFloat(inputValue)) && parseFloat(inputValue) > 0;

  return (
    <div className="cycle-field">
      <label className="cycle-field-label">{label}</label>
      
      <div className="cycle-field-controls">
        <div className="cycle-field-input-wrapper">
          <input
            type={type}
            className={`cycle-field-input ${type === 'date' ? 'cycle-field-input-date' : ''}`}
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={isSaving}
          />
          {unit && type === 'number' && (
            <span className="cycle-field-unit">{unit}</span>
          )}
        </div>
        <PrimaryButton
          variant="small"
          onClick={handleSave}
          disabled={!hasChanged || !isValid || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </PrimaryButton>
      </div>
    </div>
  );
}

export default CycleField;

