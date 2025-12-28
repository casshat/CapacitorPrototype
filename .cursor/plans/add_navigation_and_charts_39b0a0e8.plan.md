---
name: Add Navigation and Charts
overview: Add multi-page navigation using React Router and implement a history page with charts to visualize health data over time using Recharts.
todos:
  - id: install-deps
    content: Install react-router-dom and recharts packages
    status: pending
  - id: setup-router
    content: Add BrowserRouter to main.tsx
    status: pending
  - id: create-homepage
    content: Create pages/HomePage.tsx with existing HealthKit UI
    status: pending
  - id: create-tabbar
    content: Create components/TabBar.tsx for bottom navigation
    status: pending
  - id: update-app-layout
    content: Convert App.tsx to layout with Routes and TabBar
    status: pending
  - id: add-weekly-query
    content: Add getWeeklySteps function to healthkit.ts
    status: pending
  - id: create-history-page
    content: Create pages/HistoryPage.tsx with step chart
    status: pending
  - id: add-styles
    content: Add CSS for TabBar and chart components
    status: pending
---

# Add Navigation and History Charts

## Overview

We will add React Router for multi-page navigation and Recharts for visualizing health data history. The app will have a Home page (current functionality) and a History page (charts showing data over time).---

## New App Structure

```javascript
src/
  main.tsx          <-- Add Router wrapper
  App.tsx           <-- Becomes layout with navigation
  pages/
    HomePage.tsx    <-- Current HealthKit demo (moved from App.tsx)
    HistoryPage.tsx <-- NEW: Charts showing health data over time
  components/
    TabBar.tsx      <-- NEW: Bottom navigation tabs
    StepChart.tsx   <-- NEW: Chart component for steps
  services/
    healthkit.ts    <-- Existing (will add historical data query)
```

---

## Step 1: Install Dependencies

```bash
npm install react-router-dom recharts
```



- **react-router-dom**: Standard routing library for React
- **recharts**: Simple, composable charting library built on React

---

## Step 2: Set Up React Router

Update [`src/main.tsx`](src/main.tsx) to wrap the app with the Router:

```tsx
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

---

## Step 3: Create Page Components

### HomePage.tsx

Move the current content from `App.tsx` into a new `src/pages/HomePage.tsx` file. This keeps the existing HealthKit demo functionality.

### HistoryPage.tsx

Create a new page that:

1. Fetches the last 7 days of step data
2. Displays it in a bar chart using Recharts
3. Shows daily averages and trends

---

## Step 4: Create TabBar Navigation

Create a bottom tab bar component (`src/components/TabBar.tsx`) with two tabs:

- **Home** (house icon) - links to `/`
- **History** (chart icon) - links to `/history`

This follows the iOS tab bar pattern your users will expect.---

## Step 5: Update App.tsx as Layout

Transform `App.tsx` into a layout component that:

1. Renders the current page based on the route
2. Shows the TabBar at the bottom
3. Handles shared state if needed
```tsx
// Simplified structure
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
      <TabBar />
    </div>
  );
}
```


---

## Step 6: Add Historical Data Query

Extend [`src/services/healthkit.ts`](src/services/healthkit.ts) with a function to get daily step counts for the past week:

```typescript
export async function getWeeklySteps(): Promise<DailyStepData[]> {
  // Query last 7 days and aggregate by day
}
```

---

## Step 7: Build the Chart

Use Recharts to create a simple bar chart in `HistoryPage.tsx`:

```tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

<BarChart data={weeklyData}>
  <XAxis dataKey="day" />
  <YAxis />
  <Bar dataKey="steps" fill="#0a84ff" />
</BarChart>
```

---

## TypeScript Concepts You Will Learn

| Concept | Where You Will See It |

|---------|----------------------|

| Route typing | `<Route path="/" element={...} />` |

| Array mapping | `data.map(day => ...)` for chart data |

| Date manipulation | Getting last 7 days for history query |

| Component props | Passing data to chart components |---

## Files to Create/Modify

| File | Action |

|------|--------|

| `src/main.tsx` | Modify - add BrowserRouter |

| `src/App.tsx` | Modify - convert to layout with Routes |

| `src/pages/HomePage.tsx` | Create - move existing UI here |

| `src/pages/HistoryPage.tsx` | Create - new chart page |

| `src/components/TabBar.tsx` | Create - bottom navigation |

| `src/services/healthkit.ts` | Modify - add weekly data query |