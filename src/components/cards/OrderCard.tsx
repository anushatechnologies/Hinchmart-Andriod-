/**
 * HINCH MART — OrderCard Component
 * Reusable card for Order History and Order Status displays
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { Order } from '../../types/order.types';
import { formatPrice } from '../../utils';

export interface OrderCardProps {
  order: Order;
  onPress: () => void;
  onTrackPress?: () => void;
  style?: ViewStyle;
}

export function OrderCard({ order, onPress, onTrackPress, style }: OrderCardProps) {
  const { theme, isDark } = useTheme();

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const firstItem = order.items?.[0];
  const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || order.items?.length || 1;

  return (
    <Card onPress={onPress} variant="outlined" style={[styles.card, style]}>
      {/* Header with Order Number & Status */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.orderNumber, { color: theme.colors.navy }]}>
            {order.orderNumber || `#HM-${order.id.slice(0, 6).toUpperCase()}`}
          </Text>
          <Text style={[styles.orderDate, { color: theme.colors.textTertiary }]}>
            Placed on {formattedDate}
          </Text>
        </View>
        <StatusBadge status={order.status} size="sm" />
      </View>

      {/* Item summary */}
      <View style={[styles.itemSummaryRow, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={styles.thumbWrap}>
          {firstItem?.productImage ? (
            <Image
              source={{ uri: firstItem.productImage }}
              style={styles.thumbImg}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.thumbPlaceholder, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Ionicons name="cube" size={24} color={theme.colors.navy} />
            </View>
          )}
        </View>

        <View style={styles.itemInfo}>
          <Text numberOfLines={1} style={[styles.itemName, { color: theme.colors.textPrimary }]}>
            {firstItem?.productName || 'Construction Materials Manifest'}
          </Text>
          <Text style={[styles.itemSub, { color: theme.colors.textSecondary }]}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
            {order.items?.length > 1 ? ` (and ${order.items.length - 1} other)` : ''}
          </Text>
          <Text style={[styles.deliveryEst, { color: theme.colors.primary }]}>
            🚚 Delivery: {order.estimatedDelivery || '3 - 5 business days'}
          </Text>
        </View>
      </View>

      {/* Total & Action row */}
      <View style={styles.footerRow}>
        <View>
          <Text style={[styles.totalLabel, { color: theme.colors.textTertiary }]}>
            Total Amount (incl. GST)
          </Text>
          <Text style={[styles.totalAmount, { color: theme.colors.navy }]}>
            {formatPrice(order.total, order.currency || 'INR')}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          {onTrackPress && (
            <TouchableOpacity
              onPress={onTrackPress}
              style={[styles.trackBtn, { borderColor: theme.colors.primary }]}
              activeOpacity={0.7}
            >
              <Ionicons name="navigate-outline" size={14} color={theme.colors.navy} />
              <Text style={[styles.trackBtnText, { color: theme.colors.navy }]}>Track</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onPress}
            style={[styles.detailsBtn, { backgroundColor: theme.colors.navy }]}
            activeOpacity={0.8}
          >
            <Text style={styles.detailsBtnText}>Details</Text>
            <Ionicons name="chevron-forward" size={14} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
  },
  orderDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  itemSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  thumbWrap: {
    width: 50,
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },
  itemSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    marginTop: 2,
  },
  deliveryEst: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  totalAmount: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  trackBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  detailsBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#FFF',
  },
});
