/**
 * HINCH MART — Premium Floating Glassmorphic Bottom Tab Navigator
 * Ultra-modern glassy translucent finish with BlurView, gold sheen border, and glow pills
 */
import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabParamList } from './types';
import { useTheme } from '../theme';
import { useAppSelector } from '../redux/hooks';
import { selectCartItemCount } from '../redux/slices/cartSlice';

import { HomeScreen } from '../features/home/screens/HomeScreen';
import { CategoriesScreen } from '../features/products/screens/CategoriesScreen';
import { RFQListScreen } from '../features/rfq/screens/RFQListScreen';
import { CartScreen } from '../features/cart/screens/CartScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Custom Glassy Floating Tab Bar Component
function CustomGlassyTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const cartCount = useAppSelector(selectCartItemCount);

  const bottomMargin = insets.bottom > 0 ? insets.bottom + 4 : 12;

  return (
    <View style={[styles.floatingWrapper, { bottom: bottomMargin }]} pointerEvents="box-none">
      <View style={styles.glassContainer}>
        {/* Real-time Frosted Glass Blur Background */}
        <BlurView
          intensity={Platform.OS === 'ios' ? 85 : 95}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Translucent Glass Shimmer Gradient Overlay */}
        <LinearGradient
          colors={
            isDark
              ? ['rgba(30, 41, 59, 0.75)', 'rgba(15, 23, 42, 0.85)']
              : ['rgba(255, 255, 255, 0.85)', 'rgba(248, 250, 252, 0.75)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Gold Sheen Top Border Highlight */}
        <LinearGradient
          colors={['rgba(253, 185, 19, 0.6)', 'rgba(253, 185, 19, 0.1)', 'rgba(253, 185, 19, 0.6)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.goldSheenBorder}
        />

        {/* Tab Buttons Row */}
        <View style={styles.tabsRow}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            let iconName: keyof typeof Ionicons.glyphMap = 'home';
            let outlineName: keyof typeof Ionicons.glyphMap = 'home-outline';

            if (route.name === 'HomeTab') {
              iconName = 'home';
              outlineName = 'home-outline';
            } else if (route.name === 'CategoriesTab') {
              iconName = 'grid';
              outlineName = 'grid-outline';
            } else if (route.name === 'RFQTab') {
              iconName = 'document-text';
              outlineName = 'document-text-outline';
            } else if (route.name === 'CartTab') {
              iconName = 'bag-handle';
              outlineName = 'bag-handle-outline';
            } else if (route.name === 'ProfileTab') {
              iconName = 'person-circle';
              outlineName = 'person-circle-outline';
            }

            const isCart = route.name === 'CartTab';

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                activeOpacity={0.7}
                style={styles.tabItem}
              >
                <View
                  style={[
                    styles.iconPill,
                    isFocused && {
                      backgroundColor: 'rgba(253, 185, 19, 0.18)',
                      borderColor: 'rgba(253, 185, 19, 0.4)',
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Ionicons
                    name={isFocused ? iconName : outlineName}
                    size={isFocused ? 21 : 19}
                    color={isFocused ? theme.colors.primary : theme.colors.textTertiary}
                  />

                  {/* Cart Count Badge */}
                  {isCart && cartCount > 0 && (
                    <View style={[styles.cartBadge, { backgroundColor: theme.colors.danger }]}>
                      <Text style={styles.cartBadgeText}>{cartCount}</Text>
                    </View>
                  )}
                </View>

                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused ? theme.colors.primary : theme.colors.textTertiary,
                      fontFamily: isFocused ? 'Inter_700Bold' : 'Inter_500Medium',
                    },
                  ]}
                >
                  {label}
                </Text>

                {/* Active Indicator Glow Dot */}
                {isFocused && <View style={[styles.glowDot, { backgroundColor: theme.colors.primary }]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomGlassyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="CategoriesTab" component={CategoriesScreen} options={{ tabBarLabel: 'Categories' }} />
      <Tab.Screen name="RFQTab" component={RFQListScreen} options={{ tabBarLabel: 'RFQ' }} />
      <Tab.Screen name="CartTab" component={CartScreen} options={{ tabBarLabel: 'Cart' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: 'Account' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    elevation: 24,
    shadowColor: '#090D16',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
  },
  glassContainer: {
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: 'rgba(253, 185, 19, 0.4)',
    height: 66,
  },
  goldSheenBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
    paddingHorizontal: 2,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  iconPill: {
    width: 48,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
  glowDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 2,
    shadowColor: '#FDB913',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
  },
});
