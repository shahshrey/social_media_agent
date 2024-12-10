export interface Theme {
  card: {
    base: string;
    hover: string;
    expanded: string;
  };
  text: {
    gradient: string;
  };
  animation: {
    spring: {
      type: string;
      stiffness: number;
      damping: number;
    };
    default: string;
  };
  components: {
    card: {
      base: string;
      hover: string;
    };
    text: {
      gradient: string;
    };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    ring: string;
    destructive: string;
    destructiveForeground: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    input: string;
    primaryForeground: string;
    secondaryForeground: string;
  };
}

export const defaultTheme: Theme = {
  card: {
    base: "rounded-xl border bg-card shadow transition-all",
    hover: "hover:border-primary/50 hover:shadow-lg",
    expanded: "border-primary/50 shadow-lg",
  },
  text: {
    gradient: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
  },
  animation: {
    spring: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
    default: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  components: {
    card: {
      base: "rounded-xl border bg-card shadow transition-all",
      hover: "hover:border-primary/50 hover:shadow-lg",
    },
    text: {
      gradient: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
    },
  },
  colors: {
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    accent: "hsl(var(--accent))",
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    muted: "hsl(var(--muted))",
    mutedForeground: "hsl(var(--muted-foreground))",
    border: "hsl(var(--border))",
    ring: "hsl(var(--ring))",
    destructive: "hsl(var(--destructive))",
    destructiveForeground: "hsl(var(--destructive-foreground))",
    cardForeground: "hsl(var(--card-foreground))",
    popover: "hsl(var(--popover))",
    popoverForeground: "hsl(var(--popover-foreground))",
    input: "hsl(var(--input))",
    primaryForeground: "hsl(var(--primary-foreground))",
    secondaryForeground: "hsl(var(--secondary-foreground))",
  },
}; 