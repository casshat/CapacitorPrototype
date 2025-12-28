---
name: Daily Log Reset
overview: Add a mechanism to detect when the date changes and automatically reset the daily log to a fresh one with zeroed macros. This ensures users always see a clean slate at midnight.
todos:
  - id: extract-loadData
    content: Extract loadData function with useCallback for reuse
    status: pending
  - id: add-staleness-check
    content: Add isLogStale helper function to detect day changes
    status: pending
  - id: add-interval-effect
    content: Add useEffect with interval to check for date changes
    status: pending
---

# Macro Reset at Midnight

## Problem

The daily log only loads on app startup or when the user changes. If the app stays open past midnight, macros from the previous day remain in state instead of resetting to zero.

## Solution

Add a **date staleness check** that detects when the current log's date no longer matches today's date, and automatically loads/creates a fresh log.

## Implementation

### Step 1: Create a date comparison helper

Add a function to check if the log's date is stale (no longer today):

```typescript
function isLogStale(logDate: string): boolean {
  return logDate !== getTodayString();
}
```

**TypeScript Concept:** This is a pure function - it takes input, returns output, no side effects. Great for testing!

### Step 2: Add a useEffect to detect date changes

In [`src/context/AppContext.tsx`](src/context/AppContext.tsx), add a new `useEffect` that:

1. Runs on an interval (every minute) to check if the date has changed
2. When the date changes, loads the new day's log (or creates an empty one)
```typescript
// Check for day change every minute
useEffect(() => {
  const checkDateChange = () => {
    if (user && isLogStale(todayLog.date)) {
      loadData(); // Reload data for the new day
    }
  };
  
  const interval = setInterval(checkDateChange, 60000); // 60 seconds
  return () => clearInterval(interval); // Cleanup
}, [user, todayLog.date]);
```


**TypeScript Concepts Explained:**

- **Cleanup function**: The `return () => clearInterval(interval)` is called when the component unmounts, preventing memory leaks
- **Dependency array**: `[user, todayLog.date]` tells React to recreate the interval when these values change

### Step 3: Extract loadData to be reusable

Currently `loadData` is defined inside the `useEffect`. We'll extract it using `useCallback` so it can be called from multiple places.**TypeScript Concept: `useCallback`** - This "memoizes" a function, meaning React reuses the same function reference unless its dependencies change. This prevents unnecessary re-renders.

## Files to Modify

- [`src/context/AppContext.tsx`](src/context/AppContext.tsx) - Add date staleness check and interval

## Key Learning Points

1. **useEffect cleanup** - Return a function to clean up resources (timers, subscriptions)
2. **useCallback** - Memoize functions that are used in multiple effects or passed to children