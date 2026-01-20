/**
 * FoodLogContext - State management for AI-powered food logging
 * 
 * Manages:
 * - Today's food log entries (persisted to Supabase)
 * - Daily nutrition totals (calculated from entries)
 * - Toast notifications for success/error feedback
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { 
  FoodLogEntry, 
  AIFoodItem,
  DailyFoodTotals,
  DbFoodLogEntry 
} from '../types/food';
import { dbToFoodLogEntry, foodLogEntryToDb } from '../types/food';
import { calculateDailyTotals } from '../utils/nutrition';

// ============================================================================
// TYPES
// ============================================================================

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
}

interface FoodLogContextValue {
  // Food entries for current date
  foodEntries: FoodLogEntry[];
  // Aggregated daily totals
  dailyTotals: DailyFoodTotals;
  // Loading state
  isLoading: boolean;
  // Toast notification state
  toast: ToastState;
  
  // Actions
  addFoodsFromAI: (foods: AIFoodItem[]) => Promise<void>;
  deleteFoodEntry: (id: string) => Promise<void>;
  loadTodayEntries: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error') => void;
  hideToast: () => void;
}

const FoodLogContext = createContext<FoodLogContextValue | undefined>(undefined);

// ============================================================================
// HELPERS
// ============================================================================

const TOAST_DURATION = 3000;

/**
 * Get today's date as YYYY-MM-DD in local timezone.
 */
function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generate a UUID for new entries.
 */
function generateId(): string {
  return crypto.randomUUID();
}

// ============================================================================
// PROVIDER
// ============================================================================

interface FoodLogProviderProps {
  children: ReactNode;
}

export function FoodLogProvider({ children }: FoodLogProviderProps) {
  const { user } = useAuth();
  
  const [foodEntries, setFoodEntries] = useState<FoodLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'success',
  });

  // Calculate daily totals from entries
  const dailyTotals = useMemo(
    () => calculateDailyTotals(foodEntries),
    [foodEntries]
  );

  // Load today's entries from Supabase
  const loadTodayEntries = useCallback(async () => {
    if (!user) {
      setFoodEntries([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const today = getTodayString();

    try {
      const { data, error } = await supabase
        .from('food_log_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', today)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to load food entries:', error);
        setFoodEntries([]);
      } else {
        setFoodEntries(
          (data as DbFoodLogEntry[]).map(dbToFoodLogEntry)
        );
      }
    } catch (error) {
      console.error('Failed to load food entries:', error);
      setFoodEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load entries when user changes
  useEffect(() => {
    loadTodayEntries();
  }, [loadTodayEntries]);

  // Add multiple food entries from AI response (batch add)
  const addFoodsFromAI = useCallback(async (foods: AIFoodItem[]) => {
    if (!user || foods.length === 0) return;

    const now = new Date().toISOString();
    const today = getTodayString();

    // Create entries from AI food items
    const entries: FoodLogEntry[] = foods.map(food => ({
      id: generateId(),
      userId: user.id,
      date: today,
      name: food.name,
      amount: food.amount,
      unit: food.unit,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      createdAt: now,
      updatedAt: now,
    }));

    // Optimistically update local state
    setFoodEntries((prev) => [...prev, ...entries]);

    try {
      const { error } = await supabase
        .from('food_log_entries')
        .insert(entries.map(foodLogEntryToDb));

      if (error) {
        console.error('Failed to save food entries:', error);
        // Revert on error
        const entryIds = new Set(entries.map(e => e.id));
        setFoodEntries((prev) => prev.filter((e) => !entryIds.has(e.id)));
        setToast({
          visible: true,
          message: 'Failed to save food entries',
          type: 'error',
        });
      } else {
        setToast({
          visible: true,
          message: `Added ${entries.length} food${entries.length > 1 ? 's' : ''} to log`,
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Failed to save food entries:', error);
      const entryIds = new Set(entries.map(e => e.id));
      setFoodEntries((prev) => prev.filter((e) => !entryIds.has(e.id)));
      setToast({
        visible: true,
        message: 'Failed to save food entries',
        type: 'error',
      });
    }
  }, [user]);

  // Delete a food entry
  const deleteFoodEntry = useCallback(async (id: string) => {
    if (!user) return;

    // Optimistically remove from local state
    const entryToDelete = foodEntries.find((e) => e.id === id);
    setFoodEntries((prev) => prev.filter((e) => e.id !== id));

    try {
      const { error } = await supabase
        .from('food_log_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to delete food entry:', error);
        // Revert on error
        if (entryToDelete) {
          setFoodEntries((prev) => [...prev, entryToDelete]);
        }
      }
    } catch (error) {
      console.error('Failed to delete food entry:', error);
      if (entryToDelete) {
        setFoodEntries((prev) => [...prev, entryToDelete]);
      }
    }
  }, [user, foodEntries]);

  // Toast functions
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // Auto-hide toast after duration
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(hideToast, TOAST_DURATION);
      return () => clearTimeout(timer);
    }
  }, [toast.visible, hideToast]);

  const value: FoodLogContextValue = {
    foodEntries,
    dailyTotals,
    isLoading,
    toast,
    addFoodsFromAI,
    deleteFoodEntry,
    loadTodayEntries,
    showToast,
    hideToast,
  };

  return (
    <FoodLogContext.Provider value={value}>
      {children}
    </FoodLogContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useFoodLog(): FoodLogContextValue {
  const context = useContext(FoodLogContext);
  if (context === undefined) {
    throw new Error('useFoodLog must be used within a FoodLogProvider');
  }
  return context;
}
