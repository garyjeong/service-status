// src/design-system/ThemeContext.tsx
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Theme, themes, getTheme } from './theme';

// -----------------
// THEME CONTEXT
// -----------------
// This context provides theme information and a function to toggle the theme.

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to hold the current theme name
  const [themeName, setThemeName] = useState<'light' | 'dark'>(() => {
    const storedPreference = window.localStorage.getItem('theme');
    if (storedPreference === 'light' || storedPreference === 'dark') {
      return storedPreference;
    }
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Memoize the theme object to prevent unnecessary re-renders
  const activeTheme = useMemo(() => getTheme(themeName), [themeName]);

  // Effect to update localStorage and body class when theme changes
  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(themeName);
    window.localStorage.setItem('theme', themeName);
  }, [themeName]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setThemeName((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const contextValue = useMemo(
    () => ({
      theme: activeTheme,
      toggleTheme,
    }),
    [activeTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

// -----------------
// useTheme HOOK
// -----------------
// Custom hook to easily access the theme context.

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
