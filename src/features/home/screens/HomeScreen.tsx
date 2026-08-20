/**
 * HINCH MART — Premium International Construction Marketplace Home Screen
 * Enhanced hero banners, gradient quick actions, horizontal featured scroll, premium RFQ callout
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { Screen, Header, Section } from '../../../components/layout/Screen';
import { SearchBar } from '../../../components/ui/SearchBar';
import { ProductCard } from '../../../components/cards/ProductCard';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { LocationPickerModal, PRESET_DELIVERY_SITES, DeliverySite } from '../../../components/ui/LocationPickerModal';
import * as Location from 'expo-location';
import { useHomeData } from '../../../hooks/useProductsQuery';
import { Product } from '../../../types/product.types';
import { useAppSelector } from '../../../redux/hooks';
import { selectCartItemCount } from '../../../redux/slices/cartSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 32;

// Hero Banners Mock Data with rich gradient fallbacks
const MOCK_BANNERS = [
  {
    id: 'b1',
    title: 'HEAVY MACHINERY & RENTALS',
    subtitle: 'Up to 30% OFF on Excavators & Cranes Rental',
    badge: 'SPECIAL OFFER',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
    gradient: ['#152238', '#1F3456', '#2A4774'] as const,
    screen: 'RentalList',
    action: 'RentalList',
  },
  {
    id: 'b2',
    title: 'STRUCTURAL STEEL & REBAR',
    subtitle: 'Bulk B2B Pricing with Global Logistics',
    badge: 'B2B BULK SAVINGS',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    gradient: ['#1E293B', '#334155', '#475569'] as const,
    screen: 'ProductList',
    action: 'ProductList',
  },
  {
    id: 'b3',
    title: 'PORTLAND CEMENT & CONCRETE',
    subtitle: 'ISO Certified Bulk Cement Bags & Ready-Mix',
    badge: 'TOP SUPPLIERS',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    gradient: ['#0F172A', '#1E293B', '#3B82F6'] as const,
    screen: 'ProductList',
    action: 'ProductList',
  },
  {
    id: 'b4',
    title: 'POWER TOOLS & SAFETY GEAR',
    subtitle: 'PPE Equipment & Industrial Grade Power Tools',
    badge: 'NEW ARRIVALS',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    gradient: ['#18181B', '#27272A', '#FDB913'] as const,
    screen: 'ProductList',
    action: 'ProductList',
  },
];

const MOCK_CATEGORIES = [
  { id: 'c1', name: 'Cement & Concrete', iconName: 'wall' as const, color: '#475569', gradient: ['#475569', '#64748B'] as const },
  { id: 'c2', name: 'Steel & Rebar', iconName: 'factory' as const, color: '#2563EB', gradient: ['#2563EB', '#3B82F6'] as const },
  { id: 'c3', name: 'Heavy Equipment', iconName: 'dump-truck' as const, color: '#D97706', gradient: ['#D97706', '#F59E0B'] as const },
  { id: 'c4', name: 'Plumbing & Pipes', iconName: 'pipe-wrench' as const, color: '#0891B2', gradient: ['#0891B2', '#06B6D4'] as const },
  { id: 'c5', name: 'Electrical & Cables', iconName: 'lightning-bolt' as const, color: '#CA8A04', gradient: ['#CA8A04', '#EAB308'] as const },
  { id: 'c6', name: 'Paints & Coatings', iconName: 'format-paint' as const, color: '#DB2777', gradient: ['#DB2777', '#EC4899'] as const },
  { id: 'c7', name: 'Power Tools', iconName: 'hammer-wrench' as const, color: '#7C3AED', gradient: ['#7C3AED', '#8B5CF6'] as const },
  { id: 'c8', name: 'Safety Gear (PPE)', iconName: 'hard-hat' as const, color: '#059669', gradient: ['#059669', '#10B981'] as const },
];

const MOCK_QUICK_ACTIONS = [
  { id: 'q1', label: 'Create RFQ', iconName: 'document-text-outline' as const, screen: 'RFQCreate', color: '#3B82F6' },
  { id: 'q2', label: 'Rentals', iconName: 'construct-outline' as const, screen: 'RentalList', color: '#F59E0B' },
  { id: 'q3', label: 'My Wallet', iconName: 'wallet-outline' as const, screen: 'Wallet', color: '#10B981' },
  { id: 'q4', label: 'My Orders', iconName: 'cube-outline' as const, screen: 'OrderHistory', color: '#8B5CF6' },
  { id: 'q5', label: 'News & Tips', iconName: 'newspaper-outline' as const, screen: 'News', color: '#EC4899' },
];

const MOCK_FEATURED_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Grade 50 High-Yield Steel Rebar 12mm',
    slug: 'steel-rebar-12mm',
    sku: 'ST-12MM-50',
    description: 'High tensile strength steel rebar ideal for reinforced concrete foundations.',
    shortDescription: '12mm Steel Rebar Grade 50',
    images: [
      { id: 'i1', url: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=600&q=80', thumbnail: '', alt: '', isPrimary: true, order: 1 },
    ],
    category: { id: 'c2', name: 'Steel', slug: 'steel', icon: '', image: '', description: '', productCount: 120, parentId: null, subCategories: [], order: 1 },
    subCategory: { id: 'sc1', name: 'Rebar', slug: 'rebar', image: '', productCount: 40, parentId: 'c2' },
    brand: { id: 'b1', name: 'Tata Tiscon', logo: '', slug: 'tata', description: '', productCount: 50, isVerified: true },
    vendor: { id: 'v1', name: 'Global Metals Co', logo: '', rating: 4.9, isVerified: true, location: 'Dubai, UAE' },
    price: { amount: 850, compareAtPrice: 950, currency: 'USD', discount: 11, discountType: 'percentage', bulkPricing: [] },
    variants: [],
    specifications: [],
    rating: { average: 4.8, count: 124, distribution: { 1: 0, 2: 2, 3: 5, 4: 20, 5: 97 } },
    reviewCount: 124,
    stock: { available: 500, isInStock: true, lowStockThreshold: 20, isLowStock: false },
    tags: ['steel', 'rebar'],
    isFeatured: true,
    isTrending: true,
    isDealOfDay: false,
    minOrderQuantity: 1,
    maxOrderQuantity: 1000,
    unit: 'Ton',
    weight: 1000,
    weightUnit: 'kg',
    dimensions: { length: 12, width: 0.012, height: 0.012, unit: 'cm' },
    warranty: '10 Years',
    returnPolicy: '14 Days Return',
    buyingGuide: '',
    faqs: [],
    relatedProducts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    name: 'Portland OPC 53 Grade Cement 50kg Bag',
    slug: 'portland-cement-50kg',
    sku: 'CEM-OPC-53',
    description: 'Premium quality Ordinary Portland Cement for structural concreting.',
    shortDescription: 'OPC 53 Grade Cement',
    images: [
      { id: 'i2', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80', thumbnail: '', alt: '', isPrimary: true, order: 1 },
    ],
    category: { id: 'c1', name: 'Cement', slug: 'cement', icon: '', image: '', description: '', productCount: 200, parentId: null, subCategories: [], order: 2 },
    subCategory: { id: 'sc2', name: 'OPC', slug: 'opc', image: '', productCount: 60, parentId: 'c1' },
    brand: { id: 'b2', name: 'UltraTech', logo: '', slug: 'ultratech', description: '', productCount: 80, isVerified: true },
    vendor: { id: 'v2', name: 'Apex Building Supplies', logo: '', rating: 4.7, isVerified: true, location: 'Riyadh, KSA' },
    price: { amount: 7.5, compareAtPrice: 9.0, currency: 'USD', discount: 16, discountType: 'percentage', bulkPricing: [] },
    variants: [],
    specifications: [],
    rating: { average: 4.7, count: 89, distribution: { 1: 0, 2: 1, 3: 3, 4: 15, 5: 70 } },
    reviewCount: 89,
    stock: { available: 2000, isInStock: true, lowStockThreshold: 100, isLowStock: false },
    tags: ['cement', 'opc'],
    isFeatured: true,
    isTrending: false,
    isDealOfDay: true,
    minOrderQuantity: 1,
    maxOrderQuantity: 5000,
    unit: 'Bag',
    weight: 50,
    weightUnit: 'kg',
    dimensions: { length: 60, width: 40, height: 15, unit: 'cm' },
    warranty: 'Standard Storage Warranty',
    returnPolicy: 'Non-returnable',
    buyingGuide: '',
    faqs: [],
    relatedProducts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function HomeScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedSite, setSelectedSite] = useState<DeliverySite>(PRESET_DELIVERY_SITES[0]);
  const { banners, featured, refetchAll } = useHomeData();
  const bannerRef = useRef<FlatList>(null);
  const isDraggingRef = useRef(false);
  const cartCount = useAppSelector(selectCartItemCount);
  const unreadCount = useAppSelector((state) => state.notifications?.unreadCount || 0);

  const activeBanners = banners.length > 0 ? banners : MOCK_BANNERS;
  const activeProducts = featured.length > 0 ? featured : MOCK_FEATURED_PRODUCTS;

  // Auto-scroll banners cleanly using scrollToIndex
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDraggingRef.current) return;
      setActiveBannerIndex((prev) => {
        const next = (prev + 1) % activeBanners.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  // Automatically fetch current GPS location on screen mount
  useEffect(() => {
    let isMounted = true;
    async function fetchAutoLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const [geocode] = await Location.reverseGeocodeAsync({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          if (geocode && isMounted) {
            const cityName = geocode.city || geocode.region || 'Current Location';
            const countryName = geocode.country || '';
            const addressName = geocode.street || geocode.name || 'GPS Location';
            setSelectedSite({
              id: `gps_auto_${Date.now()}`,
              name: `Current Location (${cityName})`,
              address: addressName,
              city: cityName,
              country: countryName,
              type: 'project',
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          }
        }
      } catch (e) {
        // Retain preset location if GPS fails or unavailable
      }
    }
    fetchAutoLocation();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width || SCREEN_WIDTH;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index >= 0 && index < activeBanners.length && index !== activeBannerIndex) {
      setActiveBannerIndex(index);
    }
  };

  const iconSurface = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(21, 34, 56, 0.05)';

  return (
    <Screen scrollable onRefresh={refetchAll}>
      {/* 1. Top Brand Header: Logo on Top Left + Delivery Tag Directly Underneath */}
      <View
        style={[
          styles.topHeaderBar,
          {
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        {/* Left Column: Brand Logo + Delivery Tag Aligned Underneath */}
        <View style={styles.headerLeftCol}>
          <Image
            source={require('../../../../assets/logo.png')}
            style={styles.brandLogo}
            contentFit="contain"
            contentPosition="left center"
          />

          {/* Delivery Location Tag kept directly UNDER the Logo */}
          <TouchableOpacity
            onPress={() => setLocationModalVisible(true)}
            activeOpacity={0.75}
            style={styles.deliveryTagBtn}
          >
            <View style={[styles.locationIconPill, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Ionicons name="location-sharp" size={12} color={theme.colors.primary} />
            </View>
            <View style={styles.deliveryTextCol}>
              <Text style={[styles.deliveryPrefix, { color: theme.colors.textTertiary }]}>
                Deliver to
              </Text>
              <View style={styles.deliveryLocationRow}>
                <Text
                  numberOfLines={1}
                  style={[styles.deliveryLocationName, { color: theme.colors.textPrimary }]}
                >
                  {selectedSite.city ? `${selectedSite.city}, ${selectedSite.country}` : selectedSite.name}
                </Text>
                <Ionicons name="chevron-down" size={11} color={theme.colors.textSecondary} style={{ marginLeft: 2 }} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Right Column: Actions (Notifications, RFQ, Cart) */}
        <View style={styles.headerRightCol}>
          {/* Notifications Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
            style={[styles.headerIconBtn, { backgroundColor: iconSurface }]}
          >
            <Ionicons name="notifications-outline" size={20} color={theme.colors.textPrimary} />
            {unreadCount > 0 && <View style={styles.notificationDot} />}
          </TouchableOpacity>

          {/* Cart Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: 'CartTab' })}
            activeOpacity={0.7}
            style={[styles.headerIconBtn, { backgroundColor: iconSurface }]}
          >
            <Ionicons name="cart-outline" size={20} color={theme.colors.textPrimary} />
            {cartCount > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: '#EF4444' }]}>
                <Text style={styles.cartBadgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Picker Modal */}
      <LocationPickerModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        selectedSite={selectedSite}
        onSelectSite={(site) => setSelectedSite(site)}
      />

      {/* 2. Search & Filter Bar */}
      <View style={styles.searchSectionWrap}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Search')}
          style={[
            styles.searchBarContainer,
            {
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="search" size={18} color={theme.colors.textTertiary} style={styles.searchIcon} />
          <Text style={[styles.searchPlaceholder, { color: theme.colors.textTertiary }]}>
            Search cement, steel rebar, machinery, tools...
          </Text>
          <View style={[styles.searchActionBtn, { backgroundColor: `${theme.colors.primary}18` }]}>
            <Ionicons name="options-outline" size={16} color={theme.colors.navy} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 3. B2B Wholesale Announcement Strip */}
      <View style={styles.tickerWrap}>
        <LinearGradient
          colors={isDark ? ['#1E293B', '#0F172A'] : ['#FFF8E1', '#FFFDE7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.tickerCard, { borderColor: isDark ? '#334155' : '#FFE082' }]}
        >
          <View style={styles.tickerLeft}>
            <Ionicons name="flash" size={14} color="#FDB913" />
            <Text style={[styles.tickerText, { color: isDark ? '#F1F5F9' : '#78350F' }]} numberOfLines={1}>
              <Text style={{ fontFamily: 'Inter_700Bold' }}>B2B Wholesale: </Text>
              Direct factory pricing & fast crane delivery
            </Text>
          </View>
          <View style={styles.tickerBadge}>
            <Text style={styles.tickerBadgeText}>VERIFIED</Text>
          </View>
        </LinearGradient>
      </View>

      {/* 4. Hero Banner Carousel */}
      <View style={styles.bannerContainer}>
        <FlatList
          ref={bannerRef}
          data={activeBanners}
          horizontal
          pagingEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onScrollBeginDrag={() => {
            isDraggingRef.current = true;
          }}
          onScrollEndDrag={() => {
            setTimeout(() => {
              isDraggingRef.current = false;
            }, 2000);
          }}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width: SCREEN_WIDTH, paddingHorizontal: 16 }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate((item as any).screen || 'ProductList')}
                style={styles.bannerCard}
              >
                <LinearGradient
                  colors={(item as any).gradient || ['#152238', '#243352']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.bannerImage}
                    contentFit="cover"
                    transition={300}
                  />
                )}
                <LinearGradient
                  colors={['transparent', 'rgba(15, 23, 42, 0.4)', 'rgba(15, 23, 42, 0.85)']}
                  style={styles.bannerOverlay}
                >
                  <View style={styles.bannerBadgePill}>
                    <Ionicons name="flash" size={10} color="#FDB913" />
                    <Text style={styles.bannerBadgeText}>{(item as any).badge || 'SPECIAL OFFER'}</Text>
                  </View>
                  <Text style={styles.bannerTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.bannerSubtitle} numberOfLines={2}>{item.subtitle}</Text>
                  <View style={styles.bannerCTA}>
                    <Text style={styles.bannerCTAText}>Explore Catalog</Text>
                    <Ionicons name="arrow-forward" size={13} color="#FDB913" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Carousel Pagination Dots */}
        <View style={styles.dotsRow}>
          {activeBanners.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    idx === activeBannerIndex
                      ? theme.colors.primary
                      : isDark
                      ? 'rgba(255,255,255,0.25)'
                      : 'rgba(21,34,56,0.2)',
                  width: idx === activeBannerIndex ? 22 : 6,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* 5. Quick Actions Hub */}
      <View style={styles.quickActionRow}>
        {MOCK_QUICK_ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate(item.screen)}
            style={styles.quickActionItem}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.quickActionIcon,
                {
                  backgroundColor: `${item.color}14`,
                  borderColor: `${item.color}30`,
                },
              ]}
            >
              <Ionicons name={item.iconName} size={22} color={item.color} />
            </View>
            <Text style={[styles.quickActionLabel, { color: theme.colors.textPrimary }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 6. Explore Categories (Clean 4x2 Grid) */}
      <Section
        title="Explore Categories"
        subtitle="Sourced from verified global manufacturers"
        onSeeAll={() => navigation.navigate('MainTabs', { screen: 'CategoriesTab' })}
      >
        <View style={styles.categoryGrid}>
          {MOCK_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => navigation.navigate('ProductList', { categoryId: cat.id })}
              style={[
                styles.categoryCard,
                {
                  backgroundColor: theme.colors.cardBackground,
                  borderColor: theme.colors.cardBorder,
                  ...(Platform.OS === 'ios'
                    ? { shadowColor: cat.color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }
                    : { elevation: 1 }),
                },
              ]}
              activeOpacity={0.75}
            >
              <LinearGradient
                colors={[`${cat.color}18`, `${cat.color}08`]}
                style={styles.categoryIconCircle}
              >
                <MaterialCommunityIcons name={cat.iconName} size={24} color={cat.color} />
              </LinearGradient>
              <Text
                numberOfLines={2}
                style={[styles.categoryName, { color: theme.colors.textPrimary }]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Section>

      {/* 7. Featured Products — Horizontal Scroll */}
      <Section
        title="Featured Construction Supplies"
        subtitle="Wholesale volume discounts & direct site delivery"
        onSeeAll={() => navigation.navigate('ProductList', { isFeatured: true })}
      >
        <FlatList
          data={activeProducts}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }: { item: any }) => (
            <View style={styles.featuredCardWrap}>
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                style={{ width: SCREEN_WIDTH * 0.44, marginBottom: 0 }}
              />
            </View>
          )}
        />
      </Section>

      {/* 8. RFQ Callout Banner */}
      <View style={styles.rfqCalloutWrap}>
        <LinearGradient
          colors={isDark ? ['#1E293B', '#0F172A'] : ['#152238', '#1F3456']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rfqCalloutCard}
        >
          {/* Gold accent stripe */}
          <View style={styles.rfqAccentStripe} />

          <View style={styles.rfqContent}>
            <View style={styles.rfqIconCircle}>
              <Ionicons name="document-text" size={24} color="#FDB913" />
            </View>
            <View style={styles.rfqTextWrapper}>
              <Text style={styles.rfqTitle}>Need Custom B2B Quotations?</Text>
              <Text style={styles.rfqSub}>
                Submit your Bill of Quantities (BOQ) and receive competitive bids within 24 hours.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('RFQCreate')}
            style={styles.rfqBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.rfqBtnText}>Post RFQ Now</Text>
            <Ionicons name="arrow-forward" size={16} color="#152238" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* 9. Trust & Assurance Section */}
      <View style={[styles.trustSection, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
        <Text style={[styles.trustSectionTitle, { color: theme.colors.textPrimary }]}>
          Why Contractors Trust HINCH MART
        </Text>
        <View style={styles.trustGrid}>
          <View style={styles.trustItem}>
            <View style={[styles.trustIconWrap, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Ionicons name="shield-checkmark" size={18} color={theme.colors.navy} />
            </View>
            <Text style={[styles.trustItemTitle, { color: theme.colors.textPrimary }]}>Verified Suppliers</Text>
            <Text style={[styles.trustItemDesc, { color: theme.colors.textSecondary }]}>
              100% ISO & ASTM certified building materials
            </Text>
          </View>

          <View style={styles.trustItem}>
            <View style={[styles.trustIconWrap, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Ionicons name="car" size={18} color={theme.colors.navy} />
            </View>
            <Text style={[styles.trustItemTitle, { color: theme.colors.textPrimary }]}>Site Delivery</Text>
            <Text style={[styles.trustItemDesc, { color: theme.colors.textSecondary }]}>
              Direct crane and trailer unloading at project sites
            </Text>
          </View>

          <View style={styles.trustItem}>
            <View style={[styles.trustIconWrap, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Ionicons name="card" size={18} color={theme.colors.navy} />
            </View>
            <Text style={[styles.trustItemTitle, { color: theme.colors.textPrimary }]}>B2B Credit Terms</Text>
            <Text style={[styles.trustItemDesc, { color: theme.colors.textSecondary }]}>
              Flexible 30 to 60-day credit for verified contractors
            </Text>
          </View>

          <View style={styles.trustItem}>
            <View style={[styles.trustIconWrap, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Ionicons name="headset" size={18} color={theme.colors.navy} />
            </View>
            <Text style={[styles.trustItemTitle, { color: theme.colors.textPrimary }]}>Dedicated Support</Text>
            <Text style={[styles.trustItemDesc, { color: theme.colors.textSecondary }]}>
              24/7 technical team & key account management
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // Top Header Bar
  topHeaderBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
  },
  headerLeftCol: {
    flex: 1,
    paddingRight: 12,
  },
  brandLogo: {
    width: 140,
    height: 32,
  },
  deliveryTagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    alignSelf: 'flex-start',
    gap: 6,
  },
  locationIconPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryTextCol: {
    flexShrink: 1,
  },
  deliveryPrefix: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    lineHeight: 12,
  },
  deliveryLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryLocationName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    maxWidth: 190,
  },
  headerRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 2,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
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
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
  },

  // Search Section
  searchSectionWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  searchActionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  // Ticker / Wholesale Strip
  tickerWrap: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  tickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
    paddingRight: 8,
  },
  tickerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    flex: 1,
  },
  tickerBadge: {
    backgroundColor: '#FDB913',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tickerBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    color: '#152238',
    letterSpacing: 0.5,
  },

  // Hero Banners
  bannerContainer: {
    marginTop: 6,
    marginBottom: 10,
    position: 'relative',
  },
  bannerCard: {
    width: '100%',
    height: 200,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'flex-end',
  },
  bannerBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(253, 185, 19, 0.4)',
  },
  bannerBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: '#FDB913',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  bannerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#E2E8F0',
    marginTop: 2,
  },
  bannerCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  bannerCTAText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#FDB913',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 5,
  },
  dot: {
    height: 5,
    borderRadius: 2.5,
  },

  // Quick Action Grid
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 14,
  },
  quickActionItem: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - 32) / 5,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
  },
  quickActionLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 13,
  },

  // Categories
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '23%',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Featured
  featuredCardWrap: {
    marginRight: 12,
  },

  // RFQ Callout
  rfqCalloutWrap: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 18,
    overflow: 'hidden',
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#152238', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16 }
      : { elevation: 4 }),
  },
  rfqCalloutCard: {
    padding: 18,
    borderRadius: 18,
    overflow: 'hidden',
  },
  rfqAccentStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FDB913',
  },
  rfqContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  rfqIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(253, 185, 19, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rfqTextWrapper: {
    flex: 1,
  },
  rfqTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  rfqSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  rfqBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FDB913',
    gap: 6,
  },
  rfqBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    color: '#152238',
  },

  // Trust Section
  trustSection: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  trustSectionTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    marginBottom: 14,
    textAlign: 'center',
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  trustItem: {
    width: '48%',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  trustIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  trustItemTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    marginBottom: 2,
  },
  trustItemDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    lineHeight: 14,
  },
});
