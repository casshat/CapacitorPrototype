/**
 * useDebounce - Debounce a value by delay
 * 
 * Returns the debounced value that only updates after the
 * specified delay has passed without changes.
 * 
 * Useful for search inputs to avoid excessive API calls.
 */

import { useState, useEffect } from 'react';

/**
 * Debounce a value by the specified delay.
 * 
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default 300ms)
 * @returns Debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 * 
 * useEffect(() => {
 *   // This only runs 300ms after the user stops typing
 *   searchApi(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timer if value changes or component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
