/**
 * LogPage - Food and health logging screen
 * 
 * This page allows users to log their daily health data.
 * Food entries are managed through FoodLogContext.
 * Other data is saved to AppContext and synced to Supabase.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp, calculateCalories } from '../context/AppContext';
import { useFoodLog } from '../context/FoodLogContext';
import type { Rating } from '../context/AppContext';
import { useHealthKit } from '../hooks/useHealthKit';

// UI components
import Section from '../components/ui/Section';
import SectionHeader from '../components/ui/SectionHeader';
import Toast from '../components/ui/Toast';

// Food components
import { ProgressCard, FoodLogRow } from '../components/food';

// Log components
import SleepInput from '../components/log/SleepInput';
import WeightInput from '../components/log/WeightInput';
import StepsCardLog from '../components/log/StepsCardLog';
import CycleSection from '../components/log/CycleSection';
import RatingInput from '../components/log/RatingInput';

/**
 * LogPage - Main logging screen
 */
function LogPage() {
  const navigate = useNavigate();
  
  // Get data and update functions from context
  const { 
    todayLog, 
    goals, 
    cycleInfo,
    setSleep, 
    setWeight, 
    setPeriodDay,
    setRating,
    setSteps
  } = useApp();

  // Get food log data
  const {
    foodEntries,
    dailyTotals,
    deleteFoodEntry,
    toast,
    hideToast,
  } = useFoodLog();

  // Local state for ratings (before save)
  const [localEnergy, setLocalEnergy] = useState<Rating | null>(todayLog.energyRating);
  const [localHunger, setLocalHunger] = useState<Rating | null>(todayLog.hungerRating);
  const [localMotivation, setLocalMotivation] = useState<Rating | null>(todayLog.motivationRating);

  // Collapsible state for food entries
  const [isEntriesExpanded, setIsEntriesExpanded] = useState(false);

  // HealthKit integration (steps sync still happens here, but UI moved to Settings)
  const { 
    isLinked: healthKitLinked, 
    steps: healthKitSteps,
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

  const handleAddFood = () => {
    navigate('/log/add');
  };

  const toggleEntriesExpanded = () => {
    setIsEntriesExpanded(prev => !prev);
  };

  const handleDeleteFood = (id: string) => {
    deleteFoodEntry(id);
  };

  return (
    <div className="log-page">
      {/* Header */}
      <header className="dashboard-header">
        <span className="dashboard-date">{formattedDate}</span>
      </header>

      {/* FOOD LOG Section */}
      <Section>
        <SectionHeader title="FOOD LOG" />
        
        {/* Progress Card - always visible */}
        <ProgressCard
          calories={{ current: dailyTotals.calories, goal: caloriesGoal }}
          protein={{ current: dailyTotals.protein, goal: goals.proteinGoal }}
          carbs={{ current: dailyTotals.carbs, goal: goals.carbsGoal }}
          fat={{ current: dailyTotals.fat, goal: goals.fatGoal }}
        />
        
        {/* Collapsible food entries section */}
        {foodEntries.length > 0 && (
          <div className="food-entries-collapsible">
            <button 
              className="food-entries-collapsible__header"
              onClick={toggleEntriesExpanded}
              type="button"
            >
              <span className="food-entries-collapsible__title">
                Today's Entries ({foodEntries.length})
              </span>
              <div className="food-entries-collapsible__icon">
                {isEntriesExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>
            
            {isEntriesExpanded && (
              <div className="food-log-list">
                {foodEntries.map((entry) => (
                  <FoodLogRow
                    key={entry.id}
                    food={entry}
                    onDelete={handleDeleteFood}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Add Food button */}
        <button className="add-food-button" onClick={handleAddFood}>
          <Plus size={20} />
          <span>Add Food</span>
        </button>
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
      <Section noBorder>
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

      {/* Success/Error Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={hideToast}
      />
    </div>
  );
}

export default LogPage;
