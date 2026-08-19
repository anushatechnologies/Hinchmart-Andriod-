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

  return (
    <Screen scrollable onRefresh={refetchAll}>
      {/* 1. App Header (Logo + Cart/Notifications) */}
      <Header
        showNotification
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {/* 2. Delivery Location & B2B Wholesale Selector */}
      <TouchableOpacity
        onPress={() => setLocationModalVisible(true)}
        activeOpacity={0.8}
        style={[styles.locationBar, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}
      >
        <View style={styles.locationLeft}>
          <Ionicons name="location-sharp" size={14} color={theme.colors.primary} />
          <Text style={[styles.locationLabel, { color: theme.colors.textSecondary }]}>Deliver to:</Text>
          <Text numberOfLines={1} style={[styles.locationText, { color: theme.colors.textPrimary, maxWidth: 160 }]}>
            {selectedSite.city}, {selectedSite.country}
          </Text>
          <Ionicons name="chevron-down" size={12} color={theme.colors.textSecondary} />
        </View>
        <View style={[styles.wholesaleBadge, { backgroundColor: `${theme.colors.primary}18` }]}>
          <Ionicons name="shield-checkmark" size={10} color={theme.colors.navy} />
          <Text style={[styles.wholesaleText, { color: theme.colors.navy }]}>B2B Verified</Text>
        </View>
      </TouchableOpacity>

      <LocationPickerModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        selectedSite={selectedSite}
        onSelectSite={(site) => setSelectedSite(site)}
      />

      {/* Search Bar Header — taps navigate to Search screen */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Search')}
        style={styles.searchHeader}
      >
        <View pointerEvents="none" style={{ width: '100%' }}>
          <SearchBar
            value=""
            onChangeText={() => {}}
            placeholder="Search cement, steel, tools..."
          />
        </View>
      </TouchableOpacity>

      {/* Hero Banner Carousel */}
      <View style={styles.bannerContainer}>
        <FlatList
          ref={bannerRef}
          data={activeBanners}
          horizontal
          pagingEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onScrollBeginDrag={() => { isDraggingRef.current = true; }}
          onScrollEndDrag={() => {
            setTimeout(() => { isDraggingRef.current = false; }, 2000);
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
                  colors={['transparent', 'rgba(15, 23, 42, 0.65)']}
                  style={styles.bannerOverlay}
                >
                  <View style={styles.bannerBadgeRow}>
                    <View style={styles.bannerBadgePill}>
                      <Ionicons name="flash" size={10} color="#FDB913" />
                      <Text style={styles.bannerBadgeText}>{(item as any).badge || 'SPECIAL OFFER'}</Text>
                    </View>
                  </View>
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                  <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                  <View style={styles.bannerCTA}>
                    <Text style={styles.bannerCTAText}>Explore Now</Text>
                    <Ionicons name="arrow-forward" size={14} color="#FDB913" />
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
                  backgroundColor: idx === activeBannerIndex ? theme.colors.primary : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(21,34,56,0.2)',
                  width: idx === activeBannerIndex ? 22 : 6,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Quick Action Grid */}
      <View style={styles.quickActionRow}>
        {MOCK_QUICK_ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate(item.screen)}
            style={styles.quickActionItem}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${item.color}14` }]}>
              <Ionicons name={item.iconName} size={22} color={item.color} />
            </View>
            <Text style={[styles.quickActionLabel, { color: theme.colors.textPrimary }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Categories Section */}
      <Section
        title="Explore Categories"
        subtitle="Sourced from verified manufacturers"
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
                colors={[`${cat.color}12`, `${cat.color}06`]}
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

      {/* Featured Products — Horizontal Scroll */}
      <Section
        title="Featured Construction Supplies"
        subtitle="B2B volume discounts available"
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

      {/* RFQ Callout Banner */}
      <View style={styles.rfqCalloutWrap}>
        <LinearGradient
          colors={isDark ? ['#1C2333', '#152238'] : ['#152238', '#1A3050']}
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
                Submit an RFQ and receive quotes from global suppliers within 24 hours.
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 0.5,
    marginTop: 8,
    marginBottom: 4,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  locationText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  wholesaleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  wholesaleText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bannerContainer: {
    marginVertical: 6,
    position: 'relative',
  },
  bannerCard: {
    width: '100%',
    height: 210,
    borderRadius: 20,
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
    padding: 20,
    justifyContent: 'flex-end',
  },
  bannerBadgeRow: {
    position: 'absolute',
    top: 14,
    left: 14,
  },
  bannerBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(253, 185, 19, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(253, 185, 19, 0.35)',
  },
  bannerBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: '#FDB913',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 8,
  },
  bannerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#E2E8F0',
    marginTop: 3,
  },
  bannerCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
    marginTop: 12,
    gap: 5,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    marginVertical: 18,
  },
  quickActionItem: {
    alignItems: 'center',
    width: 68,
  },
  quickActionIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    textAlign: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 6,
  },
  categoryCard: {
    flex: 1,
    minWidth: '22%',
    maxWidth: '24%',
    paddingHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
    fontSize: 10.5,
    textAlign: 'center',
    lineHeight: 14,
  },
  featuredCardWrap: {
    marginRight: 12,
  },
  // RFQ Callout
  rfqCalloutWrap: {
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#152238', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16 }
      : { elevation: 6 }),
  },
  rfqCalloutCard: {
    padding: 20,
    borderRadius: 20,
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
    marginBottom: 16,
  },
  rfqIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(253, 185, 19, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rfqTextWrapper: {
    flex: 1,
  },
  rfqTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  rfqSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  rfqBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FDB913',
    gap: 8,
  },
  rfqBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: '#152238',
  },
});
