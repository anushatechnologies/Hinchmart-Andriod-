/**
 * HINCH MART — Checkout Payment Method Screen (Step 3 of 4)
 * Supports UPI, Cards, Net Banking / NEFT, Business Credit Wallet, COD, and Escrow.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface PaymentMethodOption {
  id: string;
  name: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: string;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'upi',
    name: 'UPI / QR Code Instant Payment',
    subtitle: 'Google Pay, PhonePe, Paytm, BHIM & UPI ID',
    icon: 'phone-portrait-outline',
    badge: 'POPULAR',
  },
  {
    id: 'card',
    name: 'Credit / Debit Card (B2B Corporate)',
    subtitle: 'Visa, MasterCard, RuPay & Corporate Commercial Cards',
    icon: 'card-outline',
  },
  {
    id: 'net_banking',
    name: 'Net Banking / NEFT / RTGS Transfer',
    subtitle: 'Direct bank transfer from SBI, HDFC, ICICI, Axis, and all Indian banks',
    icon: 'business-outline',
  },
  {
    id: 'wallet',
    name: 'HINCH MART Business Credit Line',
    subtitle: 'Procure now and pay in 30-day billing cycle (Available: ₹2,50,000)',
    icon: 'wallet-outline',
    badge: 'ZERO INTEREST',
  },
  {
    id: 'escrow',
    name: 'Escrow & Letter of Credit (L/C)',
    subtitle: 'Funds released only after batch material testing certificate approval at site',
    icon: 'shield-checkmark-outline',
    badge: '100% SECURE',
  },
  {
    id: 'cod',
    name: 'Pay on Site Delivery (COD)',
    subtitle: 'Pay via cash or UPI directly to logistics driver upon material unloader verification',
    icon: 'cash-outline',
  },
];

export function CheckoutPaymentScreen({ route, navigation }: any) {
  const { theme, isDark } = useTheme();
  const {
    addressId = 'addr_1',
    deliveryMethodId = 'std_freight',
    deliveryCharge = 150,
  } = route?.params ?? {};

  const [selectedMethodId, setSelectedMethodId] = useState<string>('upi');

  const handleContinue = () => {
    navigation.navigate('CheckoutReview', {
      addressId,
      deliveryMethodId,
      paymentMethod: selectedMethodId,
      deliveryCharge,
    });
  };

  return (
    <Screen scrollable>
      <Header
        title="Select Payment Method"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Step Indicator */}
      <View style={[styles.stepBar, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={styles.stepItem}>
          <View style={[styles.stepDot, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="checkmark" size={12} color="#152238" />
          </View>
          <Text style={[styles.stepLabel, { color: theme.colors.textSecondary }]}>Address</Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: theme.colors.primary }]} />
        <View style={styles.stepItem}>
          <View style={[styles.stepDot, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="checkmark" size={12} color="#152238" />
          </View>
          <Text style={[styles.stepLabel, { color: theme.colors.textSecondary }]}>Logistics</Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: theme.colors.primary }]} />
        <View style={styles.stepItem}>
          <View style={[styles.stepDot, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.stepNum}>3</Text>
          </View>
          <Text style={[styles.stepLabel, { color: theme.colors.navy, fontFamily: 'Poppins_600SemiBold' }]}>
            Payment
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionHeading, { color: theme.colors.navy }]}>
          Payment Options
        </Text>

        {PAYMENT_METHODS.map((pm) => {
          const isSelected = selectedMethodId === pm.id;
          return (
            <TouchableOpacity
              key={pm.id}
              onPress={() => setSelectedMethodId(pm.id)}
              activeOpacity={0.85}
            >
              <Card
                variant="outlined"
                style={[
                  styles.optionCard,
                  isSelected && {
                    borderColor: theme.colors.primary,
                    borderWidth: 2,
                    backgroundColor: isDark ? 'rgba(253, 185, 19, 0.05)' : 'rgba(253, 185, 19, 0.03)',
                  },
                ]}
              >
                <View style={styles.cardHeaderRow}>
                  <View
                    style={[
                      styles.iconWrap,
                      {
                        backgroundColor: isSelected
                          ? theme.colors.primary
                          : `${theme.colors.navy}12`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={pm.icon}
                      size={20}
                      color={isSelected ? '#152238' : theme.colors.navy}
                    />
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.optionName, { color: theme.colors.textPrimary }]}>
                        {pm.name}
                      </Text>
                      {pm.badge && (
                        <View style={styles.badgePill}>
                          <Text style={styles.badgePillText}>{pm.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.optionSub, { color: theme.colors.textSecondary }]}>
                      {pm.subtitle}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioOuter,
                      { borderColor: isSelected ? theme.colors.primary : theme.colors.border },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: theme.colors.primary },
                        ]}
                      />
                    )}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        <Button
          title="Review & Place Order"
          onPress={handleContinue}
          size="lg"
          variant="primary"
          style={{ marginTop: 16 }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stepBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNum: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: '#152238',
  },
  stepLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  stepLine: {
    flex: 1,
    height: 1.5,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    marginBottom: 12,
  },
  optionCard: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13.5,
  },
  badgePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePillText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: '#B45309',
  },
  optionSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    lineHeight: 16,
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
