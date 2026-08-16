/**
 * HINCH MART Shadow System
 * Platform-specific shadow presets
 */
import { Platform, ViewStyle } from 'react-native';

export interface ShadowPreset {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

function createShadow(
  offsetY: number,
  blur: number,
  opacity: number,
  elevation: number,
  color = '#000000'
): ViewStyle {
  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: blur,
    },
    android: {
      elevation,
    },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: blur,
      elevation,
    },
  }) as ViewStyle;
}

export const shadows = {
  none: createShadow(0, 0, 0, 0),
  xs: createShadow(1, 2, 0.05, 1),
  sm: createShadow(1, 3, 0.08, 2),
  md: createShadow(2, 6, 0.1, 4),
  lg: createShadow(4, 10, 0.12, 8),
  xl: createShadow(8, 16, 0.15, 12),
  '2xl': createShadow(12, 24, 0.18, 16),
  inner: createShadow(0, 0, 0, 0), // Handled via background color

  // Branded shadows
  primary: createShadow(4, 12, 0.25, 8, '#FDB913'),
  navy: createShadow(4, 12, 0.3, 8, '#152238'),
  card: createShadow(2, 8, 0.06, 3),
  button: createShadow(2, 4, 0.15, 3),
  modal: createShadow(8, 24, 0.2, 16),
  bottomSheet: createShadow(-4, 16, 0.1, 12),
  header: createShadow(2, 4, 0.08, 3),
  tabBar: createShadow(-2, 8, 0.06, 8),
} as const;

export type Shadow = keyof typeof shadows;
export type ShadowMap = typeof shadows;
