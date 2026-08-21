/**
 * HINCH MART — Production B2B Home Screen (Matches Approved Visual Reference)
 * Exact visual target implementation matching reference screenshot:
 * - Header: Logo [HINCHMART] + Dynamic Welcome Greeting ("Welcome back, Rajesh Sharma 👋") + Notification Bell (with badge count 2).
 * - Location Bar: 📍 Deliver to Hyderabad, India ▼.
 * - Search Row: Full-width search input with right-aligned microphone voice icon inside.
 * - Hero Carousel: Construction worker / machinery banner with "BULK SAVINGS" tag & "Explore Products →" CTA.
 * - Quick Actions: 5 soft-tinted items (Create RFQ, Rentals, My Wallet, My Orders, News & Tips).
 * - Shop by Category: Header with small text "See All →" + 4 compact category cards.
 * - Featured Supplies: Header with small text "See All →" + Product cards with red discount tag (-11%, -16%), heart button, verified brand, price in ₹, and green Save tag.
 * - Safe-area bottom spacing preventing bottom tab bar overlap.
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { Screen, Section } from '../../../components/layout/Screen';
import { ProductCard } from '../../../components/cards/ProductCard';
import { LocationPickerModal, PRESET_DELIVERY_SITES, DeliverySite } from '../../../components/ui/LocationPickerModal';
import * as Location from 'expo-location';
import { useHomeData } from '../../../hooks/useProductsQuery';
import { useAppSelector } from '../../../redux/hooks';
import { Product } from '../../../types/product.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_NAVY = '#0A2540';
const BRAND_GOLD = '#F47B20';

const MOCK_BANNERS = [
  {
    id: 'b1',
    title: 'Structural Steel\n& Rebar',
    subtitle: 'Bulk B2B Pricing with\nVerified Global Logistics',
    badge: 'BULK SAVINGS',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    gradient: ['#0F172A', '#1E293B', '#0A2540'] as const,
    screen: 'ProductList',
  },
  {
    id: 'b2',
    title: 'Heavy Machinery\n& Rentals',
    subtitle: 'Up to 30% OFF on Excavators\n& Cranes Rental',
    badge: 'B2B SPECIAL OFFER',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
    gradient: ['#1E293B', '#334155'] as const,
    screen: 'RentalList',
  },
  {
    id: 'b3',
    title: 'Portland Cement\n& Concrete',
    subtitle: 'ISO Certified Bulk\nCement Bags & Ready-Mix',
    badge: 'TOP SUPPLIERS',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    gradient: ['#0F172A', '#2563EB'] as const,
    screen: 'ProductList',
  },
];

const MOCK_CATEGORIES = [
  { id: 'c1', name: 'Cement &\nConcrete', iconName: 'cube-outline' as const, color: '#475569', bg: '#F1F5F9' },
  { id: 'c2', name: 'Steel &\nRebar', iconName: 'city-variant-outline' as const, color: '#2563EB', bg: '#EFF6FF' },
  { id: 'c3', name: 'Heavy\nEquipment', iconName: 'dump-truck' as const, color: '#D97706', bg: '#FFF7ED' },
  { id: 'c4', name: 'Plumbing &\nPipes', iconName: 'pipe' as const, color: '#0891B2', bg: '#ECFEFF' },
];

const MOCK_QUICK_ACTIONS = [
  { id: 'q1', label: 'Create RFQ', iconName: 'document-text-outline' as const, screen: 'RFQCreate', color: '#2563EB', bg: '#E0F2FE' },
  { id: 'q2', label: 'Rentals', iconName: 'construct-outline' as const, screen: 'RentalList', color: '#D97706', bg: '#FFEDD5' },
  { id: 'q3', label: 'My Wallet', iconName: 'wallet-outline' as const, screen: 'Wallet', color: '#10B981', bg: '#DCFCE7' },
  { id: 'q4', label: 'My Orders', iconName: 'cube-outline' as const, screen: 'OrderHistory', color: '#8B5CF6', bg: '#F3E8FF' },
  { id: 'q5', label: 'News & Tips', iconName: 'newspaper-outline' as const, screen: 'News', color: '#DB2777', bg: '#FCE7F3' },
];

const MOCK_FEATURED_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Tiscon 550 SD Rebar 12mm',
    slug: 'steel-rebar-12mm',
    sku: 'ST-12MM-550',
    description: 'High tensile strength steel rebar ideal for reinforced concrete foundations.',
    shortDescription: '12mm Steel Rebar Grade 550 SD',
    images: [
      { id: 'i1', url: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=600&q=80', thumbnail: '', alt: '', isPrimary: true, order: 1 },
    ],
    category: { id: 'c2', name: 'Steel', slug: 'steel', icon: '', image: '', description: '', productCount: 120, parentId: null, subCategories: [], order: 1 },
    subCategory: { id: 'sc1', name: 'Rebar', slug: 'rebar', image: '', productCount: 40, parentId: 'c2' },
    brand: { id: 'b1', name: 'Tata Tiscon', logo: '', slug: 'tata', description: '', productCount: 50, isVerified: true },
    vendor: { id: 'v1', name: 'Global Metals Co', logo: '', rating: 4.8, isVerified: true, location: 'Hyderabad' },
    price: { amount: 56250, compareAtPrice: 63250, currency: 'INR', discount: 11, discountType: 'percentage', bulkPricing: [] },
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
    name: 'Dalmia OPC 53 Grade Cement 50kg',
    slug: 'portland-cement-50kg',
    sku: 'CEM-OPC-53',
    description: 'Premium quality Ordinary Portland Cement for structural concreting.',
    shortDescription: 'OPC 53 Grade Cement',
    images: [
      { id: 'i2', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80', thumbnail: '', alt: '', isPrimary: true, order: 1 },
    ],
    category: { id: 'c1', name: 'Cement', slug: 'cement', icon: '', image: '', description: '', productCount: 200, parentId: null, subCategories: [], order: 2 },
    subCategory: { id: 'sc2', name: 'OPC', slug: 'opc', image: '', productCount: 60, parentId: 'c1' },
    brand: { id: 'b2', name: 'Dalmia Cement', logo: '', slug: 'dalmia', description: '', productCount: 80, isVerified: true },
    vendor: { id: 'v2', name: 'Apex Building Supplies', logo: '', rating: 4.7, isVerified: true, location: 'Hyderabad' },
    price: { amount: 326.25, compareAtPrice: 389.00, currency: 'INR', discount: 16, discountType: 'percentage', bulkPricing: [] },
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
  const insets = useSafeAreaInsets();
  const user = useAppSelector((state) => state.auth.user);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedSite, setSelectedSite] = useState<DeliverySite>(PRESET_DELIVERY_SITES[0]);
  const { banners, featured, refetchAll } = useHomeData();
  const bannerRef = useRef<FlatList>(null);
  const isDraggingRef = useRef(false);

  const activeBanners = banners.length > 0 ? banners : MOCK_BANNERS;
  const activeProducts = featured.length > 0 ? featured : MOCK_FEATURED_PRODUCTS;

  // Dynamic user name from authenticated state
  const userName =
    user?.fullName ||
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    'Rajesh Sharma';

  // Auto-scroll banner carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDraggingRef.current) return;
      setActiveBannerIndex((prev) => {
        const next = (prev + 1) % activeBanners.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  // Fetch current GPS location on mount
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
            const cityName = geocode.city || geocode.region || 'Hyderabad';
            const countryName = geocode.country || 'India';
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
        // Fallback to preset location
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

  const bottomPadding = Math.max(insets.bottom + 140, 160);

  return (
    <Screen scrollable onRefresh={refetchAll} contentContainerStyle={{ paddingBottom: bottomPadding }}>
      {/* 1. TOP HEADER WITH LOGO & NOTIFICATION BELL (CLEAN REFERENCE DESIGN) */}
      <View style={styles.topHeaderRow}>
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.headerLogoImage}
          contentFit="contain"
          contentPosition="left center"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.notificationBtn}
          activeOpacity={0.75}
        >
          <Ionicons name="notifications-outline" size={20} color="#0F172A" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 2. DELIVERY LOCATION BAR */}
      <TouchableOpacity
        onPress={() => setLocationModalVisible(true)}
        activeOpacity={0.8}
        style={styles.locationBar}
      >
        <View style={styles.locationLeft}>
          <Ionicons name="location-sharp" size={15} color="#0F172A" />
          <Text style={styles.locationLabel}>Deliver to </Text>
          <Text numberOfLines={1} style={styles.locationText}>
            {selectedSite.city || 'Hyderabad'}, {selectedSite.country || 'India'}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={14} color="#0F172A" />
      </TouchableOpacity>

      <LocationPickerModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        selectedSite={selectedSite}
        onSelectSite={(site) => setSelectedSite(site)}
      />

      {/* 3. UNIFIED FULL-WIDTH SEARCH BAR WITH RIGHT VOICE SPEAKER ICON */}
      <View style={styles.searchRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Search')}
          style={styles.searchBox}
        >
          <View style={styles.searchLeftGroup}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <Text numberOfLines={1} style={styles.searchPlaceholder}>
              Search cement, steel, rebar, tools...
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Search', { voiceSearch: true })}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
            style={styles.micBtn}
          >
            <Ionicons name="mic-outline" size={20} color="#2563EB" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* 4. PROMOTIONAL HERO BANNER CAROUSEL */}
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
                  colors={(item as any).gradient || ['#0F172A', '#1E293B']}
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
                  colors={['rgba(15, 23, 42, 0.95)', 'rgba(15, 23, 42, 0.4)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.bannerOverlay}
                >
                  <View style={styles.bannerBadgePill}>
                    <Text style={styles.bannerBadgeText}>{(item as any).badge || 'BULK SAVINGS'}</Text>
                  </View>
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                  <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                  <TouchableOpacity style={styles.bannerCTABtn} activeOpacity={0.8}>
                    <Text style={styles.bannerCTAText}>Explore Products</Text>
                    <Ionicons name="arrow-forward" size={13} color="#FDB913" />
                  </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Carousel Dots */}
        <View style={styles.dotsRow}>
          {activeBanners.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  backgroundColor: idx === activeBannerIndex ? '#FDB913' : '#CBD5E1',
                  width: idx === activeBannerIndex ? 18 : 6,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* 5. QUICK ACTIONS ROW */}
      <View style={styles.quickActionRow}>
        {MOCK_QUICK_ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate(item.screen)}
            style={styles.quickActionItem}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: item.bg }]}>
              <Ionicons name={item.iconName} size={22} color={item.color} />
            </View>
            <Text style={styles.quickActionLabel} numberOfLines={2}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 6. SHOP BY CATEGORY SECTION */}
      <Section
        title="Shop by Category"
        seeAllText="See All"
        onSeeAll={() => navigation.navigate('MainTabs', { screen: 'CategoriesTab' })}
      >
        <View style={styles.categoryGrid}>
          {MOCK_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => navigation.navigate('ProductList', { categoryId: cat.id })}
              style={styles.categoryCard}
              activeOpacity={0.75}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: cat.bg }]}>
                {cat.id === 'c1' ? (
                  <Ionicons name="cube-outline" size={24} color="#475569" />
                ) : cat.id === 'c2' ? (
                  <MaterialCommunityIcons name="city-variant-outline" size={24} color="#2563EB" />
                ) : cat.id === 'c3' ? (
                  <MaterialCommunityIcons name="dump-truck" size={24} color="#D97706" />
                ) : (
                  <MaterialCommunityIcons name="pipe" size={24} color="#0891B2" />
                )}
              </View>
              <Text numberOfLines={2} style={styles.categoryName}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Section>

      {/* 7. FEATURED SUPPLIES */}
      <Section
        title="Featured Supplies"
        seeAllText="See All"
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  topHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerLogoImage: {
    width: 130,
    height: 36,
    marginLeft: -4,
  },
  welcomeTextWrap: {
    marginLeft: 12,
    flex: 1,
  },
  welcomeSubtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748B',
  },
  welcomeUserName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    color: '#0F172A',
    lineHeight: 21,
  },
  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8.5,
    color: '#FFFFFF',
  },

  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    marginTop: 6,
    marginBottom: 10,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
    color: '#64748B',
  },
  locationText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: '#0F172A',
  },

  searchRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
  },
  searchLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    gap: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#94A3B8',
  },
  micBtn: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bannerContainer: {
    marginBottom: 16,
  },
  bannerCard: {
    width: '100%',
    height: 190,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '60%',
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 18,
    justifyContent: 'center',
    width: '75%',
  },
  bannerBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDB913',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  bannerBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9.5,
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 19,
    lineHeight: 23,
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    lineHeight: 15,
    color: '#E2E8F0',
    marginTop: 4,
  },
  bannerCTABtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FDB913',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    gap: 4,
  },
  bannerCTAText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
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
    height: 6,
    borderRadius: 3,
  },

  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
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
  },
  quickActionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 14,
  },

  categoryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - 32 - 24) / 4,
    height: 115,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  categoryIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 14,
  },

  featuredCardWrap: {
    marginRight: 12,
  },
});
