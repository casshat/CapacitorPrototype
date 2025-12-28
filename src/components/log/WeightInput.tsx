/**
 * WeightInput - Input for body weight
 * 
 * TypeScript Concepts:
 * - Similar pattern to SleepInput
 */

import StyledInput from '../ui/StyledInput';

interface WeightInputProps {
  /** Weight in lbs (null if not logged) */
  value: number | null;
  /** Update handler */
  onChange: (lbs: number) => void;
}

/**
 * WeightInput - Weight input with label
 */
function WeightInput({ value, onChange }: WeightInputProps) {
  const handleChange = (val: string) => {
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
    }
  };

  return (
    <div className="body-input-row">
      <div className="body-input-label">
        <div className="body-input-label-main">Weight</div>
      </div>
      <div className="body-input-field">
        <StyledInput
          type="number"
          value={value ?? ''}
          onChange={handleChange}
          placeholder="—"
          width={100}
          step="0.1"
          min="0"
        />
        <span className="body-input-unit">lbs</span>
      </div>
    </div>
  );
}

export default WeightInput;

