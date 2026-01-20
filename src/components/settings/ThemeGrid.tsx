/**
 * ThemeGrid - 2x2 grid of theme cards
 * 
 * TypeScript Concepts:
 * - Using context hook
 * - Mapping over theme configurations
 */

import { useTheme, themes, themeOrder } from '../../context/ThemeContext';
import type { ThemeKey } from '../../context/ThemeContext';
import ThemeCard from './ThemeCard';

/**
 * ThemeGrid - Grid layout for theme selection
 */
function ThemeGrid() {
  const { theme: currentTheme, setTheme } = useTheme();

  return (
    <div className="theme-grid">
      {themeOrder.map((themeKey: ThemeKey) => (
        <ThemeCard
          key={themeKey}
          theme={themes[themeKey]}
          isSelected={currentTheme === themeKey}
          onSelect={() => setTheme(themeKey)}
        />
      ))}
    </div>
  );
}

export default ThemeGrid;



