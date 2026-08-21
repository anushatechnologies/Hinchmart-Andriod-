/**
 * HINCH MART — Checkout Review & Order Placement Screen (Step 4 of 4)
 * Final manifest verification, terms acceptance, idempotent order placement,
 * and seamless transition to Order Success & Live Tracking.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatPrice } from '../../../utils';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  selectSelectedCartItems,
  selectSelectedSubtotal,
  selectAppliedCoupon,
  selectShippingCost,
  selectCartTax,
  selectCartGrandTotal,
  clearCart,
} from '../../../redux/slices/cartSlice';
import { INITIAL_SAVED_ADDRESSES } from './CheckoutAddressScreen';

export function CheckoutReviewScreen({ route, navigation }: any) {
  const { theme, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const {
    addressId = 'addr_1',
    deliveryMethodId = 'std_freight',
    paymentMethod = 'upi',
    deliveryCharge = 150,
  } = route?.params ?? {};

  const selectedItems = useAppSelector(selectSelectedCartItems);
  const subtotal = useAppSelector(selectSelectedSubtotal);
  const appliedCoupon = useAppSelector(selectAppliedCoupon);
  const tax = useAppSelector(selectCartTax);
  const grandTotal = useAppSelector(selectCartGrandTotal);

  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const targetAddress =
    INITIAL_SAVED_ADDRESSES.find((a) => a.id === addressId) || INITIAL_SAVED_ADDRESSES[0];

  const handlePlaceOrder = async () => {
    if (!agreedToTerms) {
      setErrorMessage('Please agree to the Terms & Conditions to place your order.');
      return;
    }

    setIsPlacingOrder(true);
    setErrorMessage('');

    try {
      // Simulate backend ACID order placement transaction
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const generatedOrderNumber = `HM-${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedOrderId = `ord_${Date.now()}`;

      // Clear cart items
      dispatch(clearCart());

      // Navigate to Order Success
      navigation.replace('OrderSuccess', {
        orderId: generatedOrderId,
        orderNumber: generatedOrderNumber,
        estimatedDelivery: '3 - 5 Business Days',
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to place order. Please try again.');
      setIsPlacingOrder(false);
    }
  };

  return (
    <Screen scrollable>
      <Header
        title="Order Review"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Error alert if any */}
        {errorMessage ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color="#EF4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* 1. Destination Site Address */}
        <Card variant="outlined" style={styles.reviewCard}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="location" size={18} color={theme.colors.primary} />
              <Text style={[styles.cardTitle, { color: theme.colors.navy }]}>
                Delivery Site Location
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('CheckoutAddress')}
              activeOpacity={0.7}
            >
              <Text style={[styles.changeLink, { color: theme.colors.primary }]}>
                Change
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.siteName, { color: theme.colors.textPrimary }]}>
            {targetAddress.label} — {targetAddress.fullName}
          </Text>
          <Text style={[styles.siteAddress, { color: theme.colors.textSecondary }]}>
            {targetAddress.addressLine1}, {targetAddress.city}, {targetAddress.state} ({targetAddress.postalCode})
          </Text>
          <Text style={[styles.sitePhone, { color: theme.colors.textTertiary }]}>
            📞 {targetAddress.phone}
          </Text>
        </Card>

        {/* 2. Order Manifest Items */}
        <Card variant="outlined" style={styles.reviewCard}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="cube" size={18} color={theme.colors.primary} />
              <Text style={[styles.cardTitle, { color: theme.colors.navy }]}>
                Material Manifest ({selectedItems.length} items)
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('MainTabs', { screen: 'CartTab' })}
              activeOpacity={0.7}
            >
              <Text style={[styles.changeLink, { color: theme.colors.primary }]}>
                Edit Cart
              </Text>
            </TouchableOpacity>
          </View>

          {selectedItems.map((item, idx) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                idx > 0 && { borderTopWidth: 1, borderTopColor: theme.colors.border },
              ]}
            >
              <View style={styles.thumbWrap}>
                <Image
                  source={{ uri: item.product.images[0]?.url }}
                  style={styles.thumbImg}
                  contentFit="cover"
                />
              </View>
              <View style={styles.itemInfo}>
                <Text numberOfLines={1} style={[styles.itemName, { color: theme.colors.textPrimary }]}>
                  {item.product.name}
                </Text>
                <Text style={[styles.itemQtyUnit, { color: theme.colors.textSecondary }]}>
                  Quantity: {item.quantity} {item.product.unit || 'unit'}s × {formatPrice(item.unitPrice)}
                </Text>
              </View>
              <Text style={[styles.itemTotal, { color: theme.colors.navy }]}>
                {formatPrice(item.totalPrice)}
              </Text>
            </View>
          ))}
        </Card>

        {/* 3. Logistics & Payment Summary */}
        <Card variant="outlined" style={styles.reviewCard}>
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={[styles.metaLabel, { color: theme.colors.textTertiary }]}>
                Logistics & Freight
              </Text>
              <Text style={[styles.metaVal, { color: theme.colors.textPrimary }]}>
                {deliveryMethodId === 'express_24h'
                  ? 'Express 24H Site Dispatch'
                  : deliveryMethodId === 'heavy_truck'
                  ? 'Heavy Dedicated Trailer'
                  : 'Standard Site Freight'}
              </Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={[styles.metaLabel, { color: theme.colors.textTertiary }]}>
                Payment Mode
              </Text>
              <Text style={[styles.metaVal, { color: theme.colors.textPrimary }]}>
                {paymentMethod === 'upi'
                  ? 'UPI / QR Instant'
                  : paymentMethod === 'wallet'
                  ? 'Business Credit Line'
                  : paymentMethod === 'card'
                  ? 'Commercial Card'
                  : paymentMethod === 'escrow'
                  ? 'Escrow Protected'
                  : 'Pay on Delivery'}
              </Text>
            </View>
          </View>
        </Card>

        {/* 4. Price Breakdown */}
        <Card variant="outlined" style={styles.reviewCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.navy, marginBottom: 12 }]}>
            Final Invoice Calculation
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
              Items Subtotal
            </Text>
            <Text style={[styles.priceVal, { color: theme.colors.textPrimary }]}>
              {formatPrice(subtotal)}
            </Text>
          </View>

          {appliedCoupon.discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: theme.colors.success }]}>
                Coupon Discount ({appliedCoupon.code})
              </Text>
              <Text style={[styles.priceVal, { color: theme.colors.success }]}>
                -{formatPrice(appliedCoupon.discount)}
              </Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
              Site Freight / Delivery
            </Text>
            <Text style={[styles.priceVal, { color: theme.colors.textPrimary }]}>
              {formatPrice(deliveryCharge)}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
              GST 18% (Tax Invoice Breakdown)
            </Text>
            <Text style={[styles.priceVal, { color: theme.colors.textPrimary }]}>
              {formatPrice(tax)}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.grandTotalRow}>
            <View>
              <Text style={[styles.grandTotalLabel, { color: theme.colors.navy }]}>
                Total Order Amount
              </Text>
              <Text style={[styles.grandTotalSub, { color: theme.colors.textTertiary }]}>
                Includes Freight + 18% GST
              </Text>
            </View>
            <Text style={[styles.grandTotalVal, { color: theme.colors.navy }]}>
              {formatPrice(grandTotal)}
            </Text>
          </View>
        </Card>

        {/* Terms Checkbox */}
        <TouchableOpacity
          onPress={() => setAgreedToTerms(!agreedToTerms)}
          style={styles.termsRow}
          activeOpacity={0.8}
        >
          <Ionicons
            name={agreedToTerms ? 'checkbox' : 'square-outline'}
            size={22}
            color={agreedToTerms ? theme.colors.primary : theme.colors.textTertiary}
          />
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            I confirm the material specifications and agree to HINCH MART B2B Terms of Procurement.
          </Text>
        </TouchableOpacity>

        {/* Place Order CTA */}
        <Button
          title={isPlacingOrder ? 'Confirming & Authorizing Order...' : 'Place Order Now'}
          onPress={handlePlaceOrder}
          isLoading={isPlacingOrder}
          disabled={isPlacingOrder || selectedItems.length === 0}
          size="lg"
          variant="primary"
          style={styles.placeOrderBtn}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 10,
    gap: 8,
    marginBottom: 14,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12.5,
    color: '#EF4444',
    flex: 1,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14.5,
  },
  changeLink: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12.5,
  },
  siteName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13.5,
  },
  siteAddress: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
    marginTop: 2,
    lineHeight: 17,
  },
  sitePhone: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  thumbWrap: {
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
  },
  itemQtyUnit: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    marginTop: 2,
  },
  itemTotal: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 13.5,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginBottom: 2,
  },
  metaVal: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  priceLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  priceVal: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grandTotalLabel: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
  },
  grandTotalSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  grandTotalVal: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 19,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  termsText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  placeOrderBtn: {
    marginTop: 8,
  },
});
