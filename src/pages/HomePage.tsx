/**
 * HomePage (Dashboard)
 * 
 * The main dashboard screen showing all health metrics.
 * Now reads from AppContext so data is shared with Log page.
 * 
 * TypeScript Concepts:
 * - Using context with useApp() hook
 * - Computed values from raw data
 */

import { useState } from 'react';

// Context
import { useApp, calculateCalories } from '../context/AppContext';

// Dashboard components
import Header from '../components/dashboard/Header';
import CalorieCard from '../components/dashboard/CalorieCard';
import MacroCard from '../components/dashboard/MacroCard';
import StepsCard from '../components/dashboard/StepsCard';
import SleepCard from '../components/dashboard/SleepCard';

/**
 * HomePage - Main dashboard screen
 */
function HomePage() {
  // Get data from context (shared with Log page)
  const { todayLog, goals, cycleInfo } = useApp();
  
  // State for loading simulation (toggle to test loading states)
  const [isLoading] = useState(false);
  
  // Calculate calories from macros
  const caloriesConsumed = calculateCalories(
    todayLog.proteinGrams,
    todayLog.carbsGrams,
    todayLog.fatGrams
  );

  // Calculate calorie goal from macro goals
  const caloriesGoal = calculateCalories(
    goals.proteinGoal,
    goals.carbsGoal,
    goals.fatGoal
  );

  // Check if we have any data logged today
  const hasData = caloriesConsumed > 0 || 
                  todayLog.sleepHours !== null || 
                  todayLog.steps > 0;

  // Empty state - show when no data logged
  if (!hasData && !isLoading) {
    return (
      <div className="dashboard">
        <Header 
          date={new Date()} 
          cycle={cycleInfo ? { phase: cycleInfo.phase, day: cycleInfo.cycleDay } : undefined} 
        />
        
        <div className="empty-state">
          <p className="empty-state__title">No data logged today</p>
          <button className="empty-state__button">
            Log Entry →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header with date and cycle badge (only shows if user has set cycle info) */}
      <Header 
        date={new Date()} 
        cycle={cycleInfo ? { phase: cycleInfo.phase, day: cycleInfo.cycleDay } : undefined} 
      />
      
      {/* Calories section - calculated from macros */}
      <CalorieCard 
        consumed={caloriesConsumed} 
        goal={caloriesGoal}
        isLoading={isLoading}
      />
      
      {/* Macros section */}
      <MacroCard 
        protein={{ current: todayLog.proteinGrams, goal: goals.proteinGoal }}
        carbs={{ current: todayLog.carbsGrams, goal: goals.carbsGoal }}
        fat={{ current: todayLog.fatGrams, goal: goals.fatGoal }}
        isLoading={isLoading}
      />
      
      {/* Steps and Sleep side by side */}
      <div className="stats-row">
        <StepsCard 
          steps={todayLog.steps} 
          goal={goals.stepsGoal}
          isLoading={isLoading}
        />
        <SleepCard 
          hours={todayLog.sleepHours} 
          goal={goals.sleepGoal}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default HomePage;
