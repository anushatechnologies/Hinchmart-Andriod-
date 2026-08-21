/**
 * HINCH MART — Order Detail Screen
 * Full manifest, tax invoice PDF download, seller contact, and live tracking actions.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { formatPrice } from '../../../utils';
import { MOCK_ORDERS } from './OrderHistoryScreen';

export function OrderDetailScreen({ route, navigation }: any) {
  const { theme, isDark } = useTheme();
  const { orderId = 'ord_1' } = route?.params ?? {};

  const order = MOCK_ORDERS.find((o) => o.id === orderId) || MOCK_ORDERS[0];

  const handleDownloadInvoice = () => {
    Alert.alert(
      'Tax Invoice Download',
      `Downloading GST Invoice #${order.invoice?.invoiceNumber || 'TAX-INV-88412'} (PDF)`,
      [{ text: 'OK' }]
    );
  };

  const handleReorder = () => {
    Alert.alert(
      'Reorder Materials',
      'Add all items from this order directly into your current shopping cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add to Cart',
          onPress: () => {
            navigation.navigate('MainTabs', { screen: 'CartTab' });
          },
        },
      ]
    );
  };

  return (
    <Screen scrollable>
      <Header
        title="Order Details"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Top Header Card */}
        <Card variant="outlined" style={styles.detailCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.orderNumber, { color: theme.colors.navy }]}>
                {order.orderNumber}
              </Text>
              <Text style={[styles.orderDate, { color: theme.colors.textTertiary }]}>
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
            </View>
            <StatusBadge status={order.status} size="md" />
          </View>

          {/* Quick Track Bar */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('OrderTracking', {
                orderId: order.id,
                orderNumber: order.orderNumber,
              })
            }
            style={[styles.quickTrackRow, { backgroundColor: `${theme.colors.primary}18` }]}
            activeOpacity={0.8}
          >
            <View style={styles.quickTrackLeft}>
              <Ionicons name="bus" size={18} color={theme.colors.navy} />
              <Text style={[styles.quickTrackText, { color: theme.colors.navy }]}>
                Track Live Freight Status
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.navy} />
          </TouchableOpacity>
        </Card>

        {/* Material Manifest */}
        <Card variant="outlined" style={styles.detailCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.navy }]}>
            Ordered Items ({order.items.length})
          </Text>

          {order.items.map((item, idx) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                idx > 0 && { borderTopWidth: 1, borderTopColor: theme.colors.border },
              ]}
            >
              <View style={styles.thumbWrap}>
                <Image source={{ uri: item.productImage }} style={styles.thumbImg} contentFit="cover" />
              </View>
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: theme.colors.textPrimary }]}>
                  {item.productName}
                </Text>
                <Text style={[styles.itemQtyPrice, { color: theme.colors.textSecondary }]}>
                  {item.quantity} Units × {formatPrice(item.unitPrice, order.currency)}
                </Text>
              </View>
              <Text style={[styles.itemSubtotal, { color: theme.colors.navy }]}>
                {formatPrice(item.totalPrice, order.currency)}
              </Text>
            </View>
          ))}
        </Card>

        {/* Delivery Site Information */}
        <Card variant="outlined" style={styles.detailCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.navy }]}>
            Project Site Delivery Address
          </Text>
          <Text style={[styles.addrName, { color: theme.colors.textPrimary }]}>
            {order.shippingAddress.label} — {order.shippingAddress.fullName}
          </Text>
          <Text style={[styles.addrLine, { color: theme.colors.textSecondary }]}>
            {order.shippingAddress.addressLine1}
          </Text>
          <Text style={[styles.addrLine, { color: theme.colors.textSecondary }]}>
            {order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.postalCode})
          </Text>
          <Text style={[styles.addrPhone, { color: theme.colors.textTertiary }]}>
            📞 {order.shippingAddress.phone}
          </Text>
        </Card>

        {/* Price Breakdown */}
        <Card variant="outlined" style={styles.detailCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.navy }]}>
            Invoice Breakdown
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Subtotal</Text>
            <Text style={[styles.priceVal, { color: theme.colors.textPrimary }]}>{formatPrice(order.subtotal, order.currency)}</Text>
          </View>

          {order.discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: theme.colors.success }]}>Discount</Text>
              <Text style={[styles.priceVal, { color: theme.colors.success }]}>-{formatPrice(order.discount, order.currency)}</Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Freight & Logistics</Text>
            <Text style={[styles.priceVal, { color: theme.colors.textPrimary }]}>{formatPrice(order.shippingCost, order.currency)}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>GST 18%</Text>
            <Text style={[styles.priceVal, { color: theme.colors.textPrimary }]}>{formatPrice(order.tax, order.currency)}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.grandTotalRow}>
            <Text style={[styles.grandTotalLabel, { color: theme.colors.navy }]}>Grand Total</Text>
            <Text style={[styles.grandTotalVal, { color: theme.colors.navy }]}>{formatPrice(order.total, order.currency)}</Text>
          </View>
        </Card>

        {/* Invoice & Actions Group */}
        <View style={styles.actionsWrap}>
          <Button
            title="📄 Download Tax Invoice (PDF)"
            onPress={handleDownloadInvoice}
            size="lg"
            variant="navy"
            style={{ marginBottom: 10 }}
          />

          <Button
            title="Reorder Materials"
            onPress={handleReorder}
            size="lg"
            variant="outline"
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  detailCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
  orderDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  quickTrackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  quickTrackLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickTrackText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },
  cardTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  thumbWrap: {
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },
  itemQtyPrice: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  itemSubtotal: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },
  addrName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13.5,
  },
  addrLine: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
    marginTop: 2,
    lineHeight: 17,
  },
  addrPhone: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginTop: 4,
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
  grandTotalVal: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 18,
  },
  actionsWrap: {
    marginTop: 6,
  },
});
