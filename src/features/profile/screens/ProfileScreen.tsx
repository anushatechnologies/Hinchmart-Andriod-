/**
 * HINCH MART — Premium Profile Screen & Settings Screen
 * Enhanced gradient hero, elevated stats, accent-bar menu items, refined typography
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Avatar } from '../../../components/ui/Badge';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { logout } from '../../../redux/slices/authSlice';
import { setThemeMode } from '../../../redux/slices/themeSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Icon colors for each menu group
const ICON_TINTS = {
  orders: '#3B82F6',
  finance: '#10B981',
  vendor: '#F59E0B',
  settings: '#8B5CF6',
  danger: '#EF4444',
};

interface MenuItem {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: string;
  tint: string;
  subtitle?: string;
}

const ACCOUNT_MENU: MenuItem[] = [
  { title: 'My Business Profile', icon: 'briefcase', screen: 'BusinessProfile', tint: ICON_TINTS.orders, subtitle: 'Company info & documents' },
  { title: 'Order History', icon: 'receipt-outline', screen: 'OrderHistory', tint: ICON_TINTS.orders, subtitle: 'Track orders & invoices' },
  { title: 'Saved Addresses', icon: 'location', screen: 'Addresses', tint: ICON_TINTS.orders, subtitle: 'Delivery locations' },
];

const FINANCE_MENU: MenuItem[] = [
  { title: 'Business Wallet', icon: 'wallet', screen: 'Wallet', tint: ICON_TINTS.finance, subtitle: 'Balance & transactions' },
  { title: 'Vendor Dashboard', icon: 'bar-chart', screen: 'VendorDashboard', tint: ICON_TINTS.vendor, subtitle: 'Sales analytics' },
  { title: 'Equipment Rentals', icon: 'construct', screen: 'RentalList', tint: ICON_TINTS.vendor, subtitle: 'Manage active rentals' },
];

const PREFERENCES_MENU: MenuItem[] = [
  { title: 'Language & Currency', icon: 'globe', screen: 'Language', tint: ICON_TINTS.settings },
  { title: 'Settings & Security', icon: 'shield-checkmark', screen: 'Settings', tint: ICON_TINTS.settings },
];

const LEGAL_MENU: MenuItem[] = [
  { title: 'Help & Support', icon: 'call', screen: 'HelpSupport', tint: ICON_TINTS.orders, subtitle: '+91 8388899999 / support@hinchmart.com' },
  { title: 'Privacy Policy', icon: 'shield-checkmark-outline', screen: 'PrivacyPolicy', tint: ICON_TINTS.settings },
  { title: 'About HINCH MART', icon: 'information-circle-outline', screen: 'About', tint: ICON_TINTS.vendor },
  { title: 'Terms & Conditions', icon: 'document-text-outline', screen: 'Terms', tint: ICON_TINTS.finance },
];

// Profile Stats Card — Enhanced with interactive TouchableOpacity navigation
function StatsRow({ theme, navigation }: { theme: any; navigation: any }) {
  const stats = [
    { label: 'Orders', value: '24', icon: 'cube' as const, color: '#3B82F6', screen: 'OrderHistory' },
    { label: 'RFQs', value: '8', icon: 'document-text' as const, color: '#F59E0B', screen: 'RFQList' },
    { label: 'Saved', value: '15', icon: 'heart' as const, color: '#EF4444', screen: 'ProductList' },
    { label: 'Reviews', value: '12', icon: 'star' as const, color: '#10B981', screen: 'OrderHistory' },
  ];

  return (
    <View style={statsStyles.row}>
      {stats.map((stat, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => navigation.navigate(stat.screen)}
          activeOpacity={0.75}
          style={[
            statsStyles.statItem,
            {
              backgroundColor: theme.colors.cardBackground,
              ...(Platform.OS === 'ios'
                ? { shadowColor: stat.color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }
                : { elevation: 2 }),
            },
          ]}
        >
          <View style={[statsStyles.statIconBg, { backgroundColor: `${stat.color}18` }]}>
            <Ionicons name={stat.icon} size={18} color={stat.color} />
          </View>
          <Text style={[statsStyles.statValue, { color: theme.colors.textPrimary }]}>{stat.value}</Text>
          <Text style={[statsStyles.statLabel, { color: theme.colors.textTertiary }]}>{stat.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const statsStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    gap: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
});

// Menu Group Card — Clean alignment with left accent indicator
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
  return (
    <View style={menuStyles.group}>
      <Text style={[menuStyles.groupLabel, { color: theme.colors.textTertiary }]}>{label}</Text>
      <View style={[menuStyles.card, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
        {items.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => navigation.navigate(item.screen)}
            style={[
              menuStyles.row,
              idx < items.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: theme.colors.border },
            ]}
            activeOpacity={0.6}
          >
            {/* Left accent bar on card edge */}
            <View style={[menuStyles.accentBar, { backgroundColor: item.tint }]} />

            <View style={[menuStyles.iconCircle, { backgroundColor: `${item.tint}14` }]}>
              <Ionicons name={item.icon} size={18} color={item.tint} />
            </View>
            <View style={menuStyles.textCol}>
              <Text style={[menuStyles.title, { color: theme.colors.textPrimary }]}>{item.title}</Text>
              {item.subtitle && (
                <Text style={[menuStyles.subtitle, { color: theme.colors.textTertiary }]}>{item.subtitle}</Text>
              )}
            </View>
            <View style={[menuStyles.chevronCircle, { backgroundColor: `${theme.colors.textTertiary}12` }]}>
              <Ionicons name="chevron-forward" size={14} color={theme.colors.textTertiary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const menuStyles = StyleSheet.create({
  group: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  groupLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 18,
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    position: 'relative',
    direction: 'ltr',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 3.5,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginLeft: 4,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export function ProfileScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const name = user?.fullName || 'John Doe';
  const company = user?.businessProfile?.companyName || 'Apex Construction Ltd';
  const email = user?.email || 'john@apexconstruction.com';

  const gradientColors = isDark
    ? ['#152238', '#1C2A42', '#243352'] as const
    : ['#152238', '#1A3050', '#223D60'] as const;

  const handleSignOut = () => {
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <Screen scrollable>
      <Header
        title="My Account"
        showBack={false}
      />

      {/* Profile Hero Card with Gradient */}
      <View style={pStyles.heroCard}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={pStyles.gradientBg}
        >
          {/* Gold accent stripe */}
          <View style={pStyles.heroAccentStripe} />

          <View style={pStyles.heroRow}>
            <View style={pStyles.avatarRing}>
              <Avatar name={name} size={64} />
            </View>
            <View style={pStyles.heroMeta}>
              <Text style={pStyles.heroName}>{name}</Text>
              <Text style={pStyles.heroCompany}>{company}</Text>
              <Text style={pStyles.heroEmail}>{email}</Text>
            </View>
            <TouchableOpacity
              style={pStyles.editBtn}
              onPress={() => navigation.navigate('BusinessProfile', { openEdit: true })}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={18} color="#FDB913" />
            </TouchableOpacity>
          </View>

          <View style={pStyles.badgeRow}>
            <Badge label="VERIFIED B2B BUYER" variant="success" size="sm" />
            <View style={pStyles.memberChip}>
              <Ionicons name="diamond" size={12} color="#FDB913" />
              <Text style={pStyles.memberText}>Gold Member</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Stats Row */}
      <StatsRow theme={theme} navigation={navigation} />

      {/* Menu Groups */}
      <MenuGroup label="Account & Orders" items={ACCOUNT_MENU} navigation={navigation} theme={theme} />
      <MenuGroup label="Finance & Vendors" items={FINANCE_MENU} navigation={navigation} theme={theme} />
      <MenuGroup label="Preferences" items={PREFERENCES_MENU} navigation={navigation} theme={theme} />
      <MenuGroup label="Support & Legal" items={LEGAL_MENU} navigation={navigation} theme={theme} />

      {/* Sign Out */}
      <View style={pStyles.logoutSection}>
        <TouchableOpacity
          onPress={handleSignOut}
          style={[pStyles.logoutBtn, { borderColor: `${ICON_TINTS.danger}40`, backgroundColor: `${ICON_TINTS.danger}08` }]}
          activeOpacity={0.6}
        >
          <Ionicons name="log-out-outline" size={20} color={ICON_TINTS.danger} />
          <Text style={[pStyles.logoutText, { color: ICON_TINTS.danger }]}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[pStyles.versionText, { color: theme.colors.textTertiary }]}>
          HINCH MART v1.0.0
        </Text>
      </View>
    </Screen>
  );
}

