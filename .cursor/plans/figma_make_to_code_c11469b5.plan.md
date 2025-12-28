---
name: Figma Make to Code
overview: Design your app UI in Figma Make, then manually translate the design specifications into your React components and CSS files. This hands-on approach gives you full control and understanding of your code.
todos:
  - id: design-figma
    content: Create app design in Figma Make using AI prompts
    status: pending
  - id: extract-specs
    content: Extract colors, typography, and spacing from Figma design
    status: pending
  - id: update-css-vars
    content: Update CSS variables in App.css to match Figma specs
    status: pending
  - id: update-styles
    content: Update component styles (.card, .btn, etc.) to match design
    status: pending
  - id: update-jsx
    content: Modify App.tsx structure if layout changes are needed
    status: pending
  - id: test-browser
    content: Test changes in browser at localhost:5173
    status: pending
---

# Figma Make to React: Manual Integration Workflow

## Overview

You will design your app in Figma Make, then extract design specifications (colors, spacing, typography, layout) and translate them into your existing [`src/App.tsx`](src/App.tsx) and [`src/App.css`](src/App.css) files.---

## Step 1: Create Your Design in Figma Make

1. Go to [figma.com](https://figma.com) and sign in
2. In your drafts, click **"Make"** in the upper-right corner to create a new Figma Make file
3. Use the AI chat to describe your app:

- Example prompt: *"Create a health tracking app with a dark theme. Show step count and heart rate data cards, and three action buttons."*

4. Iterate with prompts like:

- *"Make the background darker"*
- *"Add a gradient to the title"*
- *"Use rounded cards with more padding"*

---

## Step 2: Extract Design Specifications from Figma

Once your design looks good, extract these key values by clicking on elements in Figma:

### Colors (look in the right panel under "Fill")

```javascript
Background color: #______
Card background: #______
Primary text: #______
Secondary text: #______
Accent color 1: #______
Accent color 2: #______
```



### Typography (look under "Text" properties)

```javascript
Font family: ______
Title size: ______px, weight: ______
Body size: ______px
Button size: ______px
```



### Spacing and Layout (look under "Frame" properties)

```javascript
Card padding: ______px
Card border-radius: ______px
Gap between elements: ______px
```

---

## Step 3: Update CSS Variables in Your Project

Open [`src/App.css`](src/App.css) and update the CSS variables at the top to match your Figma design:

```css
:root {
  --bg-primary: #YOUR_BG_COLOR;
  --bg-secondary: #YOUR_SECONDARY_BG;
  --bg-card: #YOUR_CARD_BG;
  --text-primary: #YOUR_TEXT_COLOR;
  --text-secondary: #YOUR_MUTED_TEXT;
  --accent-red: #YOUR_ACCENT_1;
  --accent-blue: #YOUR_ACCENT_2;
  --radius: YOUR_RADIUS px;
  --spacing: YOUR_SPACING px;
}
```

This approach means you only need to change values in one place, and the entire app updates.---

## Step 4: Update Component Styles

For each UI element in your Figma design, find the corresponding CSS class in [`src/App.css`](src/App.css):| Figma Element | CSS Class to Edit ||---------------|-------------------|| Header/Title | `.header`, `.header h1` || Step cards | `.card`, `.card h2`, `.card p` || Buttons | `.btn`, `.btn-primary` || Data display boxes | `.data-card`, `.data-value` || Status message | `.status` |---

## Step 5: Update JSX Structure (if needed)

If your Figma design has a different layout (e.g., different order of sections, new elements), update the JSX in [`src/App.tsx`](src/App.tsx).Example: If you want to add an icon to a button:

```tsx
<button className="btn">
  <span className="btn-icon">+</span>
  Check HealthKit
</button>
```

---

## Step 6: Test in Browser

Your dev server is already running at http://localhost:5173/Changes to `.css` and `.tsx` files will hot-reload automatically - just save and see the updates instantly!---

## Quick Reference: File Mapping

```javascript
Your Project Structure:
src/
  App.tsx    <-- Component structure (JSX/HTML)
  App.css    <-- All styling (colors, layout, spacing)
  index.css  <-- Global resets and base styles
```

---

## Pro Tips for the Manual Workflow