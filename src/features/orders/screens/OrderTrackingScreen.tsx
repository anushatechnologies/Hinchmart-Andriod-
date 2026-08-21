/**
 * HINCH MART — Live Order Tracking Screen
 * Visual step timeline showing real-time freight progress from factory/warehouse to project site.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface TrackingStep {
  title: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
  isCurrent: boolean;
  icon: keyof typeof Ionicons.glyphMap;
}

export function OrderTrackingScreen({ route, navigation }: any) {
  const { theme, isDark } = useTheme();
  const { orderId = 'ord_1', orderNumber = 'HM-994821' } = route?.params ?? {};

  const trackingSteps: TrackingStep[] = [
    {
      title: 'Order Placed & Payment Authorized',
      description: 'Order confirmed and materials reserved in warehouse inventory.',
      timestamp: 'Today, 10:30 AM',
      isCompleted: true,
      isCurrent: false,
      icon: 'receipt-outline',
    },
    {
      title: 'Vendor Verification & Material Batch Testing',
      description: 'Quality tested against Bureau of Indian Standards (IS 269:2015).',
      timestamp: 'Today, 11:45 AM',
      isCompleted: true,
      isCurrent: false,
      icon: 'shield-checkmark-outline',
    },
    {
      title: 'Loaded on Dedicated Site Trailer',
      description: 'Dispatched from Hyderabad Central Distribution Hub.',
      timestamp: 'Today, 02:15 PM',
      isCompleted: true,
      isCurrent: true,
      icon: 'bus-outline',
    },
    {
      title: 'In Transit to Destination Site',
      description: 'En route via Outer Ring Road (ORR). Vehicle No: TS-09-UB-4421.',
      timestamp: 'Expected Tomorrow, 09:00 AM',
      isCompleted: false,
      isCurrent: false,
      icon: 'navigate-outline',
    },
    {
      title: 'Site Delivery & Unloading Verification',
      description: 'Receipt signed by site engineer and e-Way bill closed.',
      timestamp: 'Expected Tomorrow, 11:30 AM',
      isCompleted: false,
      isCurrent: false,
      icon: 'checkmark-done-circle-outline',
    },
  ];

  const handleCallDriver = () => {
    Linking.openURL('tel:+919876543210');
  };

  const handleShareTracking = () => {
    Share.share({
      message: `Track HINCH MART Delivery for Order #${orderNumber}: Vehicle No TS-09-UB-4421 en route to Hyderabad Project Site.`,
      title: `Tracking #${orderNumber}`,
    });
  };

  return (
    <Screen scrollable>
      <Header
        title="Live Order Tracking"
        showBack
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleShareTracking} style={styles.shareBtn}>
            <Ionicons name="share-social-outline" size={20} color={theme.colors.navy} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        {/* Order Header Summary */}
        <Card variant="outlined" style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.orderNumberText, { color: theme.colors.navy }]}>
                {orderNumber}
              </Text>
              <Text style={[styles.etaSubText, { color: theme.colors.primary }]}>
                ⏱️ Estimated Arrival: Tomorrow by 11:30 AM
              </Text>
            </View>
            <View style={[styles.liveBadge, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>IN TRANSIT</Text>
            </View>
          </View>

          {/* Logistics Driver Banner */}
          <View style={[styles.driverBox, { backgroundColor: theme.colors.surfaceVariant }]}>
            <View style={[styles.driverAvatar, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Ionicons name="person" size={20} color={theme.colors.navy} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.driverName, { color: theme.colors.textPrimary }]}>
                Mohan Kumar (Freight Captain)
              </Text>
              <Text style={[styles.driverSub, { color: theme.colors.textTertiary }]}>
                Vehicle: TS-09-UB-4421 (16-Ton Flatbed)
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCallDriver}
              style={[styles.callDriverBtn, { backgroundColor: theme.colors.navy }]}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Step-by-Step Progress Timeline */}
        <Text style={[styles.sectionTitle, { color: theme.colors.navy }]}>
          Freight Milestones & Timeline
        </Text>

        <Card variant="outlined" style={styles.timelineCard}>
          {trackingSteps.map((step, idx) => {
            const isLast = idx === trackingSteps.length - 1;

            return (
              <View key={idx} style={styles.stepContainer}>
                {/* Left Line & Icon */}
                <View style={styles.leftCol}>
                  <View
                    style={[
                      styles.stepIconCircle,
                      step.isCompleted && {
                        backgroundColor: theme.colors.primary,
                      },
                      step.isCurrent && {
                        backgroundColor: '#152238',
                        borderColor: theme.colors.primary,
                        borderWidth: 2,
                      },
                      !step.isCompleted && !step.isCurrent && {
                        backgroundColor: theme.colors.surfaceVariant,
                        borderColor: theme.colors.border,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Ionicons
                      name={step.icon}
                      size={15}
                      color={
                        step.isCompleted
                          ? '#152238'
                          : step.isCurrent
                          ? '#FDB913'
                          : theme.colors.textTertiary
                      }
                    />
                  </View>

                  {!isLast && (
                    <View
                      style={[
                        styles.verticalLine,
                        {
                          backgroundColor: step.isCompleted
                            ? theme.colors.primary
                            : theme.colors.border,
                        },
                      ]}
                    />
                  )}
                </View>

                {/* Right Content */}
                <View style={styles.rightCol}>
                  <View style={styles.stepHeaderRow}>
                    <Text
                      style={[
                        styles.stepTitle,
                        {
                          color: step.isCurrent
                            ? theme.colors.navy
                            : step.isCompleted
                            ? theme.colors.textPrimary
                            : theme.colors.textTertiary,
                          fontFamily: step.isCurrent
                            ? 'Poppins_700Bold'
                            : 'Poppins_600SemiBold',
                        },
                      ]}
                    >
                      {step.title}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.stepDesc,
                      {
                        color: step.isCurrent
                          ? theme.colors.textPrimary
                          : theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {step.description}
                  </Text>

                  <Text
                    style={[
                      styles.stepTime,
                      { color: step.isCurrent ? theme.colors.primary : theme.colors.textTertiary },
                    ]}
                  >
                    {step.timestamp}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>

        {/* View Full Order Details Button */}
        <Button
          title="View Full Order Manifest & Invoices"
          onPress={() => navigation.navigate('OrderDetail', { orderId })}
          variant="outline"
          size="lg"
          style={{ marginTop: 16 }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  shareBtn: {
    padding: 6,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  orderNumberText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
  etaSubText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12.5,
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: '#10B981',
  },
  driverBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
  },
  driverAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },
  driverSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 1,
  },
  callDriverBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    marginBottom: 12,
  },
  timelineCard: {
    padding: 16,
    borderRadius: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    minHeight: 80,
  },
  leftCol: {
    alignItems: 'center',
    width: 32,
  },
  stepIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  rightCol: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 20,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 13.5,
  },
  stepDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3,
  },
  stepTime: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    marginTop: 4,
  },
});
