/**
 * HINCH MART — Premium Shopping Cart Screen
 * Enhanced with Ionicon trash, gradient summary header, gold checkout button
 */
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Stepper } from '../../../components/ui/Rating';
import { EmptyState } from '../../../components/feedback/SkeletonLoader';
import { formatPrice } from '../../../utils';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  selectCartItems,
  selectCartSubtotal,
  updateItemQuantity,
  removeItem,
} from '../../../redux/slices/cartSlice';

export function CartScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);

  const shippingCost = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <Screen scrollable={true}>
        <Header title="My Cart" showBack={false} showCart={false} />
        
        <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center', minHeight: 480 }}>
          {/* Animated/Glow Icon Circle */}
          <View style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: `${theme.colors.primary}18`, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <LinearGradient
              colors={['#FFD034', '#FDB913']}
              style={{ width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="cart" size={40} color="#152238" />
            </LinearGradient>
          </View>

          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 22, color: theme.colors.textPrimary, textAlign: 'center' }}>
            Your Cart is Empty
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 6, maxWidth: 280 }}>
            Explore millions of certified construction materials, heavy machinery, and tools.
          </Text>

          {/* B2B Value Highlights */}
          <View style={{ width: '100%', marginVertical: 24, gap: 10 }}>
            {[
              { icon: 'pricetag', title: 'Wholesale B2B Pricing', sub: 'Unlock tier discounts on bulk orders' },
              { icon: 'document-text', title: 'GST & Tax Invoices', sub: 'Instant enterprise tax invoices generated' },
              { icon: 'bus', title: 'Site Freight Logistics', sub: 'Direct delivery to construction project sites' },
            ].map((feature, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, backgroundColor: theme.colors.surfaceVariant, borderWidth: 0.5, borderColor: theme.colors.border }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${theme.colors.primary}20`, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name={feature.icon as any} size={18} color={theme.colors.navy} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: theme.colors.textPrimary }}>{feature.title}</Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: theme.colors.textTertiary }}>{feature.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('HomeTab')}
            activeOpacity={0.85}
            style={{ width: '100%' }}
          >
            <LinearGradient
              colors={['#FDB913', '#F9A825']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ paddingVertical: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
            >
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#152238' }}>Explore Products</Text>
              <Ionicons name="arrow-forward" size={18} color="#152238" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable={false}>
      <Header title="My Cart" showBack={false} showCart={false} />

      <FlatList
        data={cartItems}
        contentContainerStyle={styles.listPadding}
        renderItem={({ item }) => (
          <Card variant="outlined" style={styles.cartCard}>
            <View style={styles.itemRow}>
              <View style={styles.itemImgWrap}>
                <Image
                  source={{ uri: item.product.images[0]?.url }}
                  style={styles.itemImg}
                  contentFit="cover"
                />
              </View>

              <View style={styles.itemDetails}>
                <Text
                  numberOfLines={2}
                  style={[styles.itemName, { color: theme.colors.textPrimary }]}
                >
                  {item.product.name}
                </Text>
                <Text style={[styles.itemPrice, { color: theme.colors.navy }]}>
                  {formatPrice(item.unitPrice)} / {item.product.unit}
                </Text>

                <View style={styles.stepperRow}>
                  <Stepper
                    value={item.quantity}
                    onValueChange={(val) =>
                      dispatch(updateItemQuantity({ id: item.id, quantity: val }))
                    }
                    min={1}
                  />

                  <TouchableOpacity
                    onPress={() => dispatch(removeItem(item.id))}
                    style={[styles.deleteBtn, { backgroundColor: `${theme.colors.danger}10` }]}
                    activeOpacity={0.6}
                  >
                    <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <View style={styles.summaryWrap}>
            <LinearGradient
              colors={isDark ? ['#1C2333', '#152238'] : ['#F8F9FA', '#FFFFFF']}
              style={styles.summaryCard}
            >
              {/* Header stripe */}
              <View style={[styles.summaryStripe, { backgroundColor: theme.colors.primary }]} />

              <Text style={[styles.summaryTitle, { color: theme.colors.navy }]}>
                Order Summary
              </Text>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Subtotal ({cartItems.length} items)
                </Text>
                <Text style={[styles.summaryVal, { color: theme.colors.textPrimary }]}>
                  {formatPrice(subtotal)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Estimated Freight / Shipping
                </Text>
                <Text style={[styles.summaryVal, { color: theme.colors.textPrimary }]}>
                  {formatPrice(shippingCost)}
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

              <View style={[styles.totalRow, { backgroundColor: `${theme.colors.primary}10` }]}>
                <Text style={[styles.totalLabel, { color: theme.colors.navy }]}>
                  Total Amount
                </Text>
                <Text style={[styles.totalVal, { color: theme.colors.navy }]}>
                  {formatPrice(total)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('CheckoutAddress')}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#FDB913', '#F9A825']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.checkoutBtn}
                >
                  <Ionicons name="shield-checkmark" size={18} color="#152238" />
                  <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
                  <Ionicons name="arrow-forward" size={16} color="#152238" />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listPadding: {
    padding: 16,
  },
  cartCard: {
    marginBottom: 12,
    borderRadius: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImgWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 }
      : { elevation: 1 }),
  },
  itemImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F1F3F5',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 14,
  },
  itemName: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    lineHeight: 19,
  },
  itemPrice: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    marginVertical: 4,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryWrap: {
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 }
      : { elevation: 4 }),
  },
  summaryCard: {
    padding: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  summaryStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  summaryTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  summaryLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  summaryVal: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  totalLabel: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  totalVal: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 18,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  checkoutBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: '#152238',
  },
});
