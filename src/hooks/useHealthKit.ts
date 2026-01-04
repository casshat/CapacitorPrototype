/**
 * useHealthKit - Custom hook for Apple HealthKit integration
 * 
 * This hook encapsulates all HealthKit logic:
 * - Checking availability (only works on real iOS devices)
 * - Managing linked/authorized state
 * - Fetching step count data
 * 
 * The linked state is stored in localStorage so it persists across sessions.
 * When the user taps "Link Apple Health", we request authorization and
 * immediately try to fetch steps to verify it worked.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  isHealthKitAvailable,
  requestAuthorization,
  getStepCount,
} from '../services/healthkit';

// ============================================================================
// TYPES
// ============================================================================

interface UseHealthKitReturn {
  /** Whether HealthKit is available on this device (false in browser/simulator) */
  isAvailable: boolean;
  /** Whether the user has linked/authorized Apple Health */
  isLinked: boolean;
  /** Whether we're currently checking availability or syncing */
  isLoading: boolean;
  /** Today's step count from HealthKit */
  steps: number;
  /** Error message if something went wrong */
  error: string | null;
  /** Request HealthKit authorization - call this when user taps "Link" button */
  linkHealth: () => Promise<void>;
  /** Fetch latest step count from HealthKit */
  syncSteps: () => Promise<number>;
  /** Unlink Apple Health (just clears local state, doesn't revoke iOS permissions) */
  unlinkHealth: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'healthkit_linked';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the start of today in the user's local timezone.
 * HealthKit queries need a date range, so we query from midnight to now.
 */
function getStartOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

/**
 * Check if HealthKit is linked (authorized) from localStorage.
 * We store this locally because iOS doesn't tell us if user denied permission.
 */
function getLinkedState(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Save the linked state to localStorage.
 */
function setLinkedState(linked: boolean): void {
  try {
    if (linked) {
      localStorage.setItem(STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage might not be available in some contexts
  }
}

// ============================================================================
// HOOK
// ============================================================================

export function useHealthKit(): UseHealthKitReturn {
  // State
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLinked, setIsLinked] = useState(getLinkedState());
  const [isLoading, setIsLoading] = useState(true);
  const [steps, setSteps] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Check availability on mount
  useEffect(() => {
    async function checkAvailability() {
      setIsLoading(true);
      try {
        const available = await isHealthKitAvailable();
        setIsAvailable(available);
        
        // If available and already linked, sync steps
        if (available && getLinkedState()) {
          const startOfDay = getStartOfToday();
          const stepCount = await getStepCount(startOfDay, new Date());
          setSteps(stepCount);
        }
      } catch (err) {
        console.warn('HealthKit availability check failed:', err);
        setIsAvailable(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAvailability();
  }, []);

  /**
   * Request HealthKit authorization and fetch initial steps.
   * Called when user taps "Link Apple Health" button.
   */
  const linkHealth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check availability first
      const available = await isHealthKitAvailable();
      if (!available) {
        setError('Apple Health is not available on this device');
        setIsLoading(false);
        return;
      }

      // Request authorization for steps (read only)
      const authResult = await requestAuthorization(['steps'], []);
      
      if (!authResult.authorized) {
        setError(authResult.message);
        setIsLoading(false);
        return;
      }

      // Try to fetch steps to verify authorization worked
      // Note: iOS won't tell us if user denied, so we try to read data
      const startOfDay = getStartOfToday();
      const stepCount = await getStepCount(startOfDay, new Date());
      
      // If we get here, authorization was successful (or at least we can try to read)
      setIsLinked(true);
      setLinkedState(true);
      setSteps(stepCount);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to link Apple Health';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch the latest step count from HealthKit.
   * Call this to refresh steps without re-requesting authorization.
   */
  const syncSteps = useCallback(async (): Promise<number> => {
    if (!isAvailable || !isLinked) {
      return 0;
    }

    setIsLoading(true);
    try {
      const startOfDay = getStartOfToday();
      const stepCount = await getStepCount(startOfDay, new Date());
      setSteps(stepCount);
      return stepCount;
    } catch (err) {
      console.error('Failed to sync steps:', err);
      return steps; // Return cached value on error
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable, isLinked, steps]);

  /**
   * Unlink Apple Health (clears local state only).
   * Note: This doesn't revoke iOS permissions - user must do that in Settings.
   */
  const unlinkHealth = useCallback(() => {
    setIsLinked(false);
    setLinkedState(false);
    setSteps(0);
  }, []);

  return {
    isAvailable,
    isLinked,
    isLoading,
    steps,
    error,
    linkHealth,
    syncSteps,
    unlinkHealth,
  };
}

export default useHealthKit;

