/**
 * MacroInput - Input row for a single macro nutrient
 * 
 * TypeScript Concepts:
 * - State for controlled input
 * - Number parsing and validation
 */

import { useState } from 'react';
import StyledInput from '../ui/StyledInput';
import PrimaryButton from '../ui/PrimaryButton';

interface MacroInputProps {
  /** Label: "Protein", "Carbs", or "Fat" */
  label: string;
  /** Current total for the day */
  total: number;
  /** Daily goal */
  goal: number;
  /** Callback when user adds grams */
  onAdd: (grams: number) => void;
}

/**
 * MacroInput - Macro row with input and Add button
 * 
 * Usage:
 * <MacroInput 
 *   label="Protein" 
 *   total={85} 
 *   goal={120} 
 *   onAdd={(g) => addMacro('protein', g)} 
 * />
 */
function MacroInput({ label, total, goal, onAdd }: MacroInputProps) {
  // Local state for the input value
  const [inputValue, setInputValue] = useState('');
  
  // Check if we have a valid number to add (allow negative for corrections)
  const parsedValue = parseFloat(inputValue);
  const hasValidInput = !isNaN(parsedValue) && parsedValue !== 0;
  
  // Handle add button click
  const handleAdd = () => {
    if (hasValidInput) {
      onAdd(parsedValue);
      setInputValue(''); // Clear input after adding
    }
  };
  
  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && hasValidInput) {
      handleAdd();
    }
  };

  return (
    <div className="macro-input-row">
      {/* Header: Label and current total */}
      <div className="macro-input-header">
        <span className="macro-label">{label}</span>
        <span className="macro-value">{total} / {goal}g</span>
      </div>
      
      {/* Input and Add button */}
      <div className="macro-input-controls">
        <div className="macro-input-field">
          <StyledInput
            type="number"
            value={inputValue}
            onChange={setInputValue}
            placeholder="0"
            onKeyDown={handleKeyDown}
          />
          <span className="macro-input-suffix">g</span>
        </div>
        <PrimaryButton 
          onClick={handleAdd}
          disabled={!hasValidInput}
        >
          Add
        </PrimaryButton>
      </div>
    </div>
  );
}

export default MacroInput;

