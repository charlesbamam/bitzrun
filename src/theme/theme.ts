export const theme = {
  colors: {
    background: '#000000',
    backgroundSecondary: '#0A0A0A',
    card: '#1C1C1E', // Cinza grafite premium (iOS SystemGray6 dark)
    cardSecondary: '#2C2C2E',
    primary: '#CCFF00', // Verde-limão enérgico
    primaryPressed: '#B3E600',
    primaryDisabled: '#3A4D00',
    text: '#FFFFFF', // Branco para títulos
    textSecondary: '#8E8E93', // Cinza claro (iOS SystemGray)
    textMuted: '#48484A',
    border: '#2C2C2E',
    borderLight: '#3A3A3C',
    success: '#30D158',
    error: '#FF453A',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  typography: {
    titleLarge: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      lineHeight: 34,
    },
    titleMedium: {
      fontSize: 22,
      fontWeight: 'bold' as const,
      lineHeight: 28,
    },
    titleSmall: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: 'normal' as const,
      lineHeight: 22,
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: 'normal' as const,
      lineHeight: 20,
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: 'normal' as const,
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
    },
  },
  shadows: {
    subtle: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};

export type ThemeType = typeof theme;
