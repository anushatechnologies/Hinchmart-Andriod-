/**
 * HINCH MART — Order Success Screen
 * Displays confirmed Order ID, delivery timeframe, and direct actions to track order.
 */
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/Screen';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function OrderSuccessScreen({ route, navigation }: any) {
  const { theme, isDark } = useTheme();
  const {
    orderId = 'ord_123',
    orderNumber = 'HM-994821',
    estimatedDelivery = '3 - 5 Business Days',
  } = route?.params ?? {};

  return (
    <Screen scrollable={false}>
      <View style={styles.centerContainer}>
        {/* Animated Celebration Icon */}
        <View style={[styles.successCircleOuter, { backgroundColor: `${theme.colors.success}18` }]}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.successCircleInner}
          >
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </LinearGradient>
        </View>

        <Text style={[styles.title, { color: theme.colors.navy }]}>
          Order Placed Successfully!
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Your construction materials order has been confirmed and dispatched to our logistics team.
        </Text>

        {/* Order Details Snippet */}
        <Card variant="outlined" style={styles.orderSnippetCard}>
          <View style={styles.snippetRow}>
            <Text style={[styles.snippetLabel, { color: theme.colors.textTertiary }]}>
              Order Number:
            </Text>
            <Text style={[styles.snippetVal, { color: theme.colors.navy }]}>
              {orderNumber}
            </Text>
          </View>

          <View style={styles.snippetRow}>
            <Text style={[styles.snippetLabel, { color: theme.colors.textTertiary }]}>
              Estimated Site Delivery:
            </Text>
            <Text style={[styles.snippetVal, { color: theme.colors.primary }]}>
              {estimatedDelivery}
            </Text>
          </View>

          <View style={styles.snippetRow}>
            <Text style={[styles.snippetLabel, { color: theme.colors.textTertiary }]}>
              Payment Status:
            </Text>
            <View style={styles.paidBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#10B981" />
              <Text style={styles.paidBadgeText}>Authorized & Confirmed</Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsGroup}>
          <Button
            title="Track Order Live"
            onPress={() =>
              navigation.replace('OrderTracking', {
                orderId,
                orderNumber,
              })
            }
            size="lg"
            variant="primary"
            style={{ width: '100%', marginBottom: 12 }}
          />

          <Button
            title="View Order Details"
            onPress={() =>
              navigation.replace('OrderDetail', {
                orderId,
              })
            }
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
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCircleOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successCircleInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
    marginBottom: 20,
  },
  orderSnippetCard: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  snippetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  snippetLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
  },
  snippetVal: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13.5,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  paidBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#10B981',
  },
  actionsGroup: {
    width: '100%',
  },
});
