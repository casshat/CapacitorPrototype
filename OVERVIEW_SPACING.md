# Overview Tab - Spacing Reference

This document lists all spacing values used in the Overview tab. PM can suggest changes here, and we'll update the CSS accordingly.

---

## Current Spacing Values

### Page-Level Spacing
- **Page bottom padding:** 80px (space for tab bar)
- **Page header padding:** 20px top, 24px sides
- **Page title margin bottom:** 16px
- **Page divider margin bottom:** 24px

### Collapsible Sections
- **Section margin bottom:** 24px (space between sections)
- **Section header padding:** 10px top/bottom (recently reduced from 16px)
- **Section header height:** ~38px (button height) + 10px = ~48px total

### Goals Section (when expanded)
- **Goal editor margin bottom:** 28px (space between each goal input)
- **Goal editor header margin bottom:** 8px (space between label and input)
- **Goal editor controls gap:** 12px (space between input and Save button)

### Profile Section (when expanded)
- **Profile field margin bottom:** 24px (space between each field)
- **Profile field label margin bottom:** 8px (space between label and input)
- **Profile field controls gap:** 12px (space between input and Save button)

### Cycle Settings Section (when expanded)
- **Cycle field margin bottom:** 24px (space between each field)
- **Cycle field label margin bottom:** 8px (space between label and input)
- **Cycle field controls gap:** 12px (space between input and Save button)

### Weight Trend Section
- **Section header margin bottom:** 16px (space below "Weight Trend" title)
- **Chart container margin top:** 16px

### 7-Day Averages Section
- **Section title margin bottom:** 16px (space below "7-Day Averages" title)
- **Stats grid gap:** 12px (space between stat cards)
- **Stats grid margin top:** 16px

---

## Spacing Issues to Review

Please review the following and suggest changes:

1. **Section spacing when collapsed:** Currently 24px between sections. Should this be smaller?
2. **Section header padding:** Currently 10px top/bottom. Is this the right height?
3. **Goal editor spacing:** 28px between goals. Too much? Too little?
4. **Profile/Cycle field spacing:** 24px between fields. Consistent with goals?
5. **Overall page spacing:** Does the page feel too cramped or too spacious?

---

## How to Provide Feedback

**Option 1: Annotate this document**
- Add comments like: "Reduce goal editor spacing to 20px"
- Or: "Section headers need more padding - try 12px"

**Option 2: Screenshot with annotations**
- Take a screenshot of the Overview tab
- Mark areas that need spacing changes
- Note desired pixel values

**Option 3: List specific changes**
- "Reduce spacing between collapsed sections from 24px to 16px"
- "Increase goal editor spacing from 28px to 32px"
- etc.

---

## CSS Variables to Update

Once you provide feedback, we'll update these CSS variables/classes in `src/App.css`:

- `.collapsible-section { margin-bottom: Xpx; }`
- `.collapsible-section-header { padding: Xpx 0; }`
- `.goal-editor { margin-bottom: Xpx; }`
- `.profile-field { margin-bottom: Xpx; }`
- `.cycle-field { margin-bottom: Xpx; }`
- `.overview-section-header { margin-bottom: Xpx; }`
- `.quick-stats-grid { gap: Xpx; }`

---

*Last updated: December 2025*

