/**
 * ProfileField - Input field for profile data
 * 
 * TypeScript Concepts:
 * - Union types for field variants
 * - Conditional rendering based on type
 */

import { useState, useEffect } from 'react';
import PrimaryButton from '../ui/PrimaryButton';

interface ProfileFieldProps {
  /** Label: "Age", "Height", "Weight" */
  label: string;
  /** Field value (number for single, object for height) */
  value: number | { feet: number; inches: number } | null;
  /** Change handler */
  onChange: (value: number | { feet: number; inches: number }) => Promise<void>;
  /** Unit: "years", "lbs" (not used for height) */
  unit?: string;
  /** Input type */
  type?: 'single' | 'height';
}

/**
 * ProfileField - Profile input field with save button
 */
function ProfileField({ label, value, onChange, unit, type = 'single' }: ProfileFieldProps) {
  // Single input state
  const [singleValue, setSingleValue] = useState<string>('');
  
  // Height input state
  const [feetValue, setFeetValue] = useState<string>('');
  const [inchesValue, setInchesValue] = useState<string>('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  // Initialize from prop value
  useEffect(() => {
    if (type === 'height') {
      if (value && typeof value === 'object') {
        setFeetValue(value.feet.toString());
        setInchesValue(value.inches.toString());
      } else {
        setFeetValue('');
        setInchesValue('');
      }
    } else {
      if (value && typeof value === 'number') {
        setSingleValue(value.toString());
      } else {
        setSingleValue('');
      }
    }
    setHasChanged(false);
  }, [value, type]);

  const handleSingleChange = (val: string) => {
    setSingleValue(val);
    setHasChanged(val !== (value?.toString() || ''));
  };

  const handleHeightChange = (feet: string, inches: string) => {
    setFeetValue(feet);
    setInchesValue(inches);
    const currentFeet = value && typeof value === 'object' ? value.feet : 0;
    const currentInches = value && typeof value === 'object' ? value.inches : 0;
    setHasChanged(feet !== currentFeet.toString() || inches !== currentInches.toString());
  };

  const handleSave = async () => {
    if (!hasChanged) return;

    setIsSaving(true);
    try {
      if (type === 'height') {
        const feet = parseInt(feetValue) || 0;
        const inches = parseInt(inchesValue) || 0;
        await onChange({ feet, inches });
      } else {
        const numValue = parseFloat(singleValue) || 0;
        await onChange(numValue);
      }
      setHasChanged(false);
    } catch (error) {
      console.error('Failed to save profile field:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isValid = type === 'height'
    ? (parseInt(feetValue) || 0) >= 0 && (parseInt(inchesValue) || 0) >= 0
    : !isNaN(parseFloat(singleValue)) && parseFloat(singleValue) > 0;

  return (
    <div className="profile-field">
      <label className="profile-field-label">{label}</label>
      
      {type === 'height' ? (
        <div className="profile-field-controls">
          <div className="profile-field-height-inputs">
            <input
              type="number"
              className="profile-field-input profile-field-input-height"
              value={feetValue}
              onChange={(e) => handleHeightChange(e.target.value, inchesValue)}
              placeholder="5"
              disabled={isSaving}
            />
            <span className="profile-field-unit">ft</span>
            <input
              type="number"
              className="profile-field-input profile-field-input-height"
              value={inchesValue}
              onChange={(e) => handleHeightChange(feetValue, e.target.value)}
              placeholder="5"
              disabled={isSaving}
            />
            <span className="profile-field-unit">in</span>
          </div>
          <PrimaryButton
            variant="small"
            onClick={handleSave}
            disabled={!hasChanged || !isValid || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </PrimaryButton>
        </div>
      ) : (
        <div className="profile-field-controls">
          <div className="profile-field-input-wrapper">
            <input
              type="number"
              className="profile-field-input"
              value={singleValue}
              onChange={(e) => handleSingleChange(e.target.value)}
              placeholder="0"
              disabled={isSaving}
            />
            {unit && <span className="profile-field-unit">{unit}</span>}
          </div>
          <PrimaryButton
            variant="small"
            onClick={handleSave}
            disabled={!hasChanged || !isValid || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

export default ProfileField;

