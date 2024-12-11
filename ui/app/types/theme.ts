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
  gradients: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
  };
  input: {
    base: string;
    focus: string;
  };
}

export const defaultTheme: Theme = {
  card: {
    base: "rounded-xl glass-card shadow-lg transition-all",
    hover: "glass-hover hover:shadow-xl hover:-translate-y-0.5",
    expanded: "glass-card shadow-xl border-primary/20",
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
      base: "rounded-xl glass-card shadow-lg transition-all",
      hover: "glass-hover hover:shadow-xl hover:-translate-y-0.5",
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
  gradients: {
    background: "bg-gradient-to-br from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-mid))] to-[hsl(var(--gradient-end))]",
    primary: "bg-gradient-to-br from-primary/80 via-accent/70 to-secondary/60 backdrop-blur-lg",
    secondary: "bg-gradient-to-br from-secondary/80 via-accent/70 to-primary/60 backdrop-blur-lg",
    accent: "bg-gradient-to-br from-accent/80 via-primary/70 to-secondary/60 backdrop-blur-lg",
  },
  input: {
    base: "bg-[hsl(var(--layer-1))] border-[hsl(var(--border))]",
    focus: "focus:ring-[hsl(var(--ring))] focus:border-[hsl(var(--border))]"
  }
}; 