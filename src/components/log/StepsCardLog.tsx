/**
 * StepsCardLog - Display-only steps card for Log page
 * 
 * Different from Dashboard StepsCard:
 * - Has background card
 * - Shows sync source (Apple Health or default)
 * - No progress ring
 */

import { useState, useEffect } from 'react';

interface StepsCardLogProps {
  /** Current step count */
  steps: number;
  /** Daily step goal */
  goal: number;
}

/**
 * Check if HealthKit is linked (from localStorage)
 */
function isHealthKitLinked(): boolean {
  try {
    return localStorage.getItem('healthkit_linked') === 'true';
  } catch {
    return false;
  }
}

/**
 * StepsCardLog - Steps display with card background
 */
function StepsCardLog({ steps, goal }: StepsCardLogProps) {
  const [linked, setLinked] = useState(false);

  // Check linked status on mount and when localStorage might change
  useEffect(() => {
    setLinked(isHealthKitLinked());
    
    // Listen for storage changes (in case user links from another tab/component)
    const handleStorage = () => {
      setLinked(isHealthKitLinked());
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="steps-card-log">
      <div className="steps-card-log-header">
        <span className="steps-card-log-label">Steps</span>
        <span className="steps-card-log-sync">
          {linked ? 'Synced from Apple Health' : 'Auto-synced'}
        </span>
      </div>
      <div className="steps-card-log-value">{steps.toLocaleString()}</div>
      <div className="steps-card-log-goal">/ {goal.toLocaleString()}</div>
    </div>
  );
}

export default StepsCardLog;
