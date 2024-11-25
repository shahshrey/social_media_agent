import { type Config } from 'tailwindcss';

// Base colors with CSS variables
const baseColors = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  slate: 'hsl(var(--slate))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
} as const;

// Color variant generator
const generateColorVariants = (baseColor: string) => ({
  DEFAULT: `hsl(var(--${baseColor}))`,
  light: `hsl(var(--${baseColor}-light))`,
  dark: `hsl(var(--${baseColor}-dark))`,
  foreground: `hsl(var(--${baseColor}-foreground))`,
});

// Consolidated colors
const colors = {
  primary: generateColorVariants('primary'),
  secondary: generateColorVariants('secondary'),
  slate: generateColorVariants('slate'),
  border: {
    DEFAULT: 'hsl(var(--border))',
    focus: 'hsl(var(--border-focus))',
    hover: 'hsl(var(--border-hover))',
  },
  background: {
    DEFAULT: 'hsl(var(--background))',
    card: 'hsl(var(--background-card))',
    subtle: 'hsl(var(--background-subtle))',
    muted: 'hsl(var(--background-muted))',
  },
};

// Animations
const animations = {
  default: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  spring: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  },
} as const;

// Border radius
const borderRadius = {
  sm: '0.375rem',
  DEFAULT: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
} as const;

// Component styles
const components = {
  card: {
    base: "rounded-xl border bg-card shadow transition-all",
    hover: "hover:border-primary-light hover:shadow-lg",
    expanded: "border-primary-light shadow-lg",
  },
  text: {
    gradient: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
  },
  utils: {
    glassMorphism: "bg-white/80 backdrop-blur-lg border border-white/20",
    cardHover: "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
  },
} as const;

// Main theme object
export const theme = {
  colors,
  animation: animations,
  borderRadius,
  components,
} as const;

export type Theme = typeof theme; 