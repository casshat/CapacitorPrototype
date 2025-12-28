/**
 * SleepInput - Input for sleep hours
 * 
 * TypeScript Concepts:
 * - Handling null values
 * - Controlled number input
 */

import StyledInput from '../ui/StyledInput';

interface SleepInputProps {
  /** Hours slept (null if not logged) */
  value: number | null;
  /** Update handler */
  onChange: (hours: number) => void;
}

/**
 * SleepInput - Sleep hours input with label
 */
function SleepInput({ value, onChange }: SleepInputProps) {
  const handleChange = (val: string) => {
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
    }
  };

  return (
    <div className="body-input-row">
      <div className="body-input-label">
        <div className="body-input-label-main">Sleep</div>
        <div className="body-input-label-hint">Last night</div>
      </div>
      <div className="body-input-field">
        <StyledInput
          type="number"
          value={value ?? ''}
          onChange={handleChange}
          placeholder="0"
          width={100}
          step="0.5"
          min="0"
          max="24"
        />
        <span className="body-input-unit">hours</span>
      </div>
    </div>
  );
}

export default SleepInput;

