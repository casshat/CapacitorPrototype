/**
 * AppContext - Global state management with Supabase persistence
 * 
 * TypeScript Concepts:
 * - React Context for sharing state across components
 * - Async data loading with useEffect
 * - Database CRUD operations
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

// ============================================================================
// TYPES
// ============================================================================

type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

type Rating = 1 | 2 | 3 | 4 | 5;

interface CycleInfo {
  phase: CyclePhase;
  cycleDay: number;
  nextPeriodIn: number;
}

interface CycleData {
  phase: CyclePhase;
  day: number;
}

interface MacroNutrient {
  current: number;
  goal: number;
}

interface DailyLog {
  date: string;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  totalCalories: number;
  sleepHours: number | null;
  weightLbs: number | null;
  isPeriodDay: boolean;
  steps: number;
  energyRating: Rating | null;
  hungerRating: Rating | null;
  motivationRating: Rating | null;
  createdAt: string;
  updatedAt: string;
}

interface UserGoals {
  caloriesGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  stepsGoal: number;
  sleepGoal: number;
}

const DEFAULT_GOALS: UserGoals = {
  caloriesGoal: 2000,
  proteinGoal: 120,
  carbsGoal: 250,
  fatGoal: 65,
  stepsGoal: 10000,
  sleepGoal: 8,
};

function createEmptyDailyLog(date: Date): DailyLog {
  const dateString = getLocalDateString(date);
  const now = new Date().toISOString();
  return {
    date: dateString,
    proteinGrams: 0,
    carbsGrams: 0,
    fatGrams: 0,
    totalCalories: 0,
    sleepHours: null,
    weightLbs: null,
    isPeriodDay: false,
    steps: 0,
    energyRating: null,
    hungerRating: null,
    motivationRating: null,
    createdAt: now,
    updatedAt: now,
  };
}

interface UserProfile {
  age: number | null;
  heightFeet: number | null;
  heightInches: number | null;
}

interface CycleSettings {
  cycleLength: number;
  averagePeriodDays: number;
  lastPeriodStartDate: string | null;
}

interface WeightDataPoint {
  date: string; // "MM/DD" format
  weight: number;
}

interface SevenDayAverages {
  calories: number | null;
  protein: number | null;
  steps: number | null;
  sleep: number | null;
}

/**
 * Chart types that can be shown on the dashboard
 * Extend this union as new charts are added
 */
type ChartType = 'weight_trend';

/**
 * Dashboard preferences - which charts are visible on the dashboard
 */
type DashboardPrefs = Record<ChartType, boolean>;

const DEFAULT_DASHBOARD_PREFS: DashboardPrefs = {
  weight_trend: false,
};

// Export types for other files to use
export type { DailyLog, UserGoals, CycleInfo, Rating, CyclePhase, CycleData, MacroNutrient, UserProfile, CycleSettings, WeightDataPoint, SevenDayAverages, ChartType, DashboardPrefs };

// Utility function to calculate calories from macros
export function calculateCalories(protein: number, carbs: number, fat: number): number {
  return (protein * 4) + (carbs * 4) + (fat * 9);
}

// ============================================================================
// CONTEXT INTERFACE
// ============================================================================

interface AppContextValue {
  todayLog: DailyLog;
  goals: UserGoals;
  cycleInfo: CycleInfo | null;  // null when user hasn't set lastPeriodStartDate
  profile: UserProfile;
  cycleSettings: CycleSettings;
  isLoading: boolean;
  dashboardPrefs: DashboardPrefs;
  
  addMacro: (type: 'protein' | 'carbs' | 'fat', grams: number) => void;
  setSleep: (hours: number) => void;
  setWeight: (lbs: number) => void;
  setPeriodDay: (isPeriod: boolean) => void;
  setRating: (type: 'energy' | 'hunger' | 'motivation', value: Rating | null) => void;
  setSteps: (steps: number) => void;
  
  // Overview tab functions
  updateGoal: (type: keyof UserGoals, value: number) => Promise<void>;
  updateProfile: (field: keyof UserProfile, value: number | { feet: number; inches: number }) => Promise<void>;
  updateCycleSettings: (field: keyof CycleSettings, value: number | string) => Promise<void>;
  getWeightHistory: (days: '7d' | '14d' | '30d') => Promise<WeightDataPoint[]>;
  getSevenDayAverages: () => Promise<SevenDayAverages>;
  
