/**
 * HINCH MART — Order History, Wallet, RFQ List & RFQ/Order Detail Screens
 */
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { OrderCard } from '../../../components/cards/VendorCard';
import { RFQCard } from '../../../components/cards/VendorCard';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Order } from '../../../types/order.types';
import { RFQ } from '../../../types/rfq.types';
import { formatPrice } from '../../../utils';

const DEMO_ORDERS: Order[] = [
  {
    id: 'o1',
    orderNumber: 'HM-994821',
    userId: 'u1',
    items: [
      { id: 'i1', productId: 'p1', productName: 'Grade 50 High-Yield Steel Rebar 12mm', productImage: '', variantId: null, variantName: null, quantity: 5, unitPrice: 850, totalPrice: 4250, sku: 'ST-12MM' },
    ],
    shippingAddress: {} as any,
    billingAddress: {} as any,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    subtotal: 4250,
    shippingCost: 150,
    tax: 0,
    discount: 0,
    walletUsed: 0,
    total: 4400,
    currency: 'USD',
    couponCode: null,
    tracking: null,
    timeline: [],
    notes: '',
    invoice: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDelivery: '2026-08-10',
  },
];

const DEMO_RFQS: RFQ[] = [
  {
    id: 'rfq1',
    rfqNumber: 'RFQ-88210',
    title: 'Procurement of 500 Tons OPC 53 Grade Cement',
    description: 'Bulk supply required for high-rise commercial project in Business Bay. Delivery to site within 15 days.',
    items: [],
    attachments: [],
    status: 'quoted',
    deadline: '2026-08-15',
    preferredVendors: [],
    quotations: [{ id: 'q1' } as any, { id: 'q2' } as any],
    approvedQuotationId: null,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function OrderHistoryScreen({ navigation }: any) {
  return (
    <Screen scrollable={false}>
      <Header title="My Orders" showBack onBackPress={() => navigation.goBack()} />
      <FlatList
        data={DEMO_ORDERS}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <OrderCard order={item} onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })} />
        )}
        keyExtractor={(item) => item.id}
      />
    </Screen>
  );
}

export function OrderDetailScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const orderId = route?.params?.orderId || 'o1';
  const order = DEMO_ORDERS.find((o) => o.id === orderId) || DEMO_ORDERS[0];

  return (
    <Screen scrollable>
      <Header title={`Order #${order.orderNumber}`} showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        <Card variant="filled" style={{ padding: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: theme.colors.textPrimary }}>
              Order Status
            </Text>
            <Badge label={order.status.toUpperCase()} variant="success" size="md" />
          </View>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: theme.colors.textSecondary }}>
            Estimated Delivery: {order.estimatedDelivery}
          </Text>
        </Card>

        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 12, color: theme.colors.textPrimary }}>
          Items Ordered
        </Text>

        {order.items.map((item) => (
          <Card key={item.id} variant="outlined" style={{ padding: 14, marginBottom: 10 }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: theme.colors.textPrimary }}>
              {item.productName}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <Text style={{ fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }}>
                Quantity: {item.quantity}
              </Text>
              <Text style={{ fontFamily: 'Poppins_700Bold', color: theme.colors.primary }}>
                ${item.totalPrice}
              </Text>
            </View>
          </Card>
        ))}

        <Card variant="filled" style={{ padding: 16, marginTop: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: theme.colors.textSecondary }}>Subtotal</Text>
            <Text style={{ color: theme.colors.textPrimary, fontFamily: 'Inter_600SemiBold' }}>${order.subtotal}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: theme.colors.textSecondary }}>Shipping</Text>
            <Text style={{ color: theme.colors.textPrimary, fontFamily: 'Inter_600SemiBold' }}>${order.shippingCost}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: theme.colors.textPrimary }}>Total</Text>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: theme.colors.primary }}>${order.total}</Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

export function WalletScreen({ navigation }: any) {
  const { theme } = useTheme();

  return (
    <Screen scrollable>
      <Header title="My Business Wallet" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        <Card variant="filled" style={{ backgroundColor: theme.colors.navy, padding: 20, marginBottom: 20 }}>
          <Text style={{ color: theme.colors.primary, fontFamily: 'Poppins_600SemiBold', fontSize: 13 }}>
            CURRENT AVAILABLE BALANCE
          </Text>
          <Text style={{ color: '#FFF', fontFamily: 'Poppins_800ExtraBold', fontSize: 32, marginVertical: 8 }}>
            $24,500.00
          </Text>
          <Text style={{ color: '#E9ECEF', fontFamily: 'Inter_400Regular', fontSize: 12 }}>
            🔒 Secured with B2B Escrow Protection
          </Text>
        </Card>

        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 12, color: theme.colors.textPrimary }}>
          Recent Transactions
        </Text>

        <Card variant="outlined" style={{ padding: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 24, marginRight: 10 }}>💵</Text>
              <View>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: theme.colors.textPrimary }}>
                  Cashback Credit
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: theme.colors.textTertiary }}>
                  Order #HM-994821
                </Text>
              </View>
            </View>

            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15, color: theme.colors.success }}>
              +$250.00
            </Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const RFQ_TABS = ['All RFQs', 'Active', 'Quoted (2)', 'Completed'];

