/**
 * OverviewPage - Goals, profile, and trends screen
 * 
 * TypeScript Concepts:
 * - State management for collapsible sections
 * - Data fetching with useEffect
 * - Composing multiple components
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useApp, calculateCalories } from '../context/AppContext';
import type { WeightDataPoint, SevenDayAverages } from '../context/AppContext';
import Section from '../components/ui/Section';
import SectionHeader from '../components/ui/SectionHeader';
import CollapsibleSection from '../components/overview/CollapsibleSection';
import GoalEditor from '../components/overview/GoalEditor';
import ProfileField from '../components/overview/ProfileField';
import CycleField from '../components/overview/CycleField';
import WeightChart from '../components/overview/WeightChart';
import ChartRangeSelector from '../components/overview/ChartRangeSelector';
import QuickStatCard from '../components/overview/QuickStatCard';

/**
 * OverviewPage - Main overview screen
 */
function OverviewPage() {
  const {
    goals,
    profile,
    cycleSettings,
    dashboardPrefs,
    updateGoal,
    updateProfile,
    updateCycleSettings,
    getWeightHistory,
    getSevenDayAverages,
    setChartVisibility,
  } = useApp();

  // Collapsible section states (all start collapsed)
  const [goalsExpanded, setGoalsExpanded] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [cycleExpanded, setCycleExpanded] = useState(false);

  // Chart state
  const [chartRange, setChartRange] = useState<'7d' | '14d' | '30d'>('7d');
  const [weightData, setWeightData] = useState<WeightDataPoint[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(true);

  // Averages state
  const [averages, setAverages] = useState<SevenDayAverages>({
    calories: null,
    protein: null,
    steps: null,
    sleep: null,
  });
  const [isLoadingAverages, setIsLoadingAverages] = useState(true);

  // Load weight history when range changes
  useEffect(() => {
    async function loadWeightHistory() {
      setIsLoadingChart(true);
      const data = await getWeightHistory(chartRange);
      setWeightData(data);
      setIsLoadingChart(false);
    }
    loadWeightHistory();
  }, [chartRange, getWeightHistory]);

  // Load averages on mount
  useEffect(() => {
    async function loadAverages() {
      setIsLoadingAverages(true);
      const data = await getSevenDayAverages();
      setAverages(data);
      setIsLoadingAverages(false);
    }
    loadAverages();
  }, [getSevenDayAverages]);

  // Get current weight from most recent daily log (not from profile)
  // const currentWeight = null; // Will be fetched from daily_logs if needed

  // Calculate calories from macro goals
  const calculatedCalories = calculateCalories(
    goals.proteinGoal,
    goals.carbsGoal,
    goals.fatGoal
  );

  return (
    <div className="page overview-page">
      {/* Page Header with Settings link */}
      <header className="overview-page-header">
        <h1 className="overview-page-title">Your Overview</h1>
        <Link to="/settings" className="overview-settings-link" aria-label="Settings">
          <Settings size={24} />
        </Link>
      </header>

      {/* Goals Section */}
      <Section>
        <CollapsibleSection
          title="Goals"
          isExpanded={goalsExpanded}
          onToggle={() => setGoalsExpanded(!goalsExpanded)}
        >
          {/* Calories - Read-only calculated display */}
          <div className="goal-readonly">
            <div className="goal-readonly-header">
              <span className="goal-readonly-label">Calories</span>
            </div>
            <div className="goal-readonly-value">
              {calculatedCalories.toLocaleString()} kcal
              <span className="goal-readonly-note"></span>
            </div>
          </div>
          
          <GoalEditor
            label="Protein"
            value={goals.proteinGoal}
            unit="g"
            onSave={(val) => updateGoal('proteinGoal', val)}
          />
          <GoalEditor
            label="Carbs"
            value={goals.carbsGoal}
            unit="g"
            onSave={(val) => updateGoal('carbsGoal', val)}
          />
          <GoalEditor
            label="Fat"
            value={goals.fatGoal}
            unit="g"
            onSave={(val) => updateGoal('fatGoal', val)}
          />
          <GoalEditor
            label="Steps"
            value={goals.stepsGoal}
            unit="steps"
            onSave={(val) => updateGoal('stepsGoal', val)}
          />
          <GoalEditor
            label="Sleep"
            value={goals.sleepGoal}
            unit="hours"
            onSave={(val) => updateGoal('sleepGoal', val)}
          />
        </CollapsibleSection>
      </Section>

      {/* Profile Section */}
      <Section>
        <CollapsibleSection
          title="Profile"
          isExpanded={profileExpanded}
          onToggle={() => setProfileExpanded(!profileExpanded)}
        >
          <ProfileField
            label="Age"
            value={profile.age}
            unit="years"
            onChange={(val) => updateProfile('age', val as number)}
          />
          <ProfileField
            label="Height"
            type="height"
            value={profile.heightFeet !== null && profile.heightInches !== null
              ? { feet: profile.heightFeet, inches: profile.heightInches }
              : null
            }
            onChange={(val) => updateProfile('heightFeet', val as { feet: number; inches: number })}
          />
        </CollapsibleSection>
      </Section>

      {/* Cycle Settings Section */}
      <Section>
        <CollapsibleSection
          title="Cycle Settings"
          isExpanded={cycleExpanded}
          onToggle={() => setCycleExpanded(!cycleExpanded)}
        >
          <CycleField
            label="Cycle Length"
            value={cycleSettings.cycleLength}
            unit="days"
            onChange={(val) => updateCycleSettings('cycleLength', val as number)}
          />
          <CycleField
            label="Average Period Days"
            value={cycleSettings.averagePeriodDays}
            unit="days"
            onChange={(val) => updateCycleSettings('averagePeriodDays', val as number)}
          />
          <CycleField
            label="Last Period Start Date"
            type="date"
            value={cycleSettings.lastPeriodStartDate}
            onChange={(val) => updateCycleSettings('lastPeriodStartDate', val as string)}
          />
        </CollapsibleSection>
      </Section>

      {/* Weight Trend Section */}
      <Section>
        <div className="section-header-with-toggle">
          <SectionHeader 
            title="Weight Trend" 
            action={<ChartRangeSelector value={chartRange} onChange={setChartRange} />}
          />
          <label className="dashboard-checkbox">
            <input 
              type="checkbox" 
              checked={dashboardPrefs.weight_trend}
              onChange={(e) => setChartVisibility('weight_trend', e.target.checked)}
            />
            <span>Add to Dashboard</span>
          </label>
        </div>
        <WeightChart data={weightData} days={chartRange} isLoading={isLoadingChart} />
      </Section>

      {/* 7-Day Averages Section */}
      <Section noBorder>
        <SectionHeader title="7-Day Averages" />
        <div className="quick-stats-grid">
          <QuickStatCard
            label="Avg Calories"
            average={averages.calories}
            goal={calculatedCalories}
            unit="kcal"
            isLoading={isLoadingAverages}
          />
          <QuickStatCard
            label="Avg Protein"
            average={averages.protein}
            goal={goals.proteinGoal}
            unit="g"
            isLoading={isLoadingAverages}
          />
          <QuickStatCard
            label="Avg Steps"
            average={averages.steps}
            goal={goals.stepsGoal}
            unit=""
            isLoading={isLoadingAverages}
          />
          <QuickStatCard
            label="Avg Sleep"
            average={averages.sleep}
            goal={goals.sleepGoal}
            unit="h"
            isLoading={isLoadingAverages}
          />
        </div>
      </Section>
    </div>
  );
}

export default OverviewPage;
