/**
 * ThemeContext - Theme state management
 * 
 * Handles theme switching with CSS variables approach.
 * Persists theme preference to localStorage.
 * 
 * TypeScript Concepts:
 * - Union types for theme keys
 * - Context pattern for global theme state
 * - localStorage persistence
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

// ============================================================================
// TYPES
// ============================================================================

/** Available theme keys */
export type ThemeKey = 'softBlush' | 'sageGreen' | 'lightGray' | 'dark';

/** Theme configuration object */
export interface ThemeConfig {
  key: ThemeKey;
  name: string;
  colors: {
    bgPrimary: string;
    accent: string;
    gradientStart: string;
  };
}

/** All available themes */
export const themes: Record<ThemeKey, ThemeConfig> = {
  softBlush: {
    key: 'softBlush',
    name: 'Soft Blush',
    colors: {
      bgPrimary: '#FDF9F8',
      accent: '#C9907E',
      gradientStart: '#C9988A',
    },
  },
  sageGreen: {
    key: 'sageGreen',
    name: 'Sage Green',
    colors: {
      bgPrimary: '#F7F9F7',
      accent: '#7D9B7A',
      gradientStart: '#8FA88C',
    },
  },
  lightGray: {
    key: 'lightGray',
    name: 'Light Gray',
    colors: {
      bgPrimary: '#F8F8F8',
      accent: '#737373',
      gradientStart: '#8C8C8C',
    },
  },
  dark: {
    key: 'dark',
    name: 'Dark',
    colors: {
      bgPrimary: '#1A1A1A',
      accent: '#A89E96',
      gradientStart: '#8C8C8C',
    },
  },
};

/** Theme order for display in grid */
export const themeOrder: ThemeKey[] = ['softBlush', 'sageGreen', 'lightGray', 'dark'];

interface ThemeContextValue {
  /** Current theme key */
  theme: ThemeKey;
  /** Current theme configuration */
  themeConfig: ThemeConfig;
  /** Set the active theme */
  setTheme: (theme: ThemeKey) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'fittrack-theme';
const DEFAULT_THEME: ThemeKey = 'softBlush';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get saved theme from localStorage, with system dark mode fallback
 */
function getSavedTheme(): ThemeKey {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in themes) {
      return saved as ThemeKey;
    }
  } catch {
    // localStorage might not be available
  }

  // Check system dark mode preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      return 'dark';
    }
  }

  return DEFAULT_THEME;
}

/**
 * Apply theme to document root
 */
function applyTheme(theme: ThemeKey): void {
  if (typeof document !== 'undefined') {
    if (theme === 'softBlush') {
      // Remove data-theme attribute for default theme
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
}

/**
 * Save theme to localStorage
 */
function saveTheme(theme: ThemeKey): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage might not be available
  }
}

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider - Wraps the app and provides theme state
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeKey>(getSavedTheme);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Set theme handler
  const setTheme = useCallback((newTheme: ThemeKey) => {
    setThemeState(newTheme);
    saveTheme(newTheme);
    applyTheme(newTheme);
  }, []);

  const value: ThemeContextValue = {
    theme,
    themeConfig: themes[theme],
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * useTheme - Hook to access theme state and setter
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}



