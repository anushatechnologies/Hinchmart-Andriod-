/**
 * HINCH MART — Screen, Header & Section Layout Components
 * Enhanced with refined header styling, improved section typography, and subtle shadow depths
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ViewStyle,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useAppSelector } from '../../redux/hooks';
import { selectCartItemCount } from '../../redux/slices/cartSlice';

// Screen Wrapper Component
export interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export function Screen({
  children,
  scrollable = true,
  onRefresh,
  refreshing = false,
  style,
  contentContainerStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.screenBase,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
        translucent
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex1}
      >
        {scrollable ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.colors.primary}
                  colors={[theme.colors.primary]}
                />
              ) : undefined
            }
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex1, contentContainerStyle]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

// Premium Header Icon Button
function HeaderIconButton({
  name,
  onPress,
  color,
  size = 20,
  badge,
  badgeColor,
  surfaceColor,
}: {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  color: string;
  size?: number;
  badge?: number;
  badgeColor?: string;
  surfaceColor: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.headerIconCircle, { backgroundColor: surfaceColor }]}
    >
      <Ionicons name={name} size={size} color={color} />
      {badge != null && badge > 0 && (
        <View style={[styles.cartBadge, { backgroundColor: badgeColor || '#EF4444' }]}>
          <Text style={styles.cartBadgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// Top App Header Component
export interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showSearch?: boolean;
  onSearchPress?: () => void;
  showCart?: boolean;
  onCartPress?: () => void;
  showNotification?: boolean;
  onNotificationPress?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export function Header({
  title,
  showBack = false,
  onBackPress,
  showSearch = false,
  onSearchPress,
  showCart = false,
  onCartPress,
  showNotification = false,
  onNotificationPress,
  rightAction,
  style,
}: HeaderProps) {
  const { theme, isDark } = useTheme();
  const cartCount = useAppSelector(selectCartItemCount);
  const iconSurface = `${theme.colors.textPrimary}0D`;

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: isDark ? 'rgba(22, 27, 34, 0.96)' : 'rgba(255, 255, 255, 0.97)',
          borderBottomColor: theme.colors.border,
          ...(Platform.OS === 'ios'
            ? {
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.2 : 0.04,
                shadowRadius: 8,
              }
            : { elevation: 2 }),
        },
        style,
      ]}
    >
      <View style={styles.headerLeft}>
        {showBack && (
          <HeaderIconButton
            name="chevron-back"
            onPress={onBackPress}
            color={theme.colors.textPrimary}
            surfaceColor={iconSurface}
          />
        )}

        {/* App Logo & Title Brand Container */}
        {!title ? (
          // Main Home Screen — Full Brand Logo
          <View style={styles.brandContainer}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.headerLogoImage}
              contentFit="contain"
              contentPosition="left center"
            />
          </View>
        ) : (
          // All Other Screens — Compact Brand App Icon + Screen Title
          <View style={styles.brandTitleContainer}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.headerAppIcon}
              contentFit="cover"
            />
            <Text
              numberOfLines={1}
              style={[styles.headerTitle, { color: theme.colors.textPrimary }]}
            >
              {title}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.headerRight}>
        {showSearch && (
          <HeaderIconButton name="search" onPress={onSearchPress} color={theme.colors.textPrimary} surfaceColor={iconSurface} />
        )}

        {showNotification && (
          <HeaderIconButton name="notifications-outline" onPress={onNotificationPress} color={theme.colors.textPrimary} surfaceColor={iconSurface} />
        )}

        {rightAction}
      </View>
    </View>
  );
}

// Section Component
export interface SectionProps {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
  seeAllText?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Section({
  title,
  subtitle,
  onSeeAll,
  seeAllText = 'See All',
  children,
  style,
}: SectionProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.sectionContainer, style]}>
      <View style={styles.sectionHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>

        {onSeeAll && (
          <TouchableOpacity
            onPress={onSeeAll}
            style={[styles.seeAllBtn, { backgroundColor: `${theme.colors.primary}12` }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>{seeAllText}</Text>
            <Ionicons name="arrow-forward" size={13} color={theme.colors.primary} style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        )}
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screenBase: {
    flex: 1,
    direction: 'ltr',
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    direction: 'ltr',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
    gap: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 38,
  },
  headerLogoImage: {
    width: 142,
    height: 36,
  },
  brandTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  headerAppIcon: {
    width: 26,
    height: 26,
    borderRadius: 7,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
  },
  sectionContainer: {
    marginVertical: 14,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
  sectionSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  seeAllText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
});
