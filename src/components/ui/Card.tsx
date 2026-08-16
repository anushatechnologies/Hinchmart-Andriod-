/**
 * HINCH MART — Premium Card Component
 * Enhanced with glassmorphic variant, refined shadows, and smooth press animations
 */
import React from 'react';
import { TouchableOpacity, View, ViewStyle, StyleSheet, StyleProp, Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme, Shadow } from '../../theme';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled' | 'glassmorphic';
  shadowPreset?: Shadow;
  style?: StyleProp<ViewStyle>;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function Card({
  children,
  onPress,
  variant = 'elevated',
  shadowPreset = 'card',
  style,
}: CardProps) {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.975, { damping: 18, stiffness: 280 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 18, stiffness: 280 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.cardBackground,
          ...theme.shadows[shadowPreset],
          ...(Platform.OS === 'android' ? { elevation: 3 } : {}),
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.cardBackground,
          borderWidth: 1,
          borderColor: theme.colors.cardBorder,
        };
      case 'filled':
        return {
          backgroundColor: theme.colors.surfaceVariant,
        };
      case 'glassmorphic':
        return {
          backgroundColor: isDark ? 'rgba(22, 27, 34, 0.75)' : 'rgba(255, 255, 255, 0.82)',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(255, 255, 255, 0.6)',
          ...(Platform.OS === 'ios'
            ? {
                shadowColor: isDark ? '#000' : '#0F172A',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: isDark ? 0.3 : 0.08,
                shadowRadius: 16,
              }
            : { elevation: 4 }),
        };
    }
  };

  if (onPress) {
    return (
      <AnimatedTouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[styles.base, getVariantStyle(), animatedStyle, style]}
      >
        {children}
      </AnimatedTouchableOpacity>
    );
  }

  return <View style={[styles.base, getVariantStyle(), style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 16,
  },
});