export function RFQListScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('All RFQs');

  return (
    <Screen scrollable={false}>
      <Header title="Requests for Quotation" showBack={false} showNotification onNotificationPress={() => navigation.navigate('Notifications')} />

      {/* Top Banner Action */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('RFQCreate')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#152238', '#1F3456']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 16,
              borderRadius: 18,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Gold Accent Bar */}
            <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, backgroundColor: theme.colors.primary }} />

            <View style={{ flex: 1, paddingLeft: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <View style={{ backgroundColor: 'rgba(253, 185, 19, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 10, color: theme.colors.primary }}>FAST B2B SOURCING</Text>
                </View>
              </View>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#FFFFFF' }}>
                Need Custom Quotes?
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                Receive competitive quotes from verified suppliers in 24 hrs
              </Text>
            </View>

            <View style={{ backgroundColor: theme.colors.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, color: '#152238' }}>+ New RFQ</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginVertical: 10, gap: 8 }}>
        {RFQ_TABS.map((tab) => {
          const active = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 20,
                backgroundColor: active ? theme.colors.navy : theme.colors.surfaceVariant,
                borderWidth: 1,
                borderColor: active ? theme.colors.primary : theme.colors.border,
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontFamily: active ? 'Inter_700Bold' : 'Inter_500Medium',
                  fontSize: 12,
                  color: active ? '#FFFFFF' : theme.colors.textSecondary,
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={DEMO_RFQS}
        contentContainerStyle={{ padding: 16, paddingTop: 4 }}
        renderItem={({ item }) => (
          <RFQCard rfq={item} onPress={() => navigation.navigate('RFQDetail', { rfqId: item.id })} />
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <View style={{ marginTop: 16, padding: 16, borderRadius: 16, backgroundColor: theme.colors.surfaceVariant, borderWidth: 1, borderColor: theme.colors.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Ionicons name="sparkles" size={18} color={theme.colors.primary} />
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: theme.colors.textPrimary }}>
                How B2B RFQ Sourcing Works
              </Text>
            </View>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.colors.textSecondary, lineHeight: 18 }}>
              1. Post your exact material specifications and volume requirements.{'\n'}
              2. Verified global suppliers send official pricing proposals.{'\n'}
              3. Negotiate directly and confirm order with Escrow Protection.
            </Text>
          </View>
        }
      />
    </Screen>
  );
}

export function RFQDetailScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const rfqId = route?.params?.rfqId || 'rfq1';
  const rfq = DEMO_RFQS.find((r) => r.id === rfqId) || DEMO_RFQS[0];

  return (
    <Screen scrollable>
      <Header title={rfq.rfqNumber} showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        <Card variant="filled" style={{ padding: 16, marginBottom: 16 }}>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: theme.colors.textPrimary, marginBottom: 6 }}>
            {rfq.title}
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: theme.colors.textSecondary, marginBottom: 12 }}>
            {rfq.description}
          </Text>
          <Badge label={`STATUS: ${rfq.status.toUpperCase()}`} variant="primary" size="md" />
        </Card>

        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 12, color: theme.colors.textPrimary }}>
          Received Quotations ({rfq.quotations.length})
        </Text>

        <Card variant="outlined" style={{ padding: 16, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: theme.colors.textPrimary }}>
                Global Metals Co.
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.colors.success }}>
                ✓ Verified Gold Supplier
              </Text>
            </View>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: theme.colors.primary }}>
              $42,000
            </Text>
          </View>
          <Button title="Accept Quote & Checkout" onPress={() => navigation.navigate('CheckoutAddress')} variant="primary" size="sm" style={{ marginTop: 12 }} />
        </Card>
      </View>
    </Screen>
  );
}

export function RFQCreateScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = () => {
    navigation.goBack();
  };

  return (
    <Screen scrollable>
      <Header title="Create Request for Quote" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        <Input label="RFQ Title" value={title} onChangeText={setTitle} placeholder="e.g. 500 Tons OPC Cement" />

        <Input
          label="Detailed Requirements & Specs"
          value={description}
          onChangeText={setDescription}
          placeholder="Specify technical grades, delivery site location, and timelines..."
          multiline
          numberOfLines={4}
        />

        <Input label="Submission Deadline" value={deadline} onChangeText={setDeadline} placeholder="YYYY-MM-DD" />

        <Button title="Submit RFQ to Suppliers" onPress={handleSubmit} size="lg" variant="primary" style={{ marginTop: 16 }} />
      </View>
    </Screen>
  );
}
