/**
 * HINCH MART — Production Account / Profile Screen (Exact Approved Visual Reference)
 * Reproduces the approved B2B Account UI reference:
 * - Compact elevated Profile Card with top-right Pencil Edit Icon.
 * - Yellow Avatar circle with dynamic Initials + Green checkmark badge.
 * - Hierarchy: Name (20px bold) -> Company (14px medium) -> Email & Phone (13px).
 * - Soft pill badges: Verified, GST Verified, Business/Vendor Account.
 * - YOUR ACTIVITY: 4 compact cards in 1 row (Orders, RFQs, Saved, Reviews) without "View all" text.
 * - Grouped Menu Cards: ACCOUNT & ORDERS, FINANCE & VENDORS, PREFERENCES, SUPPORT & LEGAL.
 * - Red outlined Sign Out button with native Alert confirmation.
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { useAppDispatch } from '../../../redux/hooks';
import { authStore } from '../../../store/authStore';
import { logout } from '../../../redux/slices/authSlice';
import { useAccountSummary } from '../../../hooks/useAccountSummary';

const BRAND_NAVY = '#0A2540';
const BRAND_GOLD = '#F47B20';
const ICON_TINTS = {
  blue: '#2563EB',
  green: '#10B981',
  amber: '#F59E0B',
  purple: '#8B5CF6',
  red: '#EF4444',
};

interface MenuItem {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: string;
  tint: string;
  subtitle?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. YOUR ACTIVITY (EXACTLY 4 CARDS: ORDERS, RFQS, SAVED, REVIEWS)
// ─────────────────────────────────────────────────────────────────────────────
function QuickActivityStats({
  ordersCount,
  rfqsCount,
  wishlistCount,
  reviewsCount,
  navigation,
}: {
  ordersCount: number;
  rfqsCount: number;
  wishlistCount: number;
  reviewsCount: number;
  navigation: any;
}) {
  const { theme } = useTheme();

  const stats = [
    {
      title: 'Orders',
      count: ordersCount,
      icon: 'cube-outline' as const,
      color: ICON_TINTS.blue,
      screen: 'OrderHistory',
    },
    {
      title: 'RFQs',
      count: rfqsCount,
      icon: 'document-text-outline' as const,
      color: ICON_TINTS.amber,
      screen: 'RFQList',
    },
    {
      title: 'Saved',
      count: wishlistCount,
      icon: 'heart-outline' as const,
      color: ICON_TINTS.red,
      screen: 'Wishlist',
    },
    {
      title: 'Reviews',
      count: reviewsCount,
      icon: 'star-outline' as const,
      color: ICON_TINTS.purple,
      screen: 'OrderHistory',
    },
  ];

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>YOUR ACTIVITY</Text>
      <View style={s.statsGrid}>
        {stats.map((stat, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => navigation.navigate(stat.screen)}
            activeOpacity={0.75}
            style={[
              s.statCard,
              {
                backgroundColor: theme.colors.cardBackground,
                borderColor: theme.colors.cardBorder,
              },
            ]}
          >
            <View style={[s.statIconBg, { backgroundColor: `${stat.color}14` }]}>
              <Ionicons name={stat.icon} size={20} color={stat.color} />
            </View>
            <Text style={[s.statCount, { color: theme.colors.textPrimary }]}>{stat.count}</Text>
            <Text style={[s.statLabel, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {stat.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. REUSABLE MENU GROUP COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function MenuGroup({
  items,
  navigation,
  theme,
  label,
}: {
  items: MenuItem[];
  navigation: any;
  theme: any;
  label: string;
}) {
  if (!items || items.length === 0) return null;

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{label}</Text>
      <View style={[s.menuCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
        {items.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => navigation.navigate(item.screen)}
            style={[
              s.menuRow,
              idx < items.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: theme.colors.border },
            ]}
            activeOpacity={0.65}
          >
            <View style={[s.menuIconCircle, { backgroundColor: `${item.tint}14` }]}>
              <Ionicons name={item.icon} size={20} color={item.tint} />
            </View>
            <View style={s.menuTextCol}>
              <Text style={[s.menuTitle, { color: theme.colors.textPrimary }]}>{item.title}</Text>
              {item.subtitle && (
                <Text style={[s.menuSubtitle, { color: theme.colors.textTertiary }]} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN PROFILE SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export function ProfileScreen({ navigation }: any) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  // Custom hook for user state & counts
  const {
    user,
    ordersCount,
    rfqsCount,
    wishlistCount,
    reviewsCount,
    isLoading,
    isRefreshing,
    error,
    isVendor,
    hasGst,
    refetch,
  } = useAccountSummary();

  // User Metadata
  const name =
    user?.fullName ||
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    'Rajesh Sharma';
  const company = user?.businessProfile?.companyName || 'Apex Construction Ltd';
  const email = user?.email || 'rajesh.sharma@hinchmart.com';
  const phone = user?.phone || '+91 98765 43210';
  const isBusinessRole = user?.accountType === 'business' || user?.accountType === 'contractor' || true;

  // Generate Initials (e.g. Rajesh Sharma -> RS)
  const initials = (() => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  })();

  // Categorized Menus
  const accountMenu: MenuItem[] = [
    {
      title: 'Business Profile',
      icon: 'business-outline',
      screen: 'BusinessProfile',
      tint: ICON_TINTS.blue,
      subtitle: 'Manage company info & GST details',
    },
    {
      title: 'Order History',
      icon: 'receipt-outline',
      screen: 'OrderHistory',
      tint: ICON_TINTS.amber,
      subtitle: 'Track active orders & invoices',
    },
    {
      title: 'Saved Addresses',
      icon: 'location-outline',
      screen: 'Addresses',
      tint: ICON_TINTS.purple,
      subtitle: 'Manage delivery locations',
    },
  ];

  const financeVendorMenu: MenuItem[] = [
    {
      title: 'Business Wallet',
      icon: 'wallet-outline',
      screen: 'Wallet',
      tint: ICON_TINTS.green,
      subtitle: 'Account balance & credit limits',
    },
    ...(isVendor
      ? [
          {
            title: 'Vendor Dashboard',
            icon: 'bar-chart-outline' as const,
            screen: 'VendorDashboard',
            tint: ICON_TINTS.amber,
            subtitle: 'Sales analytics, bids & listings',
          },
        ]
      : []),
    {
      title: 'Equipment Rentals',
      icon: 'construct-outline',
      screen: 'RentalList',
      tint: ICON_TINTS.amber,
      subtitle: 'Heavy machinery fleet rentals',
    },
  ];

  const preferencesMenu: MenuItem[] = [
    {
      title: 'Language & Currency',
      icon: 'globe-outline',
      screen: 'Language',
      tint: ICON_TINTS.purple,
      subtitle: 'Choose your language and currency',
    },
    {
      title: 'Settings & Security',
      icon: 'shield-checkmark-outline',
      screen: 'Settings',
      tint: ICON_TINTS.purple,
      subtitle: 'Account, password & security',
    },
  ];

  const helpLegalMenu: MenuItem[] = [
    {
      title: 'Help & Support',
      icon: 'headset-outline',
      screen: 'HelpSupport',
      tint: ICON_TINTS.blue,
      subtitle: 'Contact HINCH MART support',
    },
    {
      title: 'Privacy Policy',
      icon: 'shield-outline',
      screen: 'PrivacyPolicy',
      tint: ICON_TINTS.purple,
    },
    {
      title: 'About HINCH MART',
      icon: 'information-circle-outline',
      screen: 'About',
      tint: ICON_TINTS.amber,
    },
    {
      title: 'Terms & Conditions',
      icon: 'document-text-outline',
      screen: 'Terms',
      tint: ICON_TINTS.green,
    },
  ];

  const handleSignOutPrompt = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your HINCH MART account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await authStore.logout();
            dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const bottomPadding = Math.max(insets.bottom + 120, 140);

  return (
    <Screen scrollable={false}>
      {/* Header: Logo + My Account */}
      <Header title="My Account" showBack={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scrollContent, { paddingBottom: bottomPadding }]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refetch}
            tintColor={BRAND_GOLD}
            colors={[BRAND_GOLD]}
          />
        }
      >
        {/* Loading State */}
        {isLoading && !isRefreshing && (
          <View style={s.loadingBox}>
            <ActivityIndicator size="small" color={BRAND_GOLD} />
            <Text style={[s.loadingText, { color: theme.colors.textSecondary }]}>
              Refreshing account details...
            </Text>
          </View>
        )}

        {/* Error Banner */}
        {error && (
          <TouchableOpacity onPress={refetch} style={s.errorBanner} activeOpacity={0.8}>
            <Ionicons name="alert-circle" size={18} color="#EF4444" />
            <Text style={s.errorText}>{error} Tap to retry.</Text>
          </TouchableOpacity>
        )}

        {/* ── 1. APPROVED COMPACT PROFILE CARD ───────────────────────────────── */}
        <Card variant="outlined" style={s.compactHeroCard}>
          {/* Top-Right Pencil Edit Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={s.pencilEditBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil-outline" size={18} color="#475569" />
          </TouchableOpacity>

          <View style={s.compactHeroRow}>
            {/* Yellow Initials Avatar with Green Verification Badge */}
            <View style={s.avatarWrap}>
              <View style={s.initialsCircle}>
                <Text style={s.initialsText}>{initials}</Text>
              </View>
              <View style={s.avatarVerifiedBadge}>
                <Ionicons name="checkmark-sharp" size={9} color="#FFFFFF" />
              </View>
            </View>

            {/* Profile Meta Info */}
            <View style={s.compactHeroMeta}>
              <Text style={[s.userName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                {name}
              </Text>

              {company ? (
                <View style={s.metaRow}>
                  <Ionicons name="business-outline" size={13} color="#64748B" />
                  <Text style={[s.userCompanyText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {company}
                  </Text>
                </View>
              ) : null}

              {email ? (
                <View style={s.metaRow}>
                  <Ionicons name="mail-outline" size={13} color="#64748B" />
                  <Text style={[s.contactText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {email}
                  </Text>
                </View>
              ) : null}

              {phone ? (
                <View style={s.metaRow}>
                  <Ionicons name="call-outline" size={13} color="#64748B" />
                  <Text style={[s.contactText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {phone}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Status Badges Row — STRICT SINGLE HORIZONTAL LINE */}
          <View style={s.badgesRow}>
            <View style={[s.pillBadge, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="checkmark" size={10} color="#15803D" />
              <Text numberOfLines={1} style={[s.pillBadgeText, { color: '#15803D' }]}>Verified</Text>
            </View>

            <View style={[s.pillBadge, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="checkmark" size={10} color="#B45309" />
              <Text numberOfLines={1} style={[s.pillBadgeText, { color: '#B45309' }]}>GST Verified</Text>
            </View>

            <View style={[s.pillBadge, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="checkmark" size={10} color="#1D4ED8" />
              <Text numberOfLines={1} style={[s.pillBadgeText, { color: '#1D4ED8' }]}>
                {isVendor ? 'Vendor Account' : 'Business Account'}
              </Text>
            </View>
          </View>
        </Card>

        {/* ── 2. YOUR ACTIVITY (4 CARDS: ORDERS, RFQS, SAVED, REVIEWS) ───────── */}
        <QuickActivityStats
          ordersCount={ordersCount}
          rfqsCount={rfqsCount}
          wishlistCount={wishlistCount}
          reviewsCount={reviewsCount}
          navigation={navigation}
        />

        {/* ── 3. MENU GROUPS ─────────────────────────────────────────────────── */}
        <MenuGroup label="ACCOUNT & ORDERS" items={accountMenu} navigation={navigation} theme={theme} />
        <MenuGroup label="FINANCE & VENDORS" items={financeVendorMenu} navigation={navigation} theme={theme} />
        <MenuGroup label="PREFERENCES" items={preferencesMenu} navigation={navigation} theme={theme} />
        <MenuGroup label="SUPPORT & LEGAL" items={helpLegalMenu} navigation={navigation} theme={theme} />

        {/* ── 4. SIGN OUT BUTTON ─────────────────────────────────────────────── */}
        <View style={s.signOutWrap}>
          <TouchableOpacity
            onPress={handleSignOutPrompt}
            style={s.signOutBtn}
            activeOpacity={0.75}
          >
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={s.signOutText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={[s.appVersionText, { color: theme.colors.textTertiary }]}>
            HINCH MART v1.0.0 (Build 104)
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS SCREEN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export function SettingsScreen({ navigation }: any) {
  const { theme, themeMode, toggleTheme } = useTheme();

  const themeOptions = [
    { mode: 'light', icon: 'sunny' as const, label: 'Light' },
    { mode: 'dark', icon: 'moon' as const, label: 'Dark' },
    { mode: 'system', icon: 'phone-portrait' as const, label: 'System' },
  ];

  return (
    <Screen scrollable>
      <Header title="Settings & Security" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        <Card variant="outlined" style={{ padding: 16, marginBottom: 16, borderRadius: 16 }}>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, marginBottom: 14, color: theme.colors.textPrimary }}>
            Appearance Theme
          </Text>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {themeOptions.map((opt) => (
              <TouchableOpacity
                key={opt.mode}
                onPress={() => {
                  toggleTheme();
                }}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: 'center',
                  backgroundColor: themeMode === opt.mode ? `${theme.colors.primary}20` : theme.colors.surfaceVariant,
                  borderWidth: themeMode === opt.mode ? 1.5 : 0,
                  borderColor: theme.colors.primary,
                }}
              >
                <Ionicons
                  name={opt.icon}
                  size={22}
                  color={themeMode === opt.mode ? theme.colors.primary : theme.colors.textTertiary}
                />
                <Text style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 12,
                  marginTop: 6,
                  color: themeMode === opt.mode ? theme.colors.primary : theme.colors.textPrimary,
                }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      </View>
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLESHEET
// ─────────────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  loadingText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#EF4444',
    flex: 1,
  },

  /* ── 1. Compact Hero Profile Card (Matches Reference Screenshot) ── */
  compactHeroCard: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    ...Platform.select({
      ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  pencilEditBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  compactHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
  },
  initialsCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FDE68A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#D97706',
  },
  avatarVerifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  compactHeroMeta: {
    marginLeft: 16,
    flex: 1,
    paddingRight: 24,
  },
  userName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  userCompanyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13.5,
    flexShrink: 1,
  },
  contactText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
    flexShrink: 1,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 10,
    gap: 3,
    flexShrink: 1,
  },
  pillBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10.5,
  },

  /* ── 2. Sections ── */
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#64748B',
    marginBottom: 10,
    marginLeft: 2,
  },

  /* Stats Grid (4 cards in 1 row, matching reference) */
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCount: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    lineHeight: 22,
  },
  statLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11.5,
    marginTop: 2,
  },

  /* Menu Groups */
  menuCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 70,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  menuSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },

  /* Sign Out */
  signOutWrap: {
    marginTop: 6,
    alignItems: 'center',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    width: '100%',
    gap: 8,
  },
  signOutText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#EF4444',
  },
  appVersionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    marginTop: 12,
  },
});
