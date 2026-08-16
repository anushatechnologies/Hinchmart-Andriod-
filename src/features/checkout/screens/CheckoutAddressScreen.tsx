/**
 * HINCH MART — Checkout Address, Payment & Success Screens
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useAppDispatch } from '../../../redux/hooks';
import { clearCart } from '../../../redux/slices/cartSlice';

const DEMO_ADDRESSES = [
  {
    id: 'a1',
    label: 'Headquarters & Site A',
    name: 'Apex Construction Ltd',
    phone: '+1 234 567 8900',
    address: 'Plot 405, Industrial Zone 3, Business Bay, Dubai, UAE',
    isDefault: true,
  },
  {
    id: 'a2',
    label: 'Secondary Warehouse',
    name: 'Apex Logistics Hub',
    phone: '+1 234 567 8901',
    address: 'Gate 5, Jebel Ali Free Zone, Dubai, UAE',
    isDefault: false,
  },
];

export function CheckoutAddressScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [selectedId, setSelectedId] = useState('a1');

  return (
    <Screen scrollable>
      <Header title="Select Delivery Address" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.paddingBox}>
        {DEMO_ADDRESSES.map((addr) => (
          <TouchableOpacity key={addr.id} onPress={() => setSelectedId(addr.id)} activeOpacity={0.9}>
            <Card
              variant="outlined"
              style={[
                styles.addrCard,
                selectedId === addr.id && { borderColor: theme.colors.primary, borderWidth: 2 },
              ]}
            >
              <View style={styles.rowBetween}>
                <Text style={[styles.addrLabel, { color: theme.colors.navy }]}>{addr.label}</Text>
                {addr.isDefault && <Badge label="DEFAULT" variant="navy" size="sm" />}
              </View>

              <Text style={[styles.addrName, { color: theme.colors.textPrimary }]}>{addr.name}</Text>
              <Text style={[styles.addrText, { color: theme.colors.textSecondary }]}>{addr.address}</Text>
              <Text style={[styles.addrPhone, { color: theme.colors.textTertiary }]}>📞 {addr.phone}</Text>
            </Card>
          </TouchableOpacity>
        ))}

        <Button
          title="Continue to Payment"
          onPress={() => navigation.navigate('CheckoutPayment')}
          size="lg"
          variant="primary"
          style={styles.continueBtn}
        />
      </View>
    </Screen>
  );
}

export function CheckoutPaymentScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceOrder = () => {
    setIsPlacing(true);
    setTimeout(() => {
      setIsPlacing(false);
      dispatch(clearCart());
      navigation.replace('OrderSuccess', { orderNumber: 'HM-994821', orderId: 'o1' });
    }, 1500);
  };

  return (
    <Screen scrollable>
      <Header title="Select Payment Method" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.paddingBox}>
        {[
          { id: 'card', label: 'Credit / Debit Card (B2B Corporate)', icon: '💳' },
          { id: 'bank', label: 'Bank Wire Transfer (L/C & Escrow)', icon: '🏦' },
          { id: 'wallet', label: 'HINCH MART Business Wallet', icon: '💼' },
          { id: 'cod', label: 'Cash / Credit on Delivery', icon: '💵' },
        ].map((method) => (
          <TouchableOpacity
            key={method.id}
            onPress={() => setSelectedMethod(method.id)}
            activeOpacity={0.9}
          >
            <Card
              variant="outlined"
              style={[
                styles.addrCard,
                selectedMethod === method.id && { borderColor: theme.colors.primary, borderWidth: 2 },
              ]}
            >
              <View style={styles.rowAlign}>
                <Text style={{ fontSize: 24, marginRight: 12 }}>{method.icon}</Text>
                <Text style={[styles.addrName, { color: theme.colors.textPrimary }]}>
                  {method.label}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        <Button
          title="Confirm & Place Order"
          onPress={handlePlaceOrder}
          isLoading={isPlacing}
          size="lg"
          variant="primary"
          style={styles.continueBtn}
        />
      </View>
    </Screen>
  );
}

export function OrderSuccessScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const { orderNumber = 'HM-994821' } = route.params ?? {};

  return (
    <Screen scrollable={false}>
      <View style={styles.centerContainer}>
        <View style={[styles.successIconBox, { backgroundColor: theme.colors.successLight }]}>
          <Text style={{ fontSize: 48 }}>🎉</Text>
        </View>

        <Text style={[styles.successTitle, { color: theme.colors.navy }]}>
          Order Placed Successfully!
        </Text>

        <Text style={[styles.successSub, { color: theme.colors.textSecondary }]}>
          Order number #{orderNumber} has been received and is being processed by our logistics team.
        </Text>

        <Button
          title="Track Order Status"
          onPress={() => navigation.replace('OrderHistory')}
          size="lg"
          variant="navy"
          style={{ width: '100%', marginBottom: 12 }}
        />

        <Button
          title="Continue Shopping"
          onPress={() => navigation.replace('MainTabs')}
          size="lg"
          variant="outline"
          style={{ width: '100%' }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  paddingBox: {
    padding: 16,
  },
  addrCard: {
    marginBottom: 12,
    padding: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addrLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },
  addrName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  addrText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  addrPhone: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  continueBtn: {
    marginTop: 16,
  },
  centerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  successSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
});
