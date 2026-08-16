/**
 * HINCH MART Color System
 * Primary: Construction Gold #FDB913
 * Dark Navy: #152238
 */

export const palette = {
  // Brand Colors
  primary: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FDB913',
    600: '#F9A825',
    700: '#F57F17',
    800: '#E65100',
    900: '#BF360C',
  },

  navy: {
    50: '#E8EAF0',
    100: '#C5CAD6',
    200: '#9FA8BB',
    300: '#79879F',
    400: '#5C6D8B',
    500: '#3F5477',
    600: '#37496B',
    700: '#2C3B5B',
    800: '#222E4B',
    900: '#152238',
  },

  // Neutral
  neutral: {
    0: '#FFFFFF',
    50: '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#868E96',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
    1000: '#000000',
  },

  // Semantic
  success: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#2E7D32',
    600: '#2E7D32',
    700: '#1B5E20',
  },

  danger: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#E53935',
    600: '#D32F2F',
    700: '#B71C1C',
  },

  warning: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FB8C00',
    600: '#F57C00',
    700: '#E65100',
  },

  info: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#1E88E5',
    600: '#1565C0',
    700: '#0D47A1',
  },
} as const;

/**
 * ColorScheme interface — uses string to allow dark overrides
 */
export interface ColorScheme {
  background: string;
  surface: string;
  surfaceVariant: string;
  surfaceElevated: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  onPrimary: string;
  navy: string;
  navyLight: string;
  onNavy: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  textInverse: string;
  textLink: string;
  border: string;
  borderLight: string;
  borderFocused: string;
  success: string;
  successLight: string;
  danger: string;
  dangerLight: string;
  warning: string;
  warningLight: string;
  info: string;
  infoLight: string;
  icon: string;
  iconSecondary: string;
  divider: string;
  overlay: string;
  shimmer: string;
  skeleton: string;
  skeletonHighlight: string;
  cardBackground: string;
  cardBorder: string;
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
  inputBackground: string;
  inputBorder: string;
  inputPlaceholder: string;
  inputFocusBorder: string;
  inputErrorBorder: string;
  badgeBackground: string;
  badgeText: string;
  ratingFilled: string;
  ratingEmpty: string;
}

export const lightColors: ColorScheme = {
  background: palette.neutral[50],
  surface: palette.neutral[0],
  surfaceVariant: palette.neutral[100],
  surfaceElevated: palette.neutral[0],
  primary: palette.primary[500],
  primaryLight: palette.primary[100],
  primaryDark: palette.primary[700],
  onPrimary: palette.neutral[0],
  navy: palette.navy[900],
  navyLight: palette.navy[700],
  onNavy: palette.neutral[0],
  textPrimary: palette.navy[900],
  textSecondary: palette.neutral[600],
  textTertiary: palette.neutral[500],
  textDisabled: palette.neutral[400],
  textInverse: palette.neutral[0],
  textLink: palette.info[500],
  border: palette.neutral[200],
  borderLight: palette.neutral[100],
  borderFocused: palette.primary[500],
  success: palette.success[500],
  successLight: palette.success[50],
  danger: palette.danger[500],
  dangerLight: palette.danger[50],
  warning: palette.warning[500],
  warningLight: palette.warning[50],
  info: palette.info[500],
  infoLight: palette.info[50],
  icon: palette.neutral[600],
  iconSecondary: palette.neutral[400],
  divider: palette.neutral[200],
  overlay: 'rgba(0, 0, 0, 0.5)',
  shimmer: palette.neutral[200],
  skeleton: palette.neutral[200],
  skeletonHighlight: palette.neutral[100],
  cardBackground: palette.neutral[0],
  cardBorder: palette.neutral[200],
  tabBar: palette.neutral[0],
  tabBarActive: palette.primary[500],
  tabBarInactive: palette.neutral[500],
  inputBackground: palette.neutral[0],
  inputBorder: palette.neutral[300],
  inputPlaceholder: palette.neutral[400],
  inputFocusBorder: palette.primary[500],
  inputErrorBorder: palette.danger[500],
  badgeBackground: palette.danger[500],
  badgeText: palette.neutral[0],
  ratingFilled: palette.primary[500],
  ratingEmpty: palette.neutral[300],
};

export const gradients = {
  gold: ['#FFC72C', '#FDB913', '#E69500'] as const,
  goldBright: ['#FFE066', '#FDB913'] as const,
  navy: ['#0B132B', '#152238', '#1C2E4A'] as const,
  navyDark: ['#090D16', '#111827', '#1F2937'] as const,
  blue: ['#2563EB', '#1D4ED8'] as const,
  emerald: ['#10B981', '#059669'] as const,
  amber: ['#F59E0B', '#D97706'] as const,
  purple: ['#8B5CF6', '#7C3AED'] as const,
  rose: ['#F43F5E', '#E11D48'] as const,
};

export const darkColors: ColorScheme = {
  background: '#0B0F17',
  surface: '#141A25',
  surfaceVariant: '#1E2638',
  surfaceElevated: '#252F45',
  primary: palette.primary[500],
  primaryLight: '#3D2E0A',
  primaryDark: palette.primary[300],
  onPrimary: palette.navy[900],
  navy: palette.neutral[100],
  navyLight: palette.neutral[200],
  onNavy: palette.navy[900],
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textDisabled: '#475569',
  textInverse: palette.navy[900],
  textLink: palette.info[300],
  border: '#242F44',
  borderLight: '#1B2436',
  borderFocused: palette.primary[500],
  success: palette.success[400],
  successLight: '#0D2818',
  danger: palette.danger[300],
  dangerLight: '#3D1014',
  warning: palette.warning[300],
  warningLight: '#3D2700',
  info: palette.info[300],
  infoLight: '#0D2240',
  icon: '#94A3B8',
  iconSecondary: '#64748B',
  divider: '#1E2638',
  overlay: 'rgba(0, 0, 0, 0.75)',
  shimmer: '#1E2638',
  skeleton: '#1E2638',
  skeletonHighlight: '#2A364F',
  cardBackground: '#141A25',
  cardBorder: '#242F44',
  tabBar: '#141A25',
  tabBarActive: palette.primary[500],
  tabBarInactive: '#64748B',
  inputBackground: '#0B0F17',
  inputBorder: '#242F44',
  inputPlaceholder: '#64748B',
  inputFocusBorder: palette.primary[500],
  inputErrorBorder: palette.danger[400],
  badgeBackground: palette.danger[400],
  badgeText: palette.neutral[0],
  ratingFilled: palette.primary[500],
  ratingEmpty: '#242F44',
};
