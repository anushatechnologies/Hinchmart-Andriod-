/**
 * HINCH MART — Badge, Chip & Avatar Components
 * Enhanced with icon support, outlined variant, and refined styling
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../theme';
import { getInitials } from '../../utils';

// Badge
export interface BadgeProps {
  label?: string | number;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'navy' | 'outlined';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'danger', size = 'md', icon, style }: BadgeProps) {
  const { theme } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: theme.colors.primary, text: theme.colors.navy };
      case 'success':
        return { bg: theme.colors.successLight, text: theme.colors.success };
      case 'danger':
        return { bg: theme.colors.dangerLight, text: theme.colors.danger };
      case 'warning':
        return { bg: theme.colors.warningLight, text: theme.colors.warning };
      case 'info':
        return { bg: theme.colors.infoLight, text: theme.colors.info };
      case 'navy':
        return { bg: theme.colors.navy, text: theme.colors.surface };
      case 'outlined':
        return { bg: 'transparent', text: theme.colors.textSecondary };
    }
  };

  const { bg, text } = getColors();
  const isOutlined = variant === 'outlined';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg },
        isOutlined && { borderWidth: 1, borderColor: theme.colors.border },
        size === 'sm' && styles.badgeSm,
        style,
      ]}
    >
      {icon && <View style={styles.badgeIcon}>{icon}</View>}
      {label !== undefined && (
        <Text style={[styles.badgeText, { color: text }, size === 'sm' && styles.badgeTextSm]}>
          {label}
        </Text>
      )}
    </View>
  );
}

// Chip
export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  iconLeft?: React.ReactNode;
  style?: ViewStyle;
}

export function Chip({ label, selected = false, onPress, iconLeft, style }: ChipProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primary : theme.colors.surfaceVariant,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
        },
        style,
      ]}
    >
      {iconLeft && <View style={styles.chipIcon}>{iconLeft}</View>}
      <Text
        style={[
          styles.chipText,
          { color: selected ? theme.colors.navy : theme.colors.textPrimary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// Avatar
export interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

export function Avatar({ source, name = 'User', size = 44, style }: AvatarProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.primaryLight,
        },
        style,
      ]}
    >
      {source ? (
        <Image
          source={{ uri: source }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
        />
      ) : (
        <Text style={[styles.avatarText, { color: theme.colors.primary, fontSize: size * 0.4 }]}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  badgeTextSm: {
    fontSize: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Poppins_600SemiBold',
  },
});
