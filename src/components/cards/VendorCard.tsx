/**
 * HINCH MART — Vendor, Company, RFQ & Order Cards
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Rating } from '../ui/Rating';
import { Button } from '../ui/Button';
import { Vendor } from '../../types/vendor.types';
import { Company } from '../../types/company.types';
import { RFQ } from '../../types/rfq.types';
import { Order } from '../../types/order.types';
import { formatPrice, formatDate } from '../../utils';

// Vendor Card
export function VendorCard({ vendor, onPress }: { vendor: Vendor; onPress: () => void }) {
  const { theme } = useTheme();

  return (
    <Card onPress={onPress} variant="outlined" style={styles.vendorCard}>
      <View style={styles.vendorHeader}>
        <Image source={{ uri: vendor.logo }} style={styles.vendorLogo} contentFit="cover" />
        <View style={styles.vendorMeta}>
          <View style={styles.rowAlign}>
            <Text style={[styles.vendorName, { color: theme.colors.textPrimary }]}>
              {vendor.name}
            </Text>
            {vendor.isVerified && <Badge label="Verified" variant="success" size="sm" style={styles.ml4} />}
          </View>
          <Text style={[styles.vendorSub, { color: theme.colors.textTertiary }]}>
            📍 {vendor.address.city}, {vendor.address.country}
          </Text>
          <Rating rating={vendor.rating} count={vendor.reviewCount} showCount size={12} />
        </View>
      </View>

      <View style={[styles.vendorDivider, { backgroundColor: theme.colors.divider }]} />

      <View style={styles.vendorStats}>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: theme.colors.navy }]}>{vendor.productCount}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>Products</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: theme.colors.navy }]}>{vendor.responseTime}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>Response</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: theme.colors.success }]}>
            {vendor.performance.onTimeDelivery}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>On-Time</Text>
        </View>
      </View>
    </Card>
  );
}

// Company Card
export function CompanyCard({ company, onPress }: { company: Company; onPress: () => void }) {
  const { theme } = useTheme();

  return (
    <Card onPress={onPress} variant="outlined" style={styles.vendorCard}>
      <View style={styles.vendorHeader}>
        <Image source={{ uri: company.logo }} style={styles.vendorLogo} contentFit="cover" />
        <View style={styles.vendorMeta}>
          <View style={styles.rowAlign}>
            <Text style={[styles.vendorName, { color: theme.colors.textPrimary }]}>
              {company.name}
            </Text>
            {company.isVerified && <Badge label="Verified" variant="info" size="sm" style={styles.ml4} />}
          </View>
          <Text style={[styles.vendorSub, { color: theme.colors.textTertiary }]}>
            🏗️ {company.industry}
          </Text>
          <Text style={[styles.vendorSub, { color: theme.colors.textSecondary }]}>
            👥 {company.totalEmployees} Employees · 📁 {company.totalProjects} Active Projects
          </Text>
        </View>
      </View>
    </Card>
  );
}

// RFQ Card
export function RFQCard({ rfq, onPress }: { rfq: RFQ; onPress: () => void }) {
  const { theme, isDark } = useTheme();

  const getStatusVariant = () => {
    switch (rfq.status) {
      case 'quoted':
        return 'success';
      case 'in_review':
        return 'warning';
      case 'approved':
        return 'primary';
      case 'rejected':
        return 'danger';
      default:
        return 'info';
    }
  };

  return (
    <Card onPress={onPress} variant="outlined" style={[styles.rfqCard, { borderRadius: 18, padding: 16, marginBottom: 14 }]}>
      <View style={styles.rowSpaceBetween}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ backgroundColor: `${theme.colors.primary}20`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 11, color: theme.colors.navy }}>#{rfq.rfqNumber}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: theme.colors.surfaceVariant, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 }}>
            <Ionicons name="location-outline" size={10} color={theme.colors.textSecondary} />
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 10, color: theme.colors.textSecondary }}>Business Bay, Dubai</Text>
          </View>
        </View>
        <Badge label={rfq.status.replace('_', ' ').toUpperCase()} variant={getStatusVariant()} size="sm" />
      </View>

      <Text style={[styles.rfqTitle, { color: theme.colors.textPrimary, marginTop: 10, fontSize: 15, fontFamily: 'Poppins_600SemiBold' }]}>
        {rfq.title}
      </Text>
      <Text numberOfLines={2} style={[styles.rfqDesc, { color: theme.colors.textSecondary, marginTop: 4, lineHeight: 18 }]}>
        {rfq.description}
      </Text>

      <View style={[styles.vendorDivider, { backgroundColor: theme.colors.divider, marginVertical: 12 }]} />

      <View style={styles.rowSpaceBetween}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="calendar-outline" size={14} color={theme.colors.textTertiary} />
          <Text style={[styles.rfqSub, { color: theme.colors.textTertiary, fontSize: 11 }]}>
            Deadline: {formatDate(rfq.deadline, 'short')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${theme.colors.success}15`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
          <Ionicons name="mail-unread" size={12} color={theme.colors.success} />
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: theme.colors.success }}>
            {rfq.quotations.length} Quotes Received
          </Text>
        </View>
      </View>
    </Card>
  );
}

// Order Card
export function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const { theme } = useTheme();

  const getStatusVariant = () => {
    switch (order.status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'navy';
    }
  };

  return (
    <Card onPress={onPress} variant="outlined" style={styles.rfqCard}>
      <View style={styles.rowSpaceBetween}>
        <Text style={[styles.rfqNumber, { color: theme.colors.navy }]}>Order #{order.orderNumber}</Text>
        <Badge label={order.status.toUpperCase()} variant={getStatusVariant()} size="sm" />
      </View>

      <Text style={[styles.orderDate, { color: theme.colors.textTertiary }]}>
        Placed on {formatDate(order.createdAt, 'medium')}
      </Text>

      <View style={styles.orderItemRow}>
        <Text style={[styles.orderItemsSummary, { color: theme.colors.textPrimary }]}>
          📦 {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </Text>
        <Text style={[styles.orderTotal, { color: theme.colors.navy }]}>
          {formatPrice(order.total, order.currency)}
        </Text>
      </View>

      <View style={styles.orderActions}>
        <Button title="View Details" onPress={onPress} variant="outline" size="sm" fullWidth={false} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  vendorCard: {
    marginBottom: 12,
    width: '100%',
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F1F3F5',
  },
  vendorMeta: {
    marginLeft: 12,
    flex: 1,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },
  vendorSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginVertical: 2,
  },
  ml4: {
    marginLeft: 6,
  },
  vendorDivider: {
    height: 1,
    marginVertical: 12,
  },
  vendorStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNum: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  rfqCard: {
    marginBottom: 12,
    width: '100%',
  },
  rfqNumber: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },
  rfqTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    marginTop: 6,
  },
  rfqDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  rfqSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  rfqQuoteCount: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  orderDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  orderItemsSummary: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  orderTotal: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  orderActions: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
});