const pStyles = StyleSheet.create({
  heroCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 22,
    overflow: 'hidden',
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#152238', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16 }
      : { elevation: 6 }),
  },
  gradientBg: {
    padding: 22,
    overflow: 'hidden',
  },
  heroAccentStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FDB913',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    direction: 'ltr',
  },
  avatarRing: {
    borderWidth: 2.5,
    borderColor: 'rgba(253, 185, 19, 0.6)',
    borderRadius: 36,
    padding: 2,
  },
  heroMeta: {
    marginLeft: 14,
    flex: 1,
  },
  heroName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  heroCompany: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  heroEmail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  editBtn: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: 'rgba(253, 185, 19, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 10,
    direction: 'ltr',
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(253, 185, 19, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  memberText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#FDB913',
  },
  logoutSection: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 40,
    alignItems: 'center',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    borderWidth: 1,
    width: '100%',
    gap: 8,
  },
  logoutText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  versionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 16,
  },
});

export function SettingsScreen({ navigation }: any) {
  const { theme, themeMode, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();

  const themeOptions = [
    { mode: 'light', icon: 'sunny' as const, label: 'Light' },
    { mode: 'dark', icon: 'moon' as const, label: 'Dark' },
    { mode: 'system', icon: 'phone-portrait' as const, label: 'System' },
  ];

  return (
    <Screen scrollable>
      <Header title="Settings" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        <Card variant="outlined" style={{ padding: 16, marginBottom: 16 }}>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 14, color: theme.colors.textPrimary }}>
            Appearance
          </Text>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {themeOptions.map((opt) => (
              <TouchableOpacity
                key={opt.mode}
                onPress={() => {
                  dispatch(setThemeMode(opt.mode as any));
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
