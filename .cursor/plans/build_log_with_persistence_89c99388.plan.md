---
name: Build Log with Persistence
overview: Update the Dashboard with new typography/colors, set up local data persistence with React Context + localStorage, then build the complete Log page that shares data with the Dashboard.
todos:
  - id: update-tokens
    content: Update CSS design tokens (colors, typography weights)
    status: completed
  - id: update-tabbar-strokes
    content: Update TabBar icon stroke widths
    status: completed
  - id: add-dailylog-type
    content: Add DailyLog interface to types/fitness.ts
    status: completed
  - id: create-context
    content: Create AppContext with localStorage persistence
    status: completed
  - id: create-hook
    content: Create useDailyLog custom hook
    status: completed
  - id: update-main
    content: Wrap app in AppProvider in main.tsx
    status: completed
  - id: update-dashboard
    content: Update Dashboard to read from context
    status: completed
  - id: build-styled-input
    content: Build StyledInput base component
    status: completed
  - id: build-primary-button
    content: Build PrimaryButton base component
    status: completed
  - id: build-macro-input
    content: Build MacroInput component
    status: completed
  - id: build-calories-summary
    content: Build CaloriesSummary component
    status: completed
  - id: build-sleep-input
    content: Build SleepInput component
    status: completed
  - id: build-weight-input
    content: Build WeightInput component
    status: completed
  - id: build-cycle-section
    content: Build CycleSection component
    status: completed
  - id: build-steps-card
    content: Build StepsCard for Log page
    status: completed
  - id: build-rating-input
    content: Build RatingInput component
    status: completed
  - id: compose-log-page
    content: Compose LogPage from all components
    status: completed
  - id: test-data-flow
    content: Test data persistence between pages
    status: completed
---

# Build Log Page with Local Data Persistence

## Overview

We will update global styles, add a shared data layer using React Context + localStorage, then build the Log page. Data entered in Log will immediately appear in Dashboard and persist across browser refreshes.---

## Phase 1: Global Style Updates

Update existing CSS and Dashboard components to match the new spec.

### 1.1 Update Design Tokens in [`src/App.css`](src/App.css)

| Token | Old | New ||-------|-----|-----|| `--color-text-primary` | #3D352F | #2D2420 || `--color-text-secondary` | #7A6E66 | #6B5D54 || `--color-text-tertiary` | #A89E96 | #9A8E86 || Font weights | 400/500 | 500/600 |Add new tokens:

- `--color-bg-input`, `--color-border-input`
- `--color-button-primary`, `--color-success`
- New font shorthand variables

### 1.2 Update TabBar icon strokes

- Active: 2 → 2.5
- Inactive: 1.5 → 2

---

## Phase 2: Data Persistence Layer

### 2.1 Update Types in [`src/types/fitness.ts`](src/types/fitness.ts)

Add `DailyLog` interface from the spec:

```typescript
interface DailyLog {
  date: string;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  sleepHours: number | null;
  weightLbs: number | null;
  isPeriodDay: boolean | null;
  steps: number;
  energyRating: 1|2|3|4|5 | null;
  hungerRating: 1|2|3|4|5 | null;
  motivationRating: 1|2|3|4|5 | null;
}
```



### 2.2 Create App Context

Create `src/context/AppContext.tsx`:

- Holds current day's log data
- Provides functions to update log entries
- Syncs to localStorage on every change
- Loads from localStorage on app start

### 2.3 Create Custom Hook

Create `src/hooks/useDailyLog.ts`:

- `getTodayLog()` — returns today's data
- `updateMacros(type, amount)` — adds to protein/carbs/fat
- `updateSleep(hours)` — sets sleep
- `updateWeight(lbs)` — sets weight
- `updateRating(type, value)` — sets energy/hunger/motivation
- `togglePeriodDay(value)` — sets period status

### 2.4 Wrap App with Provider

Update [`src/main.tsx`](src/main.tsx) to wrap app in `AppProvider`.

### 2.5 Update Dashboard to Use Context

Modify [`src/pages/HomePage.tsx`](src/pages/HomePage.tsx) to read from context instead of mock data.---

## Phase 3: Base UI Components

### 3.1 StyledInput Component

Create `src/components/ui/StyledInput.tsx`:

- Rounded input with distinct background
- Supports number type, placeholder, width
- Used by MacroInput, SleepInput, WeightInput

### 3.2 PrimaryButton Component

Create `src/components/ui/PrimaryButton.tsx`:

- Dark background, white text
- Disabled state styling
- Small variant for Save buttons

---

## Phase 4: Log Page Components

Build each component in `src/components/log/`:| Component | Purpose ||-----------|---------|| `LogHeader.tsx` | Date display (same as Dashboard header) || `MacroInput.tsx` | Label + input + Add button for each macro || `CaloriesSummary.tsx` | Calculated calories card || `SleepInput.tsx` | Sleep hours input || `WeightInput.tsx` | Weight input || `CycleSection.tsx` | Phase badge + prediction + Yes/No toggle || `StepsCard.tsx` | Display-only steps with card background || `RatingInput.tsx` | 1-5 rating buttons + Save |---

## Phase 5: Compose Log Page

### 5.1 Build LogPage

Create complete [`src/pages/LogPage.tsx`](src/pages/LogPage.tsx):

- Import all log components
- Use `useDailyLog` hook for state
- Layout sections per spec

### 5.2 Test Data Flow

Verify:

- Enter macros in Log → Dashboard calories update
- Enter sleep in Log → Dashboard sleep updates
- Refresh page → data persists

---

## Key Files

| File | Purpose ||------|---------|| `src/context/AppContext.tsx` | Shared state + localStorage || `src/hooks/useDailyLog.ts` | Convenient hook for components || `src/types/fitness.ts` | DailyLog interface || `src/pages/LogPage.tsx` | Log screen || `src/pages/HomePage.tsx` | Dashboard (updated to use context) |---

## TypeScript Concepts You Will Learn