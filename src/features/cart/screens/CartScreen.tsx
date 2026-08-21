/**
 * HINCH MART — Shopping Cart Screen
 * Complete redesign with individual item selection, Select All,
 * MOQ enforcement, coupon engine, dynamic GST & freight calculations,
 * move-to-wishlist, and sticky checkout action.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Stepper } from '../../../components/ui/Rating';
import { formatPrice } from '../../../utils';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  selectCartItems,
  selectSelectedCartItems,
  selectSelectedSubtotal,
  selectSelectedCount,
  selectAppliedCoupon,
  selectShippingCost,
  selectCartTax,
  selectCartGrandTotal,
  updateItemQuantity,
  toggleSelectItem,
  selectAllItems,
  removeItem,
  clearCart,
  setCoupon,
  removeCoupon,
} from '../../../redux/slices/cartSlice';
import { toggleWishlist } from '../../../redux/slices/wishlistSlice';

export function CartScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(selectCartItems);
  const selectedItems = useAppSelector(selectSelectedCartItems);
  const selectedCount = useAppSelector(selectSelectedCount);
  const selectedSubtotal = useAppSelector(selectSelectedSubtotal);
  const appliedCoupon = useAppSelector(selectAppliedCoupon);
  const shippingCost = useAppSelector(selectShippingCost);
  const tax = useAppSelector(selectCartTax);
  const grandTotal = useAppSelector(selectCartGrandTotal);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const allSelected = cartItems.length > 0 && cartItems.every((item) => item.selected !== false);

  const handleToggleSelectAll = () => {
    dispatch(selectAllItems(!allSelected));
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    setCouponError('');
    setCouponSuccess('');

    if (!code) {
      setCouponError('Please enter a valid coupon code.');
      return;
    }

    if (code === 'BUILD10') {
      const discount = Math.round(selectedSubtotal * 0.1);
      dispatch(setCoupon({ code, discount }));
      setCouponSuccess('Coupon BUILD10 applied! (10% Off)');
      setCouponInput('');
    } else if (code === 'HINCH200' && selectedSubtotal >= 2000) {
      dispatch(setCoupon({ code, discount: 200 }));
      setCouponSuccess('Coupon HINCH200 applied! (₹200 Off)');
      setCouponInput('');
    } else if (code === 'FREESHIP') {
      dispatch(setCoupon({ code, discount: shippingCost }));
      setCouponSuccess('Coupon FREESHIP applied! (Free Delivery)');
      setCouponInput('');
    } else {
      setCouponError('Invalid or expired coupon. Try BUILD10 or HINCH200.');
    }
  };

  const handleMoveToWishlist = (item: any) => {
    dispatch(toggleWishlist(item.productId));
    dispatch(removeItem(item.id));
  };

  const handleClearCartPrompt = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your shopping cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => dispatch(clearCart()) },
      ]
    );
  };

  if (cartItems.length === 0) {
    return (
      <Screen scrollable>
        <Header title="Shopping Cart" showBack={false} showCart={false} />

        <View style={styles.emptyContainer}>
          {/* Animated Glow Circle */}
          <View style={[styles.emptyGlowCircle, { backgroundColor: `${theme.colors.primary}18` }]}>
            <LinearGradient
              colors={['#FFD034', '#FDB913']}
              style={styles.emptyGradientCircle}
            >
              <Ionicons name="cart" size={44} color="#152238" />
            </LinearGradient>
          </View>

          <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
            Your Cart is Empty
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            Explore thousands of verified construction materials, structural steel, cement bags, and tools.
          </Text>

          {/* B2B Value Highlights */}
          <View style={styles.b2bHighlightsWrap}>
            {[
              { icon: 'pricetag', title: 'Wholesale B2B Pricing', sub: 'Unlock tier discounts on bulk orders' },
              { icon: 'document-text', title: 'GST & Tax Invoices', sub: 'Instant enterprise tax invoices generated' },
              { icon: 'bus', title: 'Direct Site Freight Logistics', sub: 'Truckload delivery directly to project sites' },
            ].map((feature, idx) => (
              <View
                key={idx}
                style={[
                  styles.b2bFeatureRow,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <View style={[styles.b2bIconWrap, { backgroundColor: `${theme.colors.primary}20` }]}>
                  <Ionicons name={feature.icon as any} size={18} color={theme.colors.navy} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.b2bFeatureTitle, { color: theme.colors.textPrimary }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.b2bFeatureSub, { color: theme.colors.textTertiary }]}>
                    {feature.sub}
                  </Text>
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
              style={styles.exploreBtn}
            >
              <Text style={styles.exploreBtnText}>Start Shopping</Text>
              <Ionicons name="arrow-forward" size={18} color="#152238" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable={false}>
      <Header
        title="Shopping Cart"
        showBack={false}
        showCart={false}
        rightComponent={
          <TouchableOpacity onPress={handleClearCartPrompt} style={styles.clearHeaderBtn}>
            <Text style={[styles.clearHeaderText, { color: theme.colors.danger }]}>
              Clear
            </Text>
          </TouchableOpacity>
        }
      />

      {/* Select All Row */}
      <View style={[styles.selectAllBar, { backgroundColor: theme.colors.surfaceVariant, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          onPress={handleToggleSelectAll}
          style={styles.selectAllLeft}
          activeOpacity={0.7}
        >
          <Ionicons
            name={allSelected ? 'checkbox' : 'square-outline'}
            size={20}
            color={allSelected ? theme.colors.primary : theme.colors.textTertiary}
          />
          <Text style={[styles.selectAllText, { color: theme.colors.textPrimary }]}>
            Select All ({cartItems.length} items)
          </Text>
        </TouchableOpacity>

        <Text style={[styles.selectedCountText, { color: theme.colors.textSecondary }]}>
          {selectedCount} selected for checkout
        </Text>
      </View>

      <FlatList
        data={cartItems}
        contentContainerStyle={styles.listPadding}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = item.selected !== false;
          const minQty = item.product?.minOrderQuantity || 1;
          const hasMoqViolation = item.quantity < minQty;

          return (
            <Card
              variant="outlined"
              style={[
                styles.itemCard,
                isSelected && { borderColor: theme.colors.border },
                !isSelected && { opacity: 0.65 },
              ]}
            >
              <View style={styles.itemHeaderRow}>
                {/* Checkbox */}
                <TouchableOpacity
                  onPress={() => dispatch(toggleSelectItem(item.id))}
                  style={styles.checkboxTouch}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isSelected ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={isSelected ? theme.colors.primary : theme.colors.textTertiary}
                  />
                </TouchableOpacity>

                {/* Product Image */}
                <View style={styles.itemImgWrap}>
                  <Image
                    source={{ uri: item.product.images[0]?.url }}
                    style={styles.itemImg}
                    contentFit="cover"
                  />
                </View>

                {/* Product Info */}
                <View style={styles.itemInfoWrap}>
                  <View style={styles.brandRow}>
                    <Text style={[styles.brandText, { color: theme.colors.textTertiary }]}>
                      {item.product.brand?.name || 'CONSTRUCTION'}
                    </Text>
                    {item.product.vendor?.isVerified && (
                      <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                    )}
                  </View>

                  <Text
                    numberOfLines={2}
                    style={[styles.itemName, { color: theme.colors.textPrimary }]}
                  >
                    {item.product.name}
                  </Text>

                  {item.variant && (
                    <Text style={[styles.variantBadge, { color: theme.colors.primary }]}>
                      Spec: {item.variant.name}
                    </Text>
                  )}

                  <View style={styles.priceRow}>
                    <Text style={[styles.unitPrice, { color: theme.colors.navy }]}>
                      {formatPrice(item.unitPrice)} / {item.product.unit || 'Unit'}
                    </Text>
                    {item.product.price.compareAtPrice && (
                      <Text style={[styles.comparePrice, { color: theme.colors.textDisabled }]}>
                        {formatPrice(item.product.price.compareAtPrice)}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* MOQ Violation Alert */}
              {hasMoqViolation && (
                <View style={styles.moqAlertRow}>
                  <Ionicons name="warning" size={13} color="#D97706" />
                  <Text style={styles.moqAlertText}>
                    Minimum order requirement: {minQty} {item.product.unit || 'units'}
                  </Text>
                </View>
              )}

              {/* Bottom Actions Row */}
              <View style={[styles.itemFooterRow, { borderTopColor: theme.colors.border }]}>
                <View style={styles.stepperWrap}>
                  <Stepper
                    value={item.quantity}
                    onValueChange={(val) =>
                      dispatch(updateItemQuantity({ id: item.id, quantity: val }))
                    }
                    min={minQty}
                    max={item.product.maxOrderQuantity || 5000}
                  />
                  <Text style={[styles.subtotalText, { color: theme.colors.navy }]}>
                    Subtotal: {formatPrice(item.totalPrice)}
                  </Text>
                </View>

                <View style={styles.itemActionButtons}>
                  <TouchableOpacity
                    onPress={() => handleMoveToWishlist(item)}
                    style={styles.actionPill}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="heart-outline" size={16} color={theme.colors.textSecondary} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => dispatch(removeItem(item.id))}
                    style={[styles.actionPill, { backgroundColor: `${theme.colors.danger}12` }]}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          );
        }}
        ListFooterComponent={
          <View style={styles.footerWrap}>
            {/* 1. Coupon Section */}
            <Card variant="outlined" style={styles.couponCard}>
              <View style={styles.couponTitleRow}>
                <Ionicons name="pricetag" size={16} color={theme.colors.navy} />
                <Text style={[styles.couponHeading, { color: theme.colors.navy }]}>
                  Apply Discount Coupon
                </Text>
              </View>

              {appliedCoupon.code ? (
                <View style={styles.appliedCouponRow}>
                  <View style={styles.appliedCouponTag}>
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                    <Text style={styles.appliedCouponCode}>{appliedCoupon.code}</Text>
                    <Text style={styles.appliedCouponDiscount}>
                      (-{formatPrice(appliedCoupon.discount)})
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => dispatch(removeCoupon())}
                    style={styles.removeCouponBtn}
                  >
                    <Text style={[styles.removeCouponText, { color: theme.colors.danger }]}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.couponInputRow}>
                  <TextInput
                    value={couponInput}
                    onChangeText={setCouponInput}
                    placeholder="Enter Code (e.g. BUILD10)"
                    autoCapitalize="characters"
                    style={[
                      styles.couponInput,
                      {
                        backgroundColor: theme.colors.surfaceVariant,
                        color: theme.colors.textPrimary,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  />
                  <TouchableOpacity
                    onPress={handleApplyCoupon}
                    style={[styles.applyCouponBtn, { backgroundColor: theme.colors.navy }]}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.applyCouponText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              )}

              {couponError ? (
                <Text style={styles.couponErrorText}>{couponError}</Text>
              ) : couponSuccess ? (
                <Text style={styles.couponSuccessText}>{couponSuccess}</Text>
              ) : null}
            </Card>

            {/* 2. Delivery Destination Card */}
            <Card variant="outlined" style={styles.deliveryEstimateCard}>
              <View style={styles.deliveryEstimateHeader}>
                <Ionicons name="navigate-outline" size={16} color={theme.colors.navy} />
                <Text style={[styles.deliveryEstimateTitle, { color: theme.colors.navy }]}>
                  Delivering to Project Site
                </Text>
              </View>
              <Text style={[styles.deliveryEstimateSub, { color: theme.colors.textSecondary }]}>
                Plot 405, Industrial Zone 3, Hyderabad, Telangana (500001)
              </Text>
              <Text style={[styles.deliveryDate, { color: theme.colors.primary }]}>
                🚚 Estimated Freight Arrival: 2 - 3 business days
              </Text>
            </Card>

            {/* 3. Detailed Price Summary */}
            <Card variant="outlined" style={styles.summaryCard}>
              <Text style={[styles.summaryTitle, { color: theme.colors.navy }]}>
                Price Details ({selectedCount} items)
              </Text>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Selected Items Subtotal
                </Text>
                <Text style={[styles.summaryVal, { color: theme.colors.textPrimary }]}>
                  {formatPrice(selectedSubtotal)}
                </Text>
              </View>

              {appliedCoupon.discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.success }]}>
                    Coupon Discount ({appliedCoupon.code})
                  </Text>
                  <Text style={[styles.summaryVal, { color: theme.colors.success }]}>
                    -{formatPrice(appliedCoupon.discount)}
                  </Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Site Freight / Logistics Charge
                </Text>
                <Text style={[styles.summaryVal, { color: theme.colors.textPrimary }]}>
                  {shippingCost > 0 ? formatPrice(shippingCost) : 'FREE'}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Estimated GST (18% B2B Tax)
                </Text>
                <Text style={[styles.summaryVal, { color: theme.colors.textPrimary }]}>
                  {formatPrice(tax)}
                </Text>
              </View>

              <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />

              <View style={styles.grandTotalRow}>
                <View>
                  <Text style={[styles.grandTotalLabel, { color: theme.colors.navy }]}>
                    Total Amount
                  </Text>
                  <Text style={[styles.gstInclusiveText, { color: theme.colors.textTertiary }]}>
                    GST & Freight Included
                  </Text>
                </View>
                <Text style={[styles.grandTotalVal, { color: theme.colors.navy }]}>
                  {formatPrice(grandTotal)}
                </Text>
              </View>
            </Card>

            <View style={{ height: 100 }} />
          </View>
        }
      />

      {/* Sticky Bottom Action */}
      <View
        style={[
          styles.stickyBottomBar,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.bottomTotalLeft}>
          <Text style={[styles.bottomLabel, { color: theme.colors.textTertiary }]}>
            Total ({selectedCount} items)
          </Text>
          <Text style={[styles.bottomAmount, { color: theme.colors.navy }]}>
            {formatPrice(grandTotal)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('CheckoutAddress')}
          disabled={selectedCount === 0}
          style={[styles.checkoutBtn, selectedCount === 0 && { opacity: 0.5 }]}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#FDB913', '#F9A825']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkoutGradient}
          >
            <Ionicons name="shield-checkmark" size={18} color="#152238" />
            <Text style={styles.checkoutText}>
              {selectedCount === 0 ? 'Select Items' : 'Proceed to Checkout'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#152238" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 520,
  },
  emptyGlowCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyGradientCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13.5,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 300,
    lineHeight: 19,
  },
  b2bHighlightsWrap: {
    width: '100%',
    marginVertical: 24,
    gap: 10,
  },
  b2bFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  b2bIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  b2bFeatureTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },
  b2bFeatureSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 1,
  },
  exploreBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  exploreBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#152238',
  },
  clearHeaderBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearHeaderText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  selectAllBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  selectAllLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectAllText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },
  selectedCountText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
  },
  listPadding: {
    padding: 16,
    paddingBottom: 24,
  },
  itemCard: {
    marginBottom: 14,
    borderRadius: 16,
    padding: 12,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxTouch: {
    paddingTop: 4,
    marginRight: 8,
  },
  itemImgWrap: {
    width: 75,
    height: 75,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  itemImg: {
    width: '100%',
    height: '100%',
  },
  itemInfoWrap: {
    flex: 1,
    marginLeft: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.4,
  },
  itemName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13.5,
    lineHeight: 18,
    marginVertical: 2,
  },
  variantBadge: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  unitPrice: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },
  comparePrice: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  moqAlertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
    marginTop: 8,
  },
  moqAlertText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#B45309',
  },
  itemFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 10,
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subtotalText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
  },
  itemActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionPill: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  footerWrap: {
    marginTop: 8,
    gap: 12,
  },
  couponCard: {
    padding: 14,
    borderRadius: 16,
  },
  couponTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  couponHeading: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  applyCouponBtn: {
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyCouponText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  appliedCouponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  appliedCouponTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appliedCouponCode: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    color: '#10B981',
  },
  appliedCouponDiscount: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#10B981',
  },
  removeCouponBtn: {
    paddingHorizontal: 6,
  },
  removeCouponText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  couponErrorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: '#EF4444',
    marginTop: 6,
  },
  couponSuccessText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#10B981',
    marginTop: 6,
  },
  deliveryEstimateCard: {
    padding: 14,
    borderRadius: 16,
  },
  deliveryEstimateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  deliveryEstimateTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13.5,
  },
  deliveryEstimateSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  deliveryDate: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    marginTop: 4,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 16,
  },
  summaryTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  summaryVal: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  summaryDivider: {
    height: 1,
    marginVertical: 10,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  grandTotalLabel: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  gstInclusiveText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10.5,
  },
  grandTotalVal: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 20,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 12 },
    }),
  },
  bottomTotalLeft: {
    marginRight: 12,
  },
  bottomLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  bottomAmount: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 19,
  },
  checkoutBtn: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  checkoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  checkoutText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14.5,
    color: '#152238',
  },
});
