---
name: Log Page Polish
overview: "Four UI polish fixes for the Log page: align weight/sleep units, allow negative macro inputs, improve rating save UX, and add calorie goal display."
todos:
  - id: align-units
    content: Add min-width to .body-input-unit CSS so lbs/hours align
    status: completed
  - id: negative-macros
    content: Allow negative values in MacroInput validation
    status: completed
  - id: rating-ux
    content: Deselect rating after save and auto-hide 'Saved' after 1.25s
    status: completed
  - id: calorie-goal
    content: Add goal prop to CaloriesSummary and update LogPage
    status: completed
---

# Log Page Design Polish

## 1. Align Weight and Sleep Units

In [`src/components/log/WeightInput.tsx`](src/components/log/WeightInput.tsx) and [`src/components/log/SleepInput.tsx`](src/components/log/SleepInput.tsx), both use `.body-input-unit` for the "lbs" and "hours" labels. Since "lbs" is shorter than "hours", they don't align.**Fix:** Add `min-width` to the `.body-input-unit` class in [`src/App.css`](src/App.css) so both units take the same horizontal space. A width of ~45px should fit "hours" comfortably.---

## 2. Allow Negative Macro Inputs

In [`src/components/log/MacroInput.tsx`](src/components/log/MacroInput.tsx), line 41 validates with `parsedValue > 0`.**Fix:** Change to `parsedValue !== 0` so users can type `-20` to subtract from their totals.---

## 3. Improve Rating Save UX

In [`src/components/log/RatingInput.tsx`](src/components/log/RatingInput.tsx):**Current behavior:**

- After saving, the number stays selected
- "Saved" indicator stays visible indefinitely

**Fix:**

- After `onSave()`, set `localValue` back to `null` (deselects the button)
- Add a `showSaved` boolean state with a `setTimeout` that hides it after 1250ms
- Use `useEffect` cleanup to clear the timer if component unmounts

---

## 4. Add Goal to CaloriesSummary

In [`src/components/log/CaloriesSummary.tsx`](src/components/log/CaloriesSummary.tsx):**Fix:**

- Add a `goal` prop to the interface