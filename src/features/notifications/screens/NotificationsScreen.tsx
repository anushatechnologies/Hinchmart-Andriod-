/**
 * HINCH MART — Notifications, B2B Chat, FAQ, and Industry News Screens
 * Fully interactive with deep link navigation to RFQs, Orders, and Support channels
 */
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

const DEMO_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Quotation Received!',
    body: 'Global Metals Co submitted a quote for RFQ #RFQ-88210 ($42,000).',
    time: '10m ago',
    unread: true,
    targetScreen: 'RFQDetail',
    targetParams: { rfqId: 'rfq1' },
    icon: 'document-text',
    iconColor: '#F59E0B',
  },
  {
    id: 'n2',
    title: 'Order Dispatched',
    body: 'Order #HM-994821 has been shipped via Express Freight Logistics.',
    time: '2h ago',
    unread: false,
    targetScreen: 'OrderDetail',
    targetParams: { orderId: 'o1' },
    icon: 'cube',
    iconColor: '#3B82F6',
  },
  {
    id: 'n3',
    title: 'Equipment Rental Reserved',
    body: 'CAT 320 Hydraulic Excavator availability confirmed for Business Bay Site.',
    time: '1d ago',
    unread: false,
    targetScreen: 'RentalList',
    targetParams: {},
    icon: 'construct',
    iconColor: '#10B981',
  },
];

export function NotificationsScreen({ navigation }: any) {
  const { theme } = useTheme();

  return (
    <Screen scrollable={false}>
      <Header title="Notifications" showBack onBackPress={() => navigation.goBack()} />

      <FlatList
        data={DEMO_NOTIFICATIONS}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (item.targetScreen) {
                navigation.navigate(item.targetScreen, item.targetParams);
              }
            }}
          >
            <Card
              variant={item.unread ? 'filled' : 'outlined'}
              style={[
                styles.cardMargin,
                item.unread && { backgroundColor: `${theme.colors.primary}12`, borderColor: theme.colors.primary },
              ]}
            >
              <View style={styles.rowBetween}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                  <View style={[styles.notifIconWrap, { backgroundColor: `${item.iconColor}18` }]}>
                    <Ionicons name={item.icon as any} size={16} color={item.iconColor} />
                  </View>
                  <Text style={[styles.notifTitle, { color: theme.colors.navy }]}>{item.title}</Text>
                </View>
                <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>{item.time}</Text>
              </View>
              <Text style={[styles.notifBody, { color: theme.colors.textSecondary, marginLeft: 36 }]}>
                {item.body}
              </Text>
            </Card>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </Screen>
  );
}

export function ChatListScreen({ navigation }: any) {
  const { theme } = useTheme();

  return (
    <Screen scrollable={false}>
      <Header title="B2B Messages" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('RFQDetail', { rfqId: 'rfq1' })}
        >
          <Card variant="outlined" style={{ padding: 16, borderRadius: 16 }}>
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.avatarCircle, { backgroundColor: theme.colors.navy }]}>
                  <Text style={{ color: '#FFF', fontFamily: 'Poppins_700Bold', fontSize: 14 }}>GM</Text>
                </View>
                <View>
                  <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: theme.colors.textPrimary }}>
                    Global Metals Co (Vendor)
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: theme.colors.success }}>
                    ✓ Verified Gold Supplier
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>12:40 PM</Text>
            </View>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: theme.colors.textSecondary, marginTop: 10 }}>
              "Yes, we can dispatch 500 Tons of Steel Rebar by Thursday to your Business Bay site."
            </Text>
          </Card>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

export function FAQScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const FAQ_ITEMS = [
    {
      q: 'How do RFQ bulk quotations work?',
      a: 'Submit your material specifications or bill of quantities (BOQ). Verified international suppliers submit competitive bids within 24 hours. You can compare quotes and proceed with Escrow payment protection.',
    },
    {
      q: 'What payment methods are supported for international orders?',
      a: 'We support Letters of Credit (L/C), Escrow Wire Transfers, Corporate Credit Cards, and HINCH MART Business Wallet balance.',
    },
    {
      q: 'How is heavy equipment rental delivered?',
      a: 'Equipment rentals include direct site mobilization, certified machine operators, safety inspections, and on-site logistics setup.',
    },
    {
      q: 'Can I request customized material specifications?',
      a: 'Yes, when creating an RFQ or placing a purchase order, you can specify custom steel grades, cement types, cutting lengths, and delivery milestones.',
    },
  ];

  return (
    <Screen scrollable>
      <Header title="Help Center & FAQ" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, marginBottom: 16, color: theme.colors.navy }}>
          Frequently Asked Questions
        </Text>

        {FAQ_ITEMS.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              onPress={() => setExpandedIndex(isExpanded ? null : idx)}
            >
              <Card variant="outlined" style={{ marginBottom: 12, padding: 14, borderRadius: 14 }}>
                <View style={styles.rowBetween}>
                  <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: theme.colors.textPrimary, flex: 1, paddingRight: 8 }}>
                    ❓ {item.q}
                  </Text>
                  <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={theme.colors.textTertiary} />
                </View>
                {isExpanded && (
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: theme.colors.textSecondary, lineHeight: 19, marginTop: 8 }}>
                    {item.a}
                  </Text>
                )}
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>
    </Screen>
  );
}

export function NewsScreen({ navigation }: any) {
  const { theme } = useTheme();

  return (
    <Screen scrollable>
      <Header title="Construction Industry News" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        <Card variant="outlined" style={{ marginBottom: 16, padding: 14, borderRadius: 14 }}>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: theme.colors.navy, marginBottom: 4 }}>
            📈 Global Steel Prices Surge by 8.5% Amid Demand in Green Infrastructure
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.colors.textTertiary, marginBottom: 8 }}>
            Aug 03, 2026 · International Trade Report
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: theme.colors.textSecondary, lineHeight: 19 }}>
            Analysis of raw steel billet prices across Middle East and European export hubs indicates strong demand for LEED-certified reinforced rebar...
          </Text>
        </Card>

        <Card variant="outlined" style={{ marginBottom: 16, padding: 14, borderRadius: 14 }}>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: theme.colors.navy, marginBottom: 4 }}>
            🏗️ Smart Logistics: Real-Time Telematics Introduced for Heavy Machinery Fleet
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.colors.textTertiary, marginBottom: 8 }}>
            Jul 28, 2026 · Fleet Management Digest
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: theme.colors.textSecondary, lineHeight: 19 }}>
            Rental excavators and cranes now feature automated fuel tracking, IoT load monitoring, and site dispatch optimization.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardMargin: {
    marginBottom: 10,
    padding: 14,
    borderRadius: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  notifBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 4,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
