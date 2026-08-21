/**
 * HINCH MART — Order History & Status Screen
 * Displays past B2B construction orders with status filter tabs, search, and live tracking access.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { OrderCard } from '../../../components/cards/OrderCard';
import { EmptyState } from '../../../components/feedback/SkeletonLoader';
import { Order } from '../../../types/order.types';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord_1',
    orderNumber: 'HM-994821',
    userId: 'usr_1',
    items: [
      {
        id: 'oi_1',
        productId: 'p1',
        productName: 'UltraTech OPC 53 Grade Cement (50kg Bag)',
        productImage:
          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
        variantId: 'v_50kg',
        variantName: '50 kg Bag',
        quantity: 50,
        unitPrice: 420,
        totalPrice: 21000,
        sku: 'CEM-UT-53',
      },
    ],
    shippingAddress: {
      id: 'addr_1',
      label: 'Main Construction Site A',
      fullName: 'Rajesh Sharma',
      phone: '+91 98765 43210',
      addressLine1: 'Plot 405, Industrial Zone 3, Hyderabad, Telangana',
      addressLine2: '',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postalCode: '500001',
      isDefault: true,
    },
    billingAddress: {
      id: 'addr_1',
      label: 'Main Construction Site A',
      fullName: 'Rajesh Sharma',
      phone: '+91 98765 43210',
      addressLine1: 'Plot 405, Industrial Zone 3, Hyderabad, Telangana',
      addressLine2: '',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postalCode: '500001',
      isDefault: true,
    },
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    subtotal: 21000,
    shippingCost: 800,
    tax: 3780,
    discount: 500,
    walletUsed: 0,
    total: 25080,
    currency: 'INR',
    couponCode: 'BUILD10',
    tracking: null,
    timeline: [],
    notes: 'Please dispatch before 9 AM for morning batching.',
    invoice: {
      id: 'inv_1',
      invoiceNumber: 'TAX-INV-88412',
      url: 'https://hinchmart.com/invoices/inv_1.pdf',
      generatedAt: new Date().toISOString(),
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDelivery: 'Tomorrow, 11:30 AM',
  },
  {
    id: 'ord_2',
    orderNumber: 'HM-884120',
    userId: 'usr_1',
    items: [
      {
        id: 'oi_2',
        productId: 'p2',
        productName: 'Tata Tiscon Fe 500D TMT Steel Rebar 12mm',
        productImage:
          'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=600&q=80',
        variantId: null,
        variantName: null,
        quantity: 5,
        unitPrice: 62000,
        totalPrice: 310000,
        sku: 'ST-TATA-12MM',
      },
    ],
    shippingAddress: {
      id: 'addr_1',
      label: 'Main Construction Site A',
      fullName: 'Rajesh Sharma',
      phone: '+91 98765 43210',
      addressLine1: 'Plot 405, Industrial Zone 3, Hyderabad, Telangana',
      addressLine2: '',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postalCode: '500001',
      isDefault: true,
    },
    billingAddress: {
      id: 'addr_1',
      label: 'Main Construction Site A',
      fullName: 'Rajesh Sharma',
      phone: '+91 98765 43210',
      addressLine1: 'Plot 405, Industrial Zone 3, Hyderabad, Telangana',
      addressLine2: '',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postalCode: '500001',
      isDefault: true,
    },
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'wallet',
    subtotal: 310000,
    shippingCost: 2500,
    tax: 55800,
    discount: 0,
    walletUsed: 368300,
    total: 368300,
    currency: 'INR',
    couponCode: null,
    tracking: null,
    timeline: [],
    notes: 'Unloaded and verified at Site A.',
    invoice: {
      id: 'inv_2',
      invoiceNumber: 'TAX-INV-77301',
      url: 'https://hinchmart.com/invoices/inv_2.pdf',
      generatedAt: new Date().toISOString(),
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDelivery: 'Delivered on 14 Aug 2026',
  },
];

const STATUS_TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

export function OrderHistoryScreen({ route, navigation }: any) {
  const { theme, isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState<string>(
    route?.params?.initialTab || 'all'
  );

  const filteredOrders = MOCK_ORDERS.filter((ord) => {
    if (selectedTab === 'all') return true;
    return ord.status.toLowerCase() === selectedTab.toLowerCase();
  });

  return (
    <Screen scrollable={false}>
      <Header
        title="My Orders"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Tabs Row */}
      <View style={[styles.tabsWrapper, { backgroundColor: theme.colors.surfaceVariant, borderBottomColor: theme.colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {STATUS_TABS.map((tab) => {
            const isSelected = selectedTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setSelectedTab(tab.id)}
                style={[
                  styles.tabItem,
                  isSelected && {
                    borderBottomColor: theme.colors.primary,
                    borderBottomWidth: 3,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isSelected ? theme.colors.navy : theme.colors.textSecondary,
                      fontFamily: isSelected ? 'Poppins_700Bold' : 'Inter_500Medium',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            title="No Orders Found"
            subtitle={`You do not have any ${selectedTab !== 'all' ? selectedTab : ''} orders yet.`}
            actionTitle="Start Shopping"
            onAction={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
          />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          contentContainerStyle={styles.listPadding}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
              onTrackPress={() =>
                navigation.navigate('OrderTracking', {
                  orderId: item.id,
                  orderNumber: item.orderNumber,
                })
              }
            />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabsWrapper: {
    borderBottomWidth: 1,
  },
  tabsScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  tabLabel: {
    fontSize: 13,
  },
  listPadding: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
});