  // Dashboard preferences
  setChartVisibility: (chartType: ChartType, visible: boolean) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets the current date in the user's local timezone as YYYY-MM-DD string.
 * This ensures logs reset at midnight in the user's timezone, not UTC.
 */
function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodayString(): string {
  return getLocalDateString();
}

/**
 * Checks if a log's date is "stale" (no longer today).
 * 
 * TypeScript Concept: Pure Function
 * - Takes input (logDate string)
 * - Returns output (boolean)
 * - No side effects (doesn't modify anything)
 * - Same input always gives same output
 * 
 * Pure functions are easy to test and reason about!
 */
function isLogStale(logDate: string): boolean {
  return logDate !== getTodayString();
}

/**
 * Calculates the current cycle phase based on the last period start date.
 * 
 * TypeScript Concepts:
 * - Return type can be null (CycleInfo | null)
 * - Date arithmetic using getTime() for milliseconds
 * - Modulo operator (%) to wrap cycle days
 * 
 * Phase breakdown:
 * - Days 1 through averagePeriodDays → menstrual
 * - Days (averagePeriodDays + 1) through 14 → follicular
 * - Day 15 → ovulation
 * - Days 16 through cycleLength → luteal
 */
function calculateCycleInfo(
  lastPeriodStartDate: string | null,
  cycleLength: number,
  averagePeriodDays: number
): CycleInfo | null {
  // If no date is set, return null (badge won't show)
  if (!lastPeriodStartDate) return null;
  
  // Calculate days since last period started
  const today = new Date();
  const lastPeriod = new Date(lastPeriodStartDate);
  const diffTime = today.getTime() - lastPeriod.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Get current day in cycle (1-indexed, wraps around using modulo)
  // Example: Day 29 of a 28-day cycle → (28 % 28) + 1 = 1
  const cycleDay = (diffDays % cycleLength) + 1;
  
  // Determine phase based on cycle day
  let phase: CyclePhase;
  if (cycleDay <= averagePeriodDays) {
    phase = 'menstrual';
  } else if (cycleDay <= 14) {
    phase = 'follicular';
  } else if (cycleDay === 15) {
    phase = 'ovulation';
  } else {
    phase = 'luteal';
  }
  
  // Calculate days until next period starts
  const nextPeriodIn = cycleLength - cycleDay + 1;
  
  return { phase, cycleDay, nextPeriodIn };
}

// Convert database row (snake_case) to app format (camelCase)
interface DbDailyLog {
  log_date: string;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  total_calories: number;
  sleep_hours: number | null;
  weight_lbs: number | null;
  is_period_day: boolean;
  steps: number;
  energy_rating: number | null;
  hunger_rating: number | null;
  motivation_rating: number | null;
  created_at: string;
  updated_at: string;
}

function dbToApp(row: DbDailyLog): DailyLog {
  return {
    date: row.log_date,
    proteinGrams: row.protein_grams,
    carbsGrams: row.carbs_grams,
    fatGrams: row.fat_grams,
    totalCalories: row.total_calories,
    sleepHours: row.sleep_hours,
    weightLbs: row.weight_lbs,
    isPeriodDay: row.is_period_day,
    steps: row.steps,
    energyRating: row.energy_rating as Rating | null,
    hungerRating: row.hunger_rating as Rating | null,
    motivationRating: row.motivation_rating as Rating | null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

interface DbUserGoals {
  calories_goal: number;
  protein_goal: number;
  carbs_goal: number;
  fat_goal: number;
  steps_goal: number;
  sleep_goal: number;
}

function dbGoalsToApp(row: DbUserGoals): UserGoals {
  return {
    caloriesGoal: row.calories_goal,
    proteinGoal: row.protein_goal,
    carbsGoal: row.carbs_goal,
    fatGoal: row.fat_goal,
    stepsGoal: row.steps_goal,
    sleepGoal: Number(row.sleep_goal),
  };
}

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const { user } = useAuth();
  
  const [todayLog, setTodayLog] = useState<DailyLog>(createEmptyDailyLog(new Date()));
  const [goals, setGoals] = useState<UserGoals>(DEFAULT_GOALS);
  const [profile, setProfile] = useState<UserProfile>({
    age: null,
    heightFeet: null,
    heightInches: null,
  });
  const [cycleSettings, setCycleSettings] = useState<CycleSettings>({
    cycleLength: 28,
    averagePeriodDays: 5,
    lastPeriodStartDate: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardPrefs, setDashboardPrefs] = useState<DashboardPrefs>(DEFAULT_DASHBOARD_PREFS);
  
  /**
   * Calculate cycle info from saved settings.
   * 
   * TypeScript Concept: useMemo
   * - Memoizes a computed value so it only recalculates when dependencies change
   * - Here, cycleInfo recalculates when cycleSettings changes
   * - Returns null if user hasn't set their lastPeriodStartDate yet
   */
  const cycleInfo = useMemo(() => 
    calculateCycleInfo(
      cycleSettings.lastPeriodStartDate,
      cycleSettings.cycleLength,
      cycleSettings.averagePeriodDays
    ),
    [cycleSettings]
  );

  /**
   * Load all user data from Supabase for today.
   * 
   * TypeScript Concept: useCallback
   * - Memoizes this function so it keeps the same reference between renders
   * - Only recreates when `user` changes (the dependency array)
   * - This lets us call loadData from multiple useEffects without issues
   * 
   * The function is async (returns a Promise) and handles:
   * 1. Today's log (or creates empty one if none exists)
   * 2. User goals
   * 3. Profile and cycle settings
   */
  const loadData = useCallback(async () => {
    if (!user) {
      setTodayLog(createEmptyDailyLog(new Date()));
      setGoals(DEFAULT_GOALS);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const today = getTodayString();

    // Load today's log
    const { data: logData } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('log_date', today)
      .single();

      if (logData) {
        setTodayLog(dbToApp(logData as DbDailyLog));
      } else {
        setTodayLog(createEmptyDailyLog(new Date()));
      }

    // Load user goals
    const { data: goalsData } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (goalsData) {
      setGoals(dbGoalsToApp(goalsData as DbUserGoals));
    }

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('age, height_feet, height_inches, cycle_length_days, period_length_days, last_period_start')
      .eq('id', user.id)
      .single();

    if (profileData) {
      setProfile({
        age: profileData.age,
        heightFeet: profileData.height_feet,
        heightInches: profileData.height_inches,
      });
      setCycleSettings({
        cycleLength: profileData.cycle_length_days || 28,
        averagePeriodDays: profileData.period_length_days || 5,
        lastPeriodStartDate: profileData.last_period_start,
      });
    }

    // Load dashboard preferences
    const { data: prefsData } = await supabase
      .from('dashboard_preferences')
      .select('chart_type, is_visible')
      .eq('user_id', user.id);

    if (prefsData && prefsData.length > 0) {
      const prefs: DashboardPrefs = { ...DEFAULT_DASHBOARD_PREFS };
      prefsData.forEach((row: { chart_type: string; is_visible: boolean }) => {
        if (row.chart_type in prefs) {
          prefs[row.chart_type as ChartType] = row.is_visible;
        }
      });
      setDashboardPrefs(prefs);
    } else {
      setDashboardPrefs(DEFAULT_DASHBOARD_PREFS);
    }

    setIsLoading(false);
  }, [user]); // <-- Dependency array: recreate only when user changes

  // Load data from Supabase when user changes
  useEffect(() => {
    loadData();
  }, [loadData]); // <-- Now depends on the memoized loadData function

  /**
   * Detect when the day changes and reload data.
   * 
   * TypeScript/React Concept: Effect Cleanup
   * - useEffect can return a "cleanup" function
   * - React calls this cleanup when:
   *   1. The component unmounts (removed from DOM)
   *   2. Before re-running the effect (when dependencies change)
   * - This prevents memory leaks from orphaned intervals/timers
   * 
   * How this works:
   * 1. Every 60 seconds, we check if todayLog.date !== today's date
   * 2. If they don't match, midnight passed → reload data
   * 3. loadData() will fetch today's log (empty/zeroed if none exists)
   */
  useEffect(() => {
    // Only run the check if we have a user
    if (!user) return;

    const checkForDayChange = () => {
      // Compare the log's date to the current date
      if (isLogStale(todayLog.date)) {
        console.log('🌅 New day detected! Resetting daily log...');
        loadData(); // This will load today's log (or create empty one)
      }
    };

    // Check every 60 seconds (60000 milliseconds)
    const intervalId = setInterval(checkForDayChange, 60000);

    // Also check immediately when the app regains focus (user switches back to app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForDayChange();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function - runs when component unmounts or dependencies change
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, todayLog.date, loadData]); // Re-setup when these change

  // Save to Supabase (upsert = insert or update)
  const saveToSupabase = useCallback(async (log: DailyLog) => {
    if (!user) return;

    const totalCalories = calculateCalories(log.proteinGrams, log.carbsGrams, log.fatGrams);

    await supabase
      .from('daily_logs')
      .upsert({
        user_id: user.id,
        log_date: log.date,
        protein_grams: log.proteinGrams,
        carbs_grams: log.carbsGrams,
        fat_grams: log.fatGrams,
        total_calories: totalCalories,
        sleep_hours: log.sleepHours,
        weight_lbs: log.weightLbs,
        is_period_day: log.isPeriodDay,
        steps: log.steps,
        energy_rating: log.energyRating,
        hunger_rating: log.hungerRating,
        motivation_rating: log.motivationRating,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,log_date'
      });
  }, [user]);

  // Update functions
  const addMacro = (type: 'protein' | 'carbs' | 'fat', grams: number) => {
    setTodayLog(prev => {
      const key = `${type}Grams` as 'proteinGrams' | 'carbsGrams' | 'fatGrams';
      const newLog = {
        ...prev,
        [key]: prev[key] + grams,
        updatedAt: new Date().toISOString(),
      };
      newLog.totalCalories = calculateCalories(newLog.proteinGrams, newLog.carbsGrams, newLog.fatGrams);
      saveToSupabase(newLog);
      return newLog;
    });
  };

  const setSleep = (hours: number) => {
    setTodayLog(prev => {
      const newLog = {
        ...prev,
        sleepHours: hours,
        updatedAt: new Date().toISOString(),
      };
      saveToSupabase(newLog);
      return newLog;
    });
  };

  const setWeight = (lbs: number) => {
    setTodayLog(prev => {
      const newLog = {
        ...prev,
        weightLbs: lbs,
        updatedAt: new Date().toISOString(),
      };
      saveToSupabase(newLog);
      return newLog;
    });
  };

  const setPeriodDay = (isPeriod: boolean) => {
    setTodayLog(prev => {
      const newLog = {
        ...prev,
        isPeriodDay: isPeriod,
        updatedAt: new Date().toISOString(),
      };
      saveToSupabase(newLog);
      return newLog;
    });
  };

  const setRating = (type: 'energy' | 'hunger' | 'motivation', value: Rating | null) => {
    setTodayLog(prev => {
      const key = `${type}Rating` as 'energyRating' | 'hungerRating' | 'motivationRating';
      const newLog = {
        ...prev,
        [key]: value,
        updatedAt: new Date().toISOString(),
      };
      saveToSupabase(newLog);
      return newLog;
    });
  };

  const setSteps = (steps: number) => {
    setTodayLog(prev => {
      const newLog = {
        ...prev,
        steps,
        updatedAt: new Date().toISOString(),
      };
      saveToSupabase(newLog);
      return newLog;
    });
  };

  // Overview tab functions
  const updateGoal = useCallback(async (type: keyof UserGoals, value: number) => {
    if (!user) return;

    const goalKeyMap: Record<keyof UserGoals, string> = {
      caloriesGoal: 'calories_goal',
      proteinGoal: 'protein_goal',
      carbsGoal: 'carbs_goal',
      fatGoal: 'fat_goal',
      stepsGoal: 'steps_goal',
      sleepGoal: 'sleep_goal',
    };

    const { error } = await supabase
      .from('user_goals')
      .update({ [goalKeyMap[type]]: value, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    if (!error) {
      setGoals(prev => ({ ...prev, [type]: value }));
    } else {
      throw error;
    }
  }, [user]);

  const updateProfile = useCallback(async (field: keyof UserProfile, value: number | { feet: number; inches: number }) => {
    if (!user) return;

    let updateData: any = {};
    
    if (field === 'age') {
      updateData.age = value as number;
    } else if (field === 'heightFeet') {
      updateData.height_feet = (value as { feet: number; inches: number }).feet;
      updateData.height_inches = (value as { feet: number; inches: number }).inches;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (!error) {
      if (field === 'age') {
        setProfile(prev => ({ ...prev, age: value as number }));
      } else {
        const heightValue = value as { feet: number; inches: number };
        setProfile(prev => ({ ...prev, heightFeet: heightValue.feet, heightInches: heightValue.inches }));
      }
    } else {
      throw error;
    }
  }, [user]);

  const updateCycleSettings = useCallback(async (field: keyof CycleSettings, value: number | string) => {
    if (!user) return;

    let updateData: any = {};
    
    if (field === 'cycleLength') {
      updateData.cycle_length_days = value as number;
    } else if (field === 'averagePeriodDays') {
      updateData.period_length_days = value as number;
    } else if (field === 'lastPeriodStartDate') {
      updateData.last_period_start = value as string;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (!error) {
      setCycleSettings(prev => ({ ...prev, [field]: value }));
    } else {
      throw error;
    }
  }, [user]);

  const getWeightHistory = useCallback(async (days: '7d' | '14d' | '30d'): Promise<WeightDataPoint[]> => {
    if (!user) return [];

    const daysCount = days === '7d' ? 7 : days === '14d' ? 14 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysCount);
    const startDateString = getLocalDateString(startDate);

    const { data, error } = await supabase
      .from('daily_logs')
      .select('log_date, weight_lbs')
      .eq('user_id', user.id)
      .gte('log_date', startDateString)
      .not('weight_lbs', 'is', null)
      .order('log_date', { ascending: true });

    if (error) {
      console.error('Failed to fetch weight history:', error);
      return [];
    }

    return (data || []).map(row => {
      const date = new Date(row.log_date);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return {
        date: `${month}/${day}`,
        weight: row.weight_lbs,
      };
    });
  }, [user]);

  const getSevenDayAverages = useCallback(async (): Promise<SevenDayAverages> => {
    if (!user) {
      return { calories: null, protein: null, steps: null, sleep: null };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const startDateString = getLocalDateString(startDate);

    const { data, error } = await supabase
      .from('daily_logs')
      .select('total_calories, protein_grams, steps, sleep_hours')
      .eq('user_id', user.id)
      .gte('log_date', startDateString)
      .order('log_date', { ascending: true });

    if (error || !data || data.length === 0) {
      return { calories: null, protein: null, steps: null, sleep: null };
    }

    // Calculate averages from available days
    const validData = data.filter(row => 
      row.total_calories !== null || 
      row.protein_grams !== null || 
      row.steps !== null || 
      row.sleep_hours !== null
    );

    if (validData.length === 0) {
      return { calories: null, protein: null, steps: null, sleep: null };
    }

    const sum = validData.reduce((acc, row) => ({
      calories: acc.calories + (row.total_calories || 0),
      protein: acc.protein + (row.protein_grams || 0),
      steps: acc.steps + (row.steps || 0),
      sleep: acc.sleep + (row.sleep_hours || 0),
    }), { calories: 0, protein: 0, steps: 0, sleep: 0 });

    const count = validData.length;
    const sleepCount = validData.filter(row => row.sleep_hours !== null).length;

    return {
      calories: sum.calories / count,
      protein: sum.protein / count,
      steps: sum.steps / count,
      sleep: sleepCount > 0 ? sum.sleep / sleepCount : null,
    };
  }, [user]);

  /**
   * Toggle chart visibility on the dashboard.
   * Persists to Supabase for cross-device sync.
   */
  const setChartVisibility = useCallback(async (chartType: ChartType, visible: boolean) => {
    if (!user) return;

    // Optimistically update local state
    setDashboardPrefs(prev => ({ ...prev, [chartType]: visible }));

    // Persist to Supabase (upsert)
    const { error } = await supabase
      .from('dashboard_preferences')
      .upsert({
        user_id: user.id,
        chart_type: chartType,
        is_visible: visible,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,chart_type'
      });

    if (error) {
      console.error('Failed to save dashboard preference:', error);
      // Revert on error
      setDashboardPrefs(prev => ({ ...prev, [chartType]: !visible }));
    }
  }, [user]);

  const value: AppContextValue = {
    todayLog,
    goals,
    cycleInfo,
    profile,
    cycleSettings,
    isLoading,
    dashboardPrefs,
    addMacro,
    setSleep,
    setWeight,
    setPeriodDay,
    setRating,
    setSteps,
    updateGoal,
    updateProfile,
    updateCycleSettings,
    getWeightHistory,
    getSevenDayAverages,
    setChartVisibility,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
