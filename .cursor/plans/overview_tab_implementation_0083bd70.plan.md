---
name: Overview Tab Implementation
overview: Build the Overview tab with collapsible sections for Goals, Profile, and Cycle Settings, plus a weight trend chart and 7-day averages. All data will sync with Supabase.
todos:
  - id: db-schema
    content: "Update profiles table: add age, height_feet, height_inches, weight columns"
    status: completed
  - id: install-recharts
    content: Install recharts library for weight chart
    status: completed
  - id: collapsible-section
    content: Build CollapsibleSection component with expand/collapse animation
    status: completed
  - id: goal-editor
    content: Build GoalEditor component with save state and checkmark feedback
    status: completed
  - id: profile-field
    content: Build ProfileField component (single and height variants)
    status: completed
  - id: cycle-field
    content: Build CycleField component (number and date variants)
    status: completed
  - id: chart-range-selector
    content: Build ChartRangeSelector dropdown component
    status: completed
  - id: quick-stat-card
    content: Build QuickStatCard component with progress bar
    status: completed
  - id: weight-chart
    content: Build WeightChart component using Recharts (line only, no dots)
    status: completed
    dependencies:
      - install-recharts
  - id: update-appcontext
    content: Add functions to AppContext for goals, profile, cycle settings, weight history, averages
    status: completed
    dependencies:
      - db-schema
  - id: overview-page
    content: Build OverviewPage composing all sections with state management
    status: completed
    dependencies:
      - collapsible-section
      - goal-editor
      - profile-field
      - cycle-field
      - chart-range-selector
      - quick-stat-card
      - weight-chart
      - update-appcontext
  - id: overview-styles
    content: Add CSS styles for all overview components
    status: completed
    dependencies:
      - overview-page
---

# Overview Tab Implementation

## Overview

Build the complete Overview tab per the PM's spec, including collapsible sections, goal editing, profile management, cycle settings, weight chart, and 7-day averages. All data persists to Supabase.---

## 1. Database Schema Updates

Update the `profiles` table to include:

- `age` (INTEGER, nullable)
- `height_feet` (INTEGER, nullable)
- `height_inches` (INTEGER, nullable)
- `weight` (NUMERIC(4,1), nullable) - current/target weight

**File:** SQL migration in Supabase---

## 2. UI Primitives

### 2.1 CollapsibleSection

Create [`src/components/overview/CollapsibleSection.tsx`](src/components/overview/CollapsibleSection.tsx):

- Props: `title`, `isExpanded`, `onToggle`, `children`
- ChevronUp/ChevronDown icons from Lucide
- Smooth expand/collapse animation (300ms ease)
- Clickable header

### 2.2 GoalEditor

Create [`src/components/overview/GoalEditor.tsx`](src/components/overview/GoalEditor.tsx):

- Props: `label`, `value`, `unit`, `onSave`
- States: Default (disabled save), Editing (enabled save), Saved (green checkmark for 2s)
- Input styling: bgInput, borderInput, 8px radius
- Save button: accent color when enabled, gray when disabled

### 2.3 ProfileField

Create [`src/components/overview/ProfileField.tsx`](src/components/overview/ProfileField.tsx):

- Props: `label`, `value`, `onChange`, `unit`, `type` ('single' | 'height')
- Single input: 100px width, centered
- Height variant: two inputs (feet + inches), 80px each
- Save button per field (per PM decision)

### 2.4 CycleField

Create [`src/components/overview/CycleField.tsx`](src/components/overview/CycleField.tsx):

- Props: `label`, `value`, `onChange`, `unit`, `type` ('number' | 'date')
- Number input: 100px width, centered
- Date input: full width, left-aligned
- Save button per field

### 2.5 ChartRangeSelector

Create [`src/components/overview/ChartRangeSelector.tsx`](src/components/overview/ChartRangeSelector.tsx):

- Native `<select>` dropdown
- Options: 7d, 14d, 30d
- Styled with bgInput, borderInput, chevron icon

### 2.6 QuickStatCard

Create [`src/components/overview/QuickStatCard.tsx`](src/components/overview/QuickStatCard.tsx):

- Props: `label`, `average`, `goal`, `unit`
- States: Loading (skeleton), Empty (<7 days), Has Data
- 2-column grid layout
- Reuse GradientProgressBar from Dashboard

---

## 3. Weight Chart

Create [`src/components/overview/WeightChart.tsx`](src/components/overview/WeightChart.tsx):

- Use **Recharts** library (install `recharts`)
- Props: `data` (array of {date, weight}), `days` ('7d' | '14d' | '30d')
- Line chart only (no dots)
- Gradient stroke (gradientStart → gradientEnd)
- Y-axis: 3 labels (max, mid, min), auto-scaled
- X-axis: 3 date labels (start, mid, end), formatted as "MM/DD"
- Empty state: "Log weight for 2+ days to see trend"
- Chart height: 200px + 40px for labels

---

## 4. Overview Page

Create [`src/pages/OverviewPage.tsx`](src/pages/OverviewPage.tsx):

- Compose all sections
- State management for 3 collapsible sections (all start collapsed)
- State for chart range (7d/14d/30d)
- Wire up data fetching and saving

**Sections:**

1. **Goals** (collapsible) - 6 GoalEditor components
2. **Profile** (collapsible) - 3 ProfileField components (Age, Height, Weight)
3. **Cycle Settings** (collapsible) - 3 CycleField components
4. **Weight Trend** - WeightChart + ChartRangeSelector
5. **7-Day Averages** - 4 QuickStatCard components in 2-column grid

---

## 5. Data Layer

### 5.1 Update AppContext

Update [`src/context/AppContext.tsx`](src/context/AppContext.tsx):

- Add functions to update goals (PATCH user_goals)
- Add functions to update profile (PATCH profiles)
- Add functions to update cycle settings (PATCH profiles)
- Add function to fetch weight history (query daily_logs)
- Add function to calculate 7-day averages (from daily_logs)

### 5.2 Data Fetching

- Load goals from `user_goals` table (already exists)
- Load profile from `profiles` table (with new fields)
- Load weight history: query `daily_logs` where `weight_lbs IS NOT NULL`, ordered by date DESC
- Calculate averages: query last 7 days (or available days) from `daily_logs`

---

## 6. Styling

Update [`src/App.css`](src/App.css):

- Add styles for collapsible sections
- Add styles for goal editor inputs and buttons
- Add styles for profile/cycle fields
- Add styles for chart container
- Add styles for quick stat cards grid

---

## 7. Install Dependencies

Install Recharts:

```bash
npm install recharts --legacy-peer-deps
```

---

## Implementation Order

1. Database schema update (add profile fields)
2. Install Recharts
3. Build UI primitives (CollapsibleSection, GoalEditor, ProfileField, CycleField, ChartRangeSelector, QuickStatCard)
4. Build WeightChart with Recharts
5. Update AppContext with data functions
6. Build OverviewPage and wire everything together
7. Add CSS styles
8. Test all save operations