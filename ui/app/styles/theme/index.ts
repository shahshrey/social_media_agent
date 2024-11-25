import { colors } from './colors';
import { animations } from './animations';

export const theme = {
  colors,
  animation: animations,
  borderRadius: {
    sm: '0.375rem',
    DEFAULT: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  components: {
    card: {
      base: "rounded-xl border bg-card shadow transition-all",
      hover: "hover:border-primary-light hover:shadow-lg",
      expanded: "border-primary-light shadow-lg",
    },
    text: {
      gradient: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
    },
  },
} as const;

export type Theme = typeof theme; 