import { useTheme as useNextTheme } from 'next-themes';
import { useTheme } from '../providers/theme-provider';
import { type Theme } from '../types/theme';

export const useAppTheme = () => {
  const { theme: themeName, ...rest } = useNextTheme();
  const themeContext = useTheme();

  const getChatThemeColors = () => ({
    "--copilot-kit-background-color": "hsl(var(--layer-1))",
    "--copilot-kit-secondary-color": "hsl(var(--primary))",
    "--copilot-kit-secondary-contrast-color": "hsl(var(--foreground))",
    "--copilot-kit-primary-color": "hsl(var(--layer-1))",
    "--copilot-kit-contrast-color": "hsl(var(--foreground))",
    "--copilot-kit-border-color": "hsl(var(--border))",
    "--copilot-kit-input-background": "hsl(var(--input-bg))",
    "--copilot-kit-input-border": "hsl(var(--input-border))",
    "--copilot-kit-muted": "hsl(var(--muted))",
    "--copilot-kit-muted-foreground": "hsl(var(--muted-foreground))",
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