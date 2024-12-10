import { useTheme as useNextTheme } from 'next-themes';
import { useTheme } from '../providers/theme-provider';
import { type Theme } from '../types/theme';

export const useAppTheme = () => {
  const { theme: themeName, ...rest } = useNextTheme();
  const themeContext = useTheme();

  const getChatThemeColors = () => ({
    "--copilot-kit-background-color": themeContext.colors.background,
    "--copilot-kit-secondary-color": themeContext.colors.primary,
    "--copilot-kit-secondary-contrast-color": themeContext.colors.primaryForeground,
    "--copilot-kit-primary-color": themeContext.colors.background,
    "--copilot-kit-contrast-color": themeContext.colors.foreground,
    "height": "100vh",
    "maxHeight": "100vh",
    "display": "flex",
    "flexDirection": "column" as const
  });

  return {
    ...rest,
    theme: themeContext,
    chatTheme: getChatThemeColors(),
  };
}; 