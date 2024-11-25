'use client';

import { createContext, useContext, ReactNode } from 'react';
import { theme, Theme } from '../styles/theme';

const ThemeContext = createContext<Theme>(theme);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
}

export const ThemeProvider = ({ children, theme: customTheme }: ThemeProviderProps) => {
  return (
    <ThemeContext.Provider value={customTheme || theme}>
      {children}
    </ThemeContext.Provider>
  );
};
