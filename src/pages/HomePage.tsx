/**
 * HomePage (Dashboard)
 * 
 * The main dashboard screen showing all health metrics.
 * Nutrition data comes from FoodLogContext (food entries).
 * Other data (sleep, steps, cycle) comes from AppContext.
 * 
 * TypeScript Concepts:
 * - Using multiple contexts together
 * - Computed values from raw data
 */

import { useState, useEffect } from 'react';

// Context
import { useApp, calculateCalories } from '../context/AppContext';
import { useFoodLog } from '../context/FoodLogContext';
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
  // Get non-nutrition data from AppContext (sleep, steps, cycle, goals)
  const { todayLog, goals, cycleInfo, dashboardPrefs, getWeightHistory } = useApp();
  
  // Get nutrition data from FoodLogContext (food entries)
  const { dailyTotals, isLoading: isFoodLoading } = useFoodLog();
  
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
  
  // Nutrition data comes directly from food log entries
  const caloriesConsumed = dailyTotals.calories;

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
      
      {/* Calories section - from food log entries */}
      <CalorieCard 
        consumed={caloriesConsumed} 
        goal={caloriesGoal}
        isLoading={isLoading || isFoodLoading}
      />
      
      {/* Macros section - data from food log entries */}
      <MacroCard 
        protein={{ current: dailyTotals.protein, goal: goals.proteinGoal }}
        carbs={{ current: dailyTotals.carbs, goal: goals.carbsGoal }}
        fat={{ current: dailyTotals.fat, goal: goals.fatGoal }}
        isLoading={isLoading || isFoodLoading}
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
