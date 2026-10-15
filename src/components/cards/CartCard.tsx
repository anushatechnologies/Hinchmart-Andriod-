/**
 * HINCH MART — CartCard Component (HinchCartCard)
 * Clean, structured item card for cart and checkout flows
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { formatPrice } from '../../utils';
import { QuantitySelector } from '../ui/QuantitySelector';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export interface CartCardProps {
  id: string;
  name: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  unit?: string;
  specs?: string;
  isOutOfStock?: boolean;
  onQuantityChange: (qty: number) => void;
  onRemove: () => void;
  onPress?: () => void;
  onFindAlternatives?: () => void;
  style?: ViewStyle;
}

export function CartCard({
  name,
  image,
  unitPrice,
  quantity,
  unit = 'item',
  specs,
  isOutOfStock = false,
  onQuantityChange,
  onRemove,
  onPress,
  onFindAlternatives,
  style,
}: CartCardProps) {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (onPress) scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    if (onPress) scale.value = withSpring(1, { damping: 15 });
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const itemTotal = unitPrice * quantity;

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!onPress}
      activeOpacity={onPress ? 0.9 : 1}
      style={[styles.container, animStyle, style]}
    >
      <View
        style={[
          styles.cardInner,
          {
            backgroundColor: isOutOfStock
              ? (isDark ? '#261C1C' : '#FFF9F9')
              : (isDark ? '#1E293B' : '#FFFFFF'),
            borderColor: isOutOfStock
              ? (isDark ? '#991B1B' : '#FCA5A5')
              : (isDark ? '#334155' : '#E2E8F0'),
          },
        ]}
      >
        {/* Left: Product Thumbnail */}
        <View style={[styles.imageWrap, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={[styles.image, isOutOfStock && { opacity: 0.6 }]}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          ) : (
            <Ionicons name="cube-outline" size={28} color="#94A3B8" />
          )}
        </View>

        {/* Right: Item Details */}
        <View style={styles.detailsWrap}>
          {/* Header Row: Title & Remove Action */}
          <View style={styles.topRow}>
            <View style={{ flex: 1, marginRight: 6 }}>
              {isOutOfStock && (
                <View style={styles.oosBadge}>
                  <Ionicons name="alert-circle" size={10} color="#DC2626" />
                  <Text style={styles.oosBadgeText}>Out of Stock</Text>
                </View>
              )}
              <Text
                numberOfLines={2}
                style={[
                  styles.titleText,
                  { color: theme.colors.textPrimary },
                  isOutOfStock && { color: isDark ? '#FCA5A5' : '#991B1B' },
                ]}
              >
                {name}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onRemove}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
              style={styles.deleteBtn}
              accessibilityRole="button"
              accessibilityLabel="Remove item"
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Specs / Meta Information */}
          {specs ? (
            <Text
              numberOfLines={1}
              style={[styles.specsText, { color: theme.colors.textSecondary }]}
            >
              {specs}
            </Text>
          ) : null}

          {/* Unit Price indicator */}
          <Text style={[styles.unitPriceText, { color: theme.colors.textSecondary }]}>
            {formatPrice(unitPrice)} <Text style={{ fontSize: 10.5 }}>/ {unit}</Text>
          </Text>

          {/* Bottom Row: Quantity Stepper or Find Alternatives */}
          <View style={styles.bottomRow}>
            {isOutOfStock ? (
              <View style={styles.oosBottomRow}>
                {onFindAlternatives && (
                  <TouchableOpacity
                    onPress={onFindAlternatives}
                    style={styles.findAltBtn}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Find alternatives"
                  >
                    <Ionicons name="sparkles" size={13} color="#FFFFFF" />
                    <Text style={styles.findAltBtnText}>Find Alternatives</Text>
                  </TouchableOpacity>
                )}
                <View style={styles.totalBlock}>
                  <Text style={[styles.totalLabel, { color: '#DC2626' }]}>Unavailable</Text>
                </View>
              </View>
            ) : (
              <>
                <QuantitySelector
                  value={quantity}
                  onChange={onQuantityChange}
                  size="sm"
                />

                <View style={styles.totalBlock}>
                  <Text style={[styles.totalLabel, { color: theme.colors.textTertiary }]}>Total</Text>
                  <Text style={[styles.totalAmount, { color: theme.colors.textPrimary }]}>
                    {formatPrice(itemTotal)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </AnimatedTouchable>
  );
}

export const HinchCartCard = CartCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: '100%',
  },
  cardInner: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    overflow: 'hidden',
  },
  imageWrap: {
    width: 80,
    height: 80,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '88%',
    height: '88%',
  },
  detailsWrap: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },
  titleText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 2,
  },
  specsText: {
    fontSize: 10.5,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  unitPriceText: {
    fontSize: 11,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalBlock: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 9.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  totalAmount: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    fontWeight: '700',
  },
  oosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  oosBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#DC2626',
    textTransform: 'uppercase',
  },
  oosBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  findAltBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  findAltBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
