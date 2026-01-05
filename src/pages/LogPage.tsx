/**
 * LogPage - Food and health logging screen
 * 
 * This page allows users to log their daily health data.
 * All data is saved to context and synced to localStorage.
 * 
 * TypeScript Concepts:
 * - Using context for state management
 * - Managing ratings with local state before save
 */

import { useState, useEffect } from 'react';
import { useApp, calculateCalories } from '../context/AppContext';
import type { Rating } from '../context/AppContext';
import { useHealthKit } from '../hooks/useHealthKit';
import { Check } from 'lucide-react';

// UI components
import Section from '../components/ui/Section';
import SectionHeader from '../components/ui/SectionHeader';

// Log components
import MacroInput from '../components/log/MacroInput';
import CaloriesSummary from '../components/log/CaloriesSummary';
import SleepInput from '../components/log/SleepInput';
import WeightInput from '../components/log/WeightInput';
import StepsCardLog from '../components/log/StepsCardLog';
import CycleSection from '../components/log/CycleSection';
import RatingInput from '../components/log/RatingInput';

/**
 * LogPage - Main logging screen
 */
function LogPage() {
  // Get data and update functions from context
  const { 
    todayLog, 
    goals, 
    cycleInfo,
    addMacro, 
    setSleep, 
    setWeight, 
    setPeriodDay,
    setRating,
    setSteps
  } = useApp();

  // Local state for ratings (before save)
  const [localEnergy, setLocalEnergy] = useState<Rating | null>(todayLog.energyRating);
  const [localHunger, setLocalHunger] = useState<Rating | null>(todayLog.hungerRating);
  const [localMotivation, setLocalMotivation] = useState<Rating | null>(todayLog.motivationRating);

  // HealthKit integration
  const { 
    isAvailable: healthKitAvailable, 
    isLinked: healthKitLinked, 
    isLoading: healthKitLoading,
    steps: healthKitSteps,
    error: healthKitError,
    linkHealth 
  } = useHealthKit();

  // When HealthKit returns steps, save them to the database via context
  useEffect(() => {
    if (healthKitLinked && healthKitSteps > 0 && healthKitSteps !== todayLog.steps) {
      setSteps(healthKitSteps);
    }
  }, [healthKitLinked, healthKitSteps, todayLog.steps, setSteps]);

  // Format today's date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  // Calculate calorie goal from macro goals
  const caloriesGoal = calculateCalories(
    goals.proteinGoal,
    goals.carbsGoal,
    goals.fatGoal
  );

  return (
    <div className="log-page">
      {/* Header */}
      <header className="dashboard-header">
        <span className="dashboard-date">{formattedDate}</span>
      </header>

      {/* MACROS Section */}
      <Section>
        <SectionHeader title="MACROS" />
        
        <MacroInput
          label="Protein"
          total={todayLog.proteinGrams}
          goal={goals.proteinGoal}
          onAdd={(g) => addMacro('protein', g)}
        />
        
        <MacroInput
          label="Carbs"
          total={todayLog.carbsGrams}
          goal={goals.carbsGoal}
          onAdd={(g) => addMacro('carbs', g)}
        />
        
        <MacroInput
          label="Fat"
          total={todayLog.fatGrams}
          goal={goals.fatGoal}
          onAdd={(g) => addMacro('fat', g)}
        />
        
        <CaloriesSummary
          protein={todayLog.proteinGrams}
          carbs={todayLog.carbsGrams}
          fat={todayLog.fatGrams}
          goal={caloriesGoal}
        />
      </Section>

      {/* BODY Section */}
      <Section>
        <SectionHeader title="BODY" />
        
        <SleepInput
          value={todayLog.sleepHours}
          onChange={setSleep}
        />
        
        <WeightInput
          value={todayLog.weightLbs}
          onChange={setWeight}
        />
      </Section>

     {/* ACTIVITY Section */}
      <Section>
        <SectionHeader title="ACTIVITY" />
        
        <StepsCardLog
          steps={todayLog.steps}
          goal={goals.stepsGoal}
        />
      </Section>

      {/* CYCLE Section - only shows if user has set their cycle info in Overview */}
      <Section>
        <SectionHeader title="CYCLE" />
        
        {cycleInfo ? (
          <CycleSection
            phase={cycleInfo.phase}
            cycleDay={cycleInfo.cycleDay}
            nextPeriodIn={cycleInfo.nextPeriodIn}
            isPeriodDay={todayLog.isPeriodDay}
            onPeriodDayChange={setPeriodDay}
          />
        ) : (
          <p className="cycle-empty-message">
            Set your cycle info in Overview to see predictions
          </p>
        )}
      </Section>

      {/* HOW YOU FEEL Section */}
      <Section>
        <SectionHeader title="HOW YOU FEEL" />
        
        <RatingInput
          label="Energy"
          value={localEnergy}
          savedValue={todayLog.energyRating}
          onChange={setLocalEnergy}
          onSave={() => {
            if (localEnergy) setRating('energy', localEnergy);
          }}
        />
        
        <RatingInput
          label="Hunger"
          value={localHunger}
          savedValue={todayLog.hungerRating}
          onChange={setLocalHunger}
          onSave={() => {
            if (localHunger) setRating('hunger', localHunger);
          }}
        />
        
        <RatingInput
          label="Motivation"
          value={localMotivation}
          savedValue={todayLog.motivationRating}
          onChange={setLocalMotivation}
          onSave={() => {
            if (localMotivation) setRating('motivation', localMotivation);
          }}
        />
      </Section>

      {/* APPLE HEALTH Section - only shows on iOS devices */}
      {healthKitAvailable && (
        <Section noBorder>
          <SectionHeader title="APPLE HEALTH" />
          
          <div className="health-link-section">
            {healthKitLinked ? (
              // Connected state
              <div className="health-link-connected">
                <div className="health-link-status">
                  <Check size={18} />
                  <span>Connected</span>
                </div>
                <p className="health-link-description">
                  Steps are synced from Apple Health
                </p>
              </div>
            ) : (
              // Not linked state
              <div className="health-link-prompt">
                <p className="health-link-description">
                  Connect to automatically sync your step count
                </p>
                <button 
                  className="health-link-button"
                  onClick={linkHealth}
                  disabled={healthKitLoading}
                >
                  {healthKitLoading ? 'Connecting...' : 'Link Apple Health'}
                </button>
                {healthKitError && (
                  <p className="health-link-error">{healthKitError}</p>
                )}
              </div>
            )}
          </div>
        </Section>
      )}
    </div>
  );
}

export default LogPage;
