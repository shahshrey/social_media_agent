export const baseColors = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  slate: 'hsl(var(--slate))',
} as const;

export const colorVariants = ['light', 'dark', 'foreground'] as const;

type ColorVariant = typeof colorVariants[number];

const generateColorVariants = (baseColor: string) => {
  return colorVariants.reduce((acc, variant) => ({
    ...acc,
    [variant]: `hsl(var(--${baseColor}-${variant}))`,
  }), {});
};

export const colors = Object.entries(baseColors).reduce((acc, [key, value]) => ({
  ...acc,
  [key]: {
    DEFAULT: value,
    ...generateColorVariants(key),
  },
}), {}); 