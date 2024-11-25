export const theme = {
  colors: {
    primary: {
      DEFAULT: 'hsl(var(--primary))',
      foreground: 'hsl(var(--primary-foreground))',
      light: 'hsl(var(--primary-light))',
      dark: 'hsl(var(--primary-dark))',
    },
    secondary: {
      DEFAULT: '#6366f1',
      light: '#e0e7ff',
      dark: '#4f46e5'
    },
    slate: {
      DEFAULT: '#64748b',
      light: '#f8fafc',
      dark: '#334155'
    },
    border: {
      DEFAULT: '#e2e8f0',
      focus: '#818cf8',
      hover: '#cbd5e1'
    },
    background: {
      card: '#ffffff',
      subtle: '#f8fafc',
      muted: '#f1f5f9'
    }
  },
  animation: {
    default: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    spring: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  borderRadius: {
    sm: '0.375rem',
    DEFAULT: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  components: {
    card: {
      base: "rounded-xl border bg-card shadow transition-all",
      hover: "hover:border-primary-light hover:shadow-lg",
      expanded: "border-primary-light shadow-lg",
    },
    button: {
      // Button variants...
    },
    text: {
      gradient: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
    }
  }
};

export type Theme = typeof theme; 