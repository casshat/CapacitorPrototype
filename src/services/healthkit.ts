/**
 * HealthKit Service
 * 
 * This module provides a clean TypeScript interface for working with Apple HealthKit.
 * It wraps the @capgo/capacitor-health plugin with proper types and error handling.
 */

import { 
  Health,
  type HealthDataType as CapgoHealthDataType,
  type HealthSample as CapgoHealthSample,
} from '@capgo/capacitor-health';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Re-export the plugin's HealthDataType for use throughout the app
 * Available types: 'steps' | 'distance' | 'calories' | 'heartRate' | 'weight'
 */
export type HealthDataType = CapgoHealthDataType;

/**
 * Authorization status for HealthKit
 */
export interface AuthorizationStatus {
  authorized: boolean;
  message: string;
}

/**
 * A single health data sample (our clean format)
 */
export interface HealthSample {
  value: number;
  unit: string;
  startDate: string;
  endDate: string;
  source?: string;
}

/**
 * Result from querying health data
 */
export interface HealthQueryResult {
  dataType: HealthDataType;
  samples: HealthSample[];
  count: number;
}

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

/**
 * Check if HealthKit is available on this device
 * 
 * Note: HealthKit is only available on iOS devices, not in the browser or simulator
 */
export async function isHealthKitAvailable(): Promise<boolean> {
  try {
    const { available } = await Health.isAvailable();
    return available;
  } catch (error) {
    console.warn('HealthKit availability check failed:', error);
    return false;
  }
}

/**
 * Request authorization to read/write specific health data types
 * 
 * @param readTypes - Data types you want to READ from HealthKit
 * @param writeTypes - Data types you want to WRITE to HealthKit
 * 
 * Important: iOS doesn't tell you if the user denied permission!
 * It only tells you that authorization was requested. You won't know
 * if they said yes or no until you try to read the data.
 */
export async function requestAuthorization(
  readTypes: HealthDataType[],
  writeTypes: HealthDataType[] = []
): Promise<AuthorizationStatus> {
  try {
    // Check availability first
    const available = await isHealthKitAvailable();
    if (!available) {
      return {
        authorized: false,
        message: 'HealthKit is not available on this device. Are you running on a real iPhone?',
      };
    }

    // Request authorization with the new API
    await Health.requestAuthorization({
      read: readTypes,
      write: writeTypes,
    });

    return {
      authorized: true,
      message: 'Authorization requested. User will be prompted to grant access.',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      authorized: false,
      message: `Failed to request authorization: ${errorMessage}`,
    };
  }
}

/**
 * Query health data for a specific type within a date range
 * 
 * @param dataType - The type of health data to query
 * @param startDate - Start of the date range
 * @param endDate - End of the date range
 * @param limit - Maximum number of samples to return (default: 100)
 */
export async function queryHealthData(
  dataType: HealthDataType,
  startDate: Date,
  endDate: Date = new Date(),
  limit: number = 100
): Promise<HealthQueryResult> {
  try {
    const { samples: rawSamples } = await Health.readSamples({
      dataType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      limit,
    });

    // Transform the results into our clean format
    const samples: HealthSample[] = rawSamples.map((sample: CapgoHealthSample) => ({
      value: sample.value,
      unit: sample.unit || '',
      startDate: sample.startDate,
      endDate: sample.endDate,
      source: sample.sourceName,
    }));

    return {
      dataType,
      samples,
      count: samples.length,
    };
  } catch (error) {
    console.error(`Failed to query ${dataType}:`, error);
    return {
      dataType,
      samples: [],
      count: 0,
    };
  }
}

/**
 * Get step count for a specific date range
 * Convenience function for the most common use case
 */
export async function getStepCount(
  startDate: Date,
  endDate: Date = new Date()
): Promise<number> {
  const result = await queryHealthData('steps', startDate, endDate);
  
  // Sum up all step samples
  return result.samples.reduce((total, sample) => total + sample.value, 0);
}

/**
 * Get the latest heart rate reading
 */
export async function getLatestHeartRate(): Promise<HealthSample | null> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const result = await queryHealthData('heartRate', oneDayAgo, new Date(), 1);
  
  return result.samples[0] || null;
}
