import { useTheme as useNextTheme } from 'next-themes';
import { defaultTheme, type Theme } from '../types/theme';

export const useAppTheme = () => {
  const { theme: themeName, ...rest } = useNextTheme();
  return {
    ...rest,
    theme: defaultTheme,
  };
}; 