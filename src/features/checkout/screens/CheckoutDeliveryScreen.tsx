/**
 * HINCH MART — Checkout Delivery & Logistics Options (Step 2 of 4)
 * Allows contractors to pick between standard freight, express site dispatch,
 * scheduled pouring slot, or heavy dedicated truckload.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAppDispatch } from '../../../redux/hooks';
import { setShippingCost } from '../../../redux/slices/cartSlice';
import { formatPrice } from '../../../utils';

interface DeliveryOption {
  id: string;
  title: string;
  description: string;
  eta: string;
  charge: number;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: string;
}

const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'std_freight',
    title: 'Standard Site Freight',
    description: 'Consolidated commercial vehicle delivery directly to project gate.',
    eta: '2 - 3 Business Days',
    charge: 150,
    icon: 'bus-outline',
    badge: 'POPULAR',
  },
  {
    id: 'express_24h',
    title: 'Express 24H Site Dispatch',
    description: 'Priority warehouse dispatch with dedicated courier within 24 hours.',
    eta: 'Next Day Morning',
    charge: 350,
    icon: 'flash-outline',
    badge: 'FASTEST',
  },
  {
    id: 'scheduled_pour',
    title: 'Scheduled Concrete / Pouring Slot',
    description: 'Time-sensitive delivery matched to your site batching schedule.',
    eta: 'Selectable Day & Time Slot',
    charge: 250,
    icon: 'calendar-outline',
  },
  {
    id: 'heavy_truck',
    title: 'Heavy Dedicated Tipper / Trailer Truck',
    description: 'Full 10 - 25 Ton dedicated trailer dispatch for bulk rebar & aggregates.',
    eta: '3 - 4 Business Days',
    charge: 800,
    icon: 'car-sport-outline',
    badge: 'BULK B2B',
  },
];

export function CheckoutDeliveryScreen({ route, navigation }: any) {
  const { theme, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { addressId = 'addr_1' } = route?.params ?? {};

  const [selectedOptionId, setSelectedOptionId] = useState<string>('std_freight');

  const selectedOption = DELIVERY_OPTIONS.find((o) => o.id === selectedOptionId) || DELIVERY_OPTIONS[0];

  const handleContinue = () => {
    dispatch(setShippingCost(selectedOption.charge));
    navigation.navigate('CheckoutPayment', {
      addressId,
      deliveryMethodId: selectedOption.id,
      deliveryCharge: selectedOption.charge,
    });
  };

  return (
    <Screen scrollable>
      <Header
        title="Select Logistics & Freight"
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
            <Text style={styles.stepNum}>2</Text>
          </View>
          <Text style={[styles.stepLabel, { color: theme.colors.navy, fontFamily: 'Poppins_600SemiBold' }]}>
            Logistics
          </Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: theme.colors.border }]} />
        <View style={styles.stepItem}>
          <View style={[styles.stepDot, { backgroundColor: theme.colors.border }]}>
            <Text style={[styles.stepNum, { color: theme.colors.textSecondary }]}>3</Text>
          </View>
          <Text style={[styles.stepLabel, { color: theme.colors.textSecondary }]}>Payment</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionHeading, { color: theme.colors.navy }]}>
          Available Freight Methods
        </Text>

        {DELIVERY_OPTIONS.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => setSelectedOptionId(opt.id)}
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
                  <View style={styles.titleWrap}>
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
                        name={opt.icon}
                        size={20}
                        color={isSelected ? '#152238' : theme.colors.navy}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.optionTitle, { color: theme.colors.textPrimary }]}>
                          {opt.title}
                        </Text>
                        {opt.badge && (
                          <View style={styles.badgePill}>
                            <Text style={styles.badgePillText}>{opt.badge}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.optionEta, { color: theme.colors.primary }]}>
                        ⏱️ Estimated Arrival: {opt.eta}
                      </Text>
                    </View>
                  </View>

                  {/* Radio */}
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

                <Text style={[styles.optionDesc, { color: theme.colors.textSecondary }]}>
                  {opt.description}
                </Text>

                <View style={[styles.priceDivider, { borderTopColor: theme.colors.border }]} />

                <View style={styles.cardFooterRow}>
                  <Text style={[styles.freightLabel, { color: theme.colors.textTertiary }]}>
                    Freight Charge
                  </Text>
                  <Text style={[styles.chargeText, { color: theme.colors.navy }]}>
                    {opt.charge === 0 ? 'FREE' : formatPrice(opt.charge)}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        <Button
          title="Continue to Payment Method"
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
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
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
  optionEta: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11.5,
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
  optionDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 8,
  },
  priceDivider: {
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 8,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  freightLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
  },
  chargeText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
  },
});
