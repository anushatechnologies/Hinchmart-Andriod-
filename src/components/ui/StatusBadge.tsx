/**
 * HINCH MART — Status Badge Component
 * Consistent status indicators for Orders, RFQs, Payments, and Stock
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export type StatusType =
  // Order Statuses
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded'
  // RFQ Statuses
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'quoted'
  | 'approved'
  | 'rejected'
  | 'completed'
  // Payment Statuses
  | 'paid'
  | 'unpaid'
  | 'in_escrow'
  | 'failed'
  // Stock Statuses
  | 'in_stock'
  | 'low_stock'
  | 'out_of_stock';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  style?: ViewStyle;
}

export function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
  style,
}: StatusBadgeProps) {
  const { theme, isDark } = useTheme();

  const getStatusConfig = (
    val: string
  ): {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: keyof typeof Ionicons.glyphMap;
  } => {
    const normalized = val?.toLowerCase()?.replace(/\s+/g, '_') || 'pending';

    switch (normalized) {
      // Success / Delivered / Approved / Paid
      case 'delivered':
      case 'completed':
      case 'approved':
      case 'paid':
      case 'in_stock':
        return {
          label: normalized === 'in_stock' ? 'IN STOCK' : normalized.toUpperCase(),
          bg: isDark ? 'rgba(46, 125, 50, 0.2)' : 'rgba(46, 125, 50, 0.12)',
          text: isDark ? '#4ADE80' : '#1B5E20',
          border: isDark ? 'rgba(74, 222, 128, 0.3)' : 'rgba(46, 125, 50, 0.25)',
          icon: 'checkmark-circle',
        };

      // Info / Confirmed / Shipped / Out for delivery / Quoted
      case 'confirmed':
      case 'quoted':
        return {
          label: normalized === 'quoted' ? 'QUOTED' : 'CONFIRMED',
          bg: isDark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.12)',
          text: isDark ? '#60A5FA' : '#1D4ED8',
          border: isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.25)',
          icon: 'shield-checkmark',
        };

      case 'shipped':
      case 'out_for_delivery':
        return {
          label: normalized === 'out_for_delivery' ? 'OUT FOR DELIVERY' : 'SHIPPED',
          bg: isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.12)',
          text: isDark ? '#38BDF8' : '#0284C7',
          border: isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(14, 165, 233, 0.25)',
          icon: 'bus',
        };

      case 'processing':
      case 'in_review':
      case 'in_escrow':
        return {
          label: normalized === 'in_escrow' ? 'IN ESCROW' : normalized.toUpperCase(),
          bg: isDark ? 'rgba(253, 185, 19, 0.2)' : 'rgba(253, 185, 19, 0.15)',
          text: isDark ? '#FDB913' : '#B45309',
          border: isDark ? 'rgba(253, 185, 19, 0.4)' : 'rgba(253, 185, 19, 0.35)',
          icon: 'sync',
        };

      // Warning / Pending / Submitted / Low Stock
      case 'pending':
      case 'submitted':
      case 'unpaid':
      case 'low_stock':
        return {
          label: normalized === 'low_stock' ? 'LOW STOCK' : normalized.toUpperCase(),
          bg: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.12)',
          text: isDark ? '#FBBF24' : '#D97706',
          border: isDark ? 'rgba(251, 191, 36, 0.3)' : 'rgba(245, 158, 11, 0.25)',
          icon: 'time-outline',
        };

      // Danger / Cancelled / Rejected / Failed / Out of Stock
      case 'cancelled':
      case 'rejected':
      case 'failed':
      case 'out_of_stock':
      case 'returned':
        return {
          label: normalized === 'out_of_stock' ? 'OUT OF STOCK' : normalized.toUpperCase(),
          bg: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.12)',
          text: isDark ? '#F87171' : '#DC2626',
          border: isDark ? 'rgba(248, 113, 113, 0.3)' : 'rgba(239, 68, 68, 0.25)',
          icon: 'close-circle',
        };

      default:
        return {
          label: val.toUpperCase(),
          bg: theme.colors.surfaceVariant,
          text: theme.colors.textSecondary,
          border: theme.colors.border,
          icon: 'information-circle-outline',
        };
    }
  };

  const config = getStatusConfig(status);

  const paddingVertical = size === 'sm' ? 2 : size === 'lg' ? 6 : 4;
  const paddingHorizontal = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
  const fontSize = size === 'sm' ? 9.5 : size === 'lg' ? 12 : 10.5;
  const iconSize = size === 'sm' ? 10 : size === 'lg' ? 14 : 12;

  return (
    <View
      style={[
        styles.badgeContainer,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          paddingVertical,
          paddingHorizontal,
        },
        style,
      ]}
    >
      {showIcon && (
        <Ionicons
          name={config.icon}
          size={iconSize}
          color={config.text}
          style={{ marginRight: 4 }}
        />
      )}
      <Text
        style={[
          styles.badgeText,
          {
            color: config.text,
            fontSize,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.4,
  },
});
