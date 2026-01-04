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

import { useState, useEffect } from 'react';

// Context
import { useApp, calculateCalories } from '../context/AppContext';
import type { WeightDataPoint } from '../context/AppContext';

// Dashboard components
import Header from '../components/dashboard/Header';
import CalorieCard from '../components/dashboard/CalorieCard';
import MacroCard from '../components/dashboard/MacroCard';
import StepsCard from '../components/dashboard/StepsCard';
import SleepCard from '../components/dashboard/SleepCard';

// Overview components for weight chart
import Section from '../components/ui/Section';
import SectionHeader from '../components/ui/SectionHeader';
import WeightChart from '../components/overview/WeightChart';
import ChartRangeSelector from '../components/overview/ChartRangeSelector';

/**
 * HomePage - Main dashboard screen
 */
function HomePage() {
  // Get data from context (shared with Log page)
  const { todayLog, goals, cycleInfo, dashboardPrefs, getWeightHistory } = useApp();
  
  // State for loading simulation (toggle to test loading states)
  const [isLoading] = useState(false);

  // Weight chart state (only used when dashboardPrefs.weight_trend is true)
  const [chartRange, setChartRange] = useState<'7d' | '14d' | '30d'>('7d');
  const [weightData, setWeightData] = useState<WeightDataPoint[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(true);

  // Load weight history when chart is visible and range changes
  useEffect(() => {
    if (!dashboardPrefs.weight_trend) return;

    async function loadWeightHistory() {
      setIsLoadingChart(true);
      const data = await getWeightHistory(chartRange);
      setWeightData(data);
      setIsLoadingChart(false);
    }
    loadWeightHistory();
  }, [dashboardPrefs.weight_trend, chartRange, getWeightHistory]);
  
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

      {/* Weight Trend Chart - only shown when enabled in Overview */}
      {dashboardPrefs.weight_trend && (
        <Section>
          <SectionHeader 
            title="Weight Trend" 
            action={<ChartRangeSelector value={chartRange} onChange={setChartRange} />}
          />
          <WeightChart data={weightData} days={chartRange} isLoading={isLoadingChart} />
        </Section>
      )}
    </div>
  );
}

export default HomePage;
