/**
 * HINCH MART — Feedback Components (Skeleton, EmptyState, ErrorState, OfflineScreen)
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { Button } from '../ui/Button';

// Skeleton Loader with Shimmer
export interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonLoaderProps) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.skeleton,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

// Empty State
export interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  title,
  subtitle,
  icon,
  actionTitle,
  onAction,
  style,
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.centerContainer, style]}>
      {icon ? (
        <View style={styles.iconWrapper}>{icon}</View>
      ) : (
        <View style={[styles.defaultIcon, { backgroundColor: theme.colors.primaryLight }]}>
          <Text style={[styles.defaultIconText, { color: theme.colors.primary }]}>📦</Text>
        </View>
      )}
      <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} size="md" style={styles.actionBtn} />
      )}
    </View>
  );
}

// Error State
export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading the data.',
  onRetry,
  style,
}: ErrorStateProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.centerContainer, style]}>
      <View style={[styles.defaultIcon, { backgroundColor: theme.colors.dangerLight }]}>
        <Text style={{ fontSize: 32 }}>⚠️</Text>
      </View>
      <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>{message}</Text>
      {onRetry && <Button title="Try Again" onPress={onRetry} variant="navy" size="md" style={styles.actionBtn} />}
    </View>
  );
}

// Offline Screen
export interface OfflineScreenProps {
  onRetry?: () => void;
}

export function OfflineScreen({ onRetry }: OfflineScreenProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.centerContainer, { backgroundColor: theme.colors.background, flex: 1 }]}>
      <View style={[styles.defaultIcon, { backgroundColor: theme.colors.warningLight, width: 80, height: 80, borderRadius: 40 }]}>
        <Text style={{ fontSize: 40 }}>📡</Text>
      </View>
      <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary, fontSize: 20 }]}>
        No Internet Connection
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Please check your Wi-Fi or cellular network connection and try again.
      </Text>
      {onRetry && <Button title="Retry Connection" onPress={onRetry} variant="primary" size="lg" style={styles.actionBtn} />}
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    width: '100%',
  },
  iconWrapper: {
    marginBottom: 16,
  },
  defaultIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  defaultIconText: {
    fontSize: 28,
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionBtn: {
    marginTop: 8,
    minWidth: 160,
  },
});
