export const toastConfig = {
  success: {
    className: "glass-morphism",
    style: {
      background: 'hsl(var(--background))',
      color: 'hsl(var(--primary))',
      border: '1px solid hsl(var(--border))',
    },
  },
  error: {
    className: "glass-morphism",
    style: {
      background: 'hsl(var(--background))',
      color: 'hsl(var(--destructive))',
      border: '1px solid hsl(var(--destructive))',
    },
  },
  info: {
    className: 'border-primary',
    style: {
      background: 'hsl(var(--muted))',
      color: 'hsl(var(--primary))',
      border: '1px solid hsl(var(--border))'
    }
  }
} as const; 