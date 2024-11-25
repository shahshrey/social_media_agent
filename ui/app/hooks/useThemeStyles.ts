import { useMemo } from 'react';
import { useTheme } from '../providers/ThemeProvider';

export const useThemeStyles = () => {
  const theme = useTheme();
  
  return useMemo(() => ({
    ...theme.components,
    utils: {
      glassMorphism: "bg-white/80 backdrop-blur-lg border border-white/20",
      cardHover: "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
    }
  }), [theme]);
}; 