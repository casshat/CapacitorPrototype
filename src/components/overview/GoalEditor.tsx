/**
 * GoalEditor - Editable goal input with save button
 * 
 * TypeScript Concepts:
 * - Local state for editing
 * - Async save operations
 * - Temporary UI feedback
 */

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import PrimaryButton from '../ui/PrimaryButton';

interface GoalEditorProps {
  /** Label: "Calories", "Protein", etc. */
  label: string;
  /** Current goal value */
  value: number;
  /** Unit: "kcal", "g", "steps", "hours" */
  unit: string;
  /** Save handler */
  onSave: (value: number) => Promise<void>;
}

/**
 * GoalEditor - Goal input with save functionality
 */
function GoalEditor({ label, value, unit, onSave }: GoalEditorProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Sync input when prop value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  // Auto-hide saved indicator after 2 seconds
  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => {
        setShowSaved(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSaved]);

  const hasChanged = inputValue !== value.toString();
  const parsedValue = parseFloat(inputValue);
  const isValid = !isNaN(parsedValue) && parsedValue > 0;

  const handleSave = async () => {
    if (!isValid || !hasChanged) return;

    setIsSaving(true);
    try {
      await onSave(parsedValue);
      setShowSaved(true);
    } catch (error) {
      console.error('Failed to save goal:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="goal-editor">
      {/* Header with label and saved indicator */}
      <div className="goal-editor-header">
        <span className="goal-editor-label">{label}</span>
        {showSaved && (
          <span className="goal-editor-saved">
            <Check size={18} strokeWidth={3} />
            Saved
          </span>
        )}
      </div>

      {/* Input and Save button */}
      <div className="goal-editor-controls">
        <div className="goal-editor-input-wrapper">
          <input
            type="number"
            className="goal-editor-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSaving}
          />
          <span className="goal-editor-unit">{unit}</span>
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

export default GoalEditor;

