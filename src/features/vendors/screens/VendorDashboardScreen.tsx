/**
 * HINCH MART — Vendor Dashboard, Equipment Rental System & Supplier Profile
 * Fully responsive with interactive availability checking, live rental quotations, and booking modals
 */
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatPrice } from '../../../utils';

// ==========================================
// 1. VENDOR DASHBOARD SCREEN
// ==========================================
export function VendorDashboardScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [selectedStat, setSelectedStat] = useState<{ title: string; value: string; details: string[] } | null>(null);

  const handleOpenStatDetails = (title: string, value: string, details: string[]) => {
    setSelectedStat({ title, value, details });
    setStatsModalVisible(true);
  };

  return (
    <Screen scrollable>
      <Header title="Vendor Dashboard" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        {/* Revenue Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              handleOpenStatDetails('Total Sales Revenue', '$148,920', [
                'Direct Materials Supply: $92,400',
                'Heavy Equipment Rentals: $38,520',
                'Custom RFQ Contract Quotations: $18,000',
                'Settled to Escrow: 100% Verified',
              ])
            }
            style={{ width: '48%' }}
          >
            <Card variant="filled" style={[styles.statCard, { backgroundColor: theme.colors.navy }]}>
              <Text style={{ color: theme.colors.primary, fontFamily: 'Poppins_600SemiBold', fontSize: 11 }}>
                TOTAL SALES REVENUE
              </Text>
              <Text style={{ color: '#FFF', fontFamily: 'Poppins_800ExtraBold', fontSize: 22, marginVertical: 4 }}>
                $148,920
              </Text>
              <Badge label="+18.4% this mo" variant="success" size="sm" />
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              handleOpenStatDetails('Active Orders & Shipments', '42 Active Orders', [
                '12 Orders Pending Dispatch',
                '18 In-Transit with Live GPS Freight Tracking',
                '8 Site Delivery Completed Today',
                '4 Custom Heavy Fabrication in Progress',
              ])
            }
            style={{ width: '48%' }}
          >
            <Card variant="filled" style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text style={{ color: theme.colors.textSecondary, fontFamily: 'Poppins_600SemiBold', fontSize: 11 }}>
                ACTIVE ORDERS
              </Text>
              <Text style={{ color: theme.colors.navy, fontFamily: 'Poppins_800ExtraBold', fontSize: 22, marginVertical: 4 }}>
                42 Orders
              </Text>
              <Text style={{ color: theme.colors.textTertiary, fontSize: 11 }}>12 Pending Dispatch</Text>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Quick Vendor Shortcuts */}
        <Text style={[styles.sectionHeading, { color: theme.colors.textPrimary }]}>Vendor Operations</Text>

        <Card variant="outlined" style={{ padding: 14, marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProductList')}
            style={styles.rowBetween}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.opIconWrap, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Ionicons name="cube-outline" size={20} color={theme.colors.navy} />
              </View>
              <View>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: theme.colors.textPrimary }}>
                  Product Inventory Management
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.colors.textTertiary }}>
                  Manage catalogs, prices & stock levels
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        </Card>

        <Card variant="outlined" style={{ padding: 14, marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('RFQList')}
            style={styles.rowBetween}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.opIconWrap, { backgroundColor: '#10B98120' }]}>
                <Ionicons name="document-text-outline" size={20} color="#10B981" />
              </View>
              <View>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: theme.colors.textPrimary }}>
                  RFQ Submissions & Quotations
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.colors.textTertiary }}>
                  8 pending client bids require your response
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        </Card>

        <Card variant="outlined" style={{ padding: 14, marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('RentalList')}
            style={styles.rowBetween}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.opIconWrap, { backgroundColor: '#F59E0B20' }]}>
                <Ionicons name="construct-outline" size={20} color="#F59E0B" />
              </View>
              <View>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: theme.colors.textPrimary }}>
                  Machinery & Equipment Fleet
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.colors.textTertiary }}>
                  View live rental availability & requests
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        </Card>
      </View>

      {/* Stat Details Modal */}
      <Modal visible={statsModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={styles.rowBetween}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: theme.colors.navy }}>
                {selectedStat?.title}
              </Text>
              <TouchableOpacity onPress={() => setStatsModalVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close-circle" size={24} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: theme.colors.surfaceVariant, padding: 14, borderRadius: 12, marginVertical: 14 }}>
              <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 24, color: theme.colors.primary }}>
                {selectedStat?.value}
              </Text>
            </View>

            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: theme.colors.textSecondary, marginBottom: 8 }}>
              Breakdown Details:
            </Text>
            {selectedStat?.details.map((detail, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 4 }}>
                <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: theme.colors.textPrimary, flex: 1 }}>
                  {detail}
                </Text>
              </View>
            ))}

            <Button
              title="Close Details"
              onPress={() => setStatsModalVisible(false)}
              variant="primary"
              size="md"
              style={{ marginTop: 20 }}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

// ==========================================
// 2. VENDOR DETAIL SCREEN
// ==========================================
export function VendorDetailScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const vendorId = route?.params?.vendorId || 'v1';

  return (
    <Screen scrollable>
      <Header title="Supplier Profile" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        <Card variant="filled" style={{ padding: 20, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: theme.colors.navy, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
              <Text style={{ fontSize: 24, color: '#FFF', fontFamily: 'Poppins_700Bold' }}>GM</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: theme.colors.navy }}>
                Global Metals Co.
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.colors.textSecondary }}>
                📍 Dubai, UAE · ⭐ 4.9 (120+ Reviews)
              </Text>
              <Badge label="VERIFIED MANUFACTURER" variant="success" size="sm" style={{ marginTop: 4 }} />
            </View>
          </View>
        </Card>

        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 12, color: theme.colors.textPrimary }}>
          Catalog & Products
        </Text>

        <Card variant="outlined" style={{ padding: 14, marginBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { productId: 'p1' })} style={styles.rowBetween}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: theme.colors.textPrimary }}>
              Grade 50 High-Yield Steel Rebar 12mm
            </Text>
            <Text style={{ fontFamily: 'Poppins_700Bold', color: theme.colors.primary }}>$850 / Ton</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </Screen>
  );
}

// ==========================================
// 3. HEAVY EQUIPMENT RENTALS CATALOG & SCREEN
// ==========================================
export interface RentalItem {
  id: string;
  name: string;
  category: 'Excavators' | 'Cranes & Hoists' | 'Loaders & Backhoes' | 'Power & Generators';
  dailyRate: number;
  weeklyRate: number;
  currency: string;
  location: string;
  image: string;
  vendor: string;
  operatorAvailable: boolean;
  operatorDailyCost: number;
  specs: {
    operatingWeight: string;
    enginePower: string;
    maxCapacityOrReach: string;
    fuelType: string;
  };
  isAvailableNow: boolean;
  minDays: number;
}

const RENTAL_EQUIPMENT: RentalItem[] = [
  {
    id: 'r1',
    name: 'CAT 320 Hydraulic Excavator 20-Ton',
    category: 'Excavators',
    dailyRate: 450,
    weeklyRate: 2600,
    currency: 'USD',
    location: 'Dubai Industrial City',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    vendor: 'United Equipment Rentals',
    operatorAvailable: true,
    operatorDailyCost: 60,
    specs: {
      operatingWeight: '22,500 kg',
      enginePower: '174 HP (129 kW)',
      maxCapacityOrReach: '6.72m Dig Depth · 1.19m³ Bucket',
      fuelType: 'Diesel (Low Emission Tier 4)',
    },
    isAvailableNow: true,
    minDays: 1,
  },
  {
    id: 'r2',
    name: 'Potain Tower Crane 12-Ton Capacity',
    category: 'Cranes & Hoists',
    dailyRate: 1200,
    weeklyRate: 7500,
    currency: 'USD',
    location: 'Riyadh Logistics Park',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    vendor: 'Gulf Crane Logistics',
    operatorAvailable: true,
    operatorDailyCost: 90,
    specs: {
      operatingWeight: '48,000 kg',
      enginePower: '75 kW Electric Winch',
      maxCapacityOrReach: '12 Ton Max · 65m Jib Length',
      fuelType: 'Site 3-Phase Electric Power',
    },
    isAvailableNow: true,
    minDays: 7,
  },
  {
    id: 'r3',
    name: 'JCB 3DX Plus Heavy Backhoe Loader',
    category: 'Loaders & Backhoes',
    dailyRate: 280,
    weeklyRate: 1650,
    currency: 'USD',
    location: 'Sharjah Industrial Area 10',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80',
    vendor: 'Apex Fleet & Machinery',
    operatorAvailable: true,
    operatorDailyCost: 45,
    specs: {
      operatingWeight: '7,460 kg',
      enginePower: '76 HP Turbocharged',
      maxCapacityOrReach: '4.77m Dig Depth · 1.1m³ Loader',
      fuelType: 'High-Efficiency Diesel',
    },
    isAvailableNow: true,
    minDays: 1,
  },
  {
    id: 'r4',
    name: 'Caterpillar 500kVA Soundproof Diesel Generator',
    category: 'Power & Generators',
    dailyRate: 350,
    weeklyRate: 2100,
    currency: 'USD',
    location: 'Abu Dhabi Mussafah Hub',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    vendor: 'EnergyPower Global Rentals',
    operatorAvailable: false,
    operatorDailyCost: 0,
    specs: {
      operatingWeight: '4,200 kg',
      enginePower: '500 kVA / 400 kW 3-Phase',
      maxCapacityOrReach: '400V 50Hz · 1,000L Fuel Tank',
      fuelType: 'Diesel (Sound Attenuated Enclosure)',
    },
    isAvailableNow: true,
    minDays: 2,
  },
  {
    id: 'r5',
    name: 'Volvo L120H Heavy Wheel Loader 3.5m³',
    category: 'Loaders & Backhoes',
    dailyRate: 520,
    weeklyRate: 3100,
    currency: 'USD',
    location: 'Doha Industrial Zone',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    vendor: 'HeavyHaul Global Fleet',
    operatorAvailable: true,
    operatorDailyCost: 65,
    specs: {
      operatingWeight: '20,700 kg',
      enginePower: '276 HP Volvo D8J',
      maxCapacityOrReach: '3.5m³ Rehandling Bucket · 4.1m Dump Height',
      fuelType: 'Ultra-Low Sulfur Diesel',
    },
    isAvailableNow: true,
    minDays: 1,
  },
];

const RENTAL_CATEGORIES = [
  'All Equipment',
  'Excavators',
  'Cranes & Hoists',
  'Loaders & Backhoes',
  'Power & Generators',
];

export function RentalListScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All Equipment');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Availability & Booking Modal States
  const [selectedEquipment, setSelectedEquipment] = useState<RentalItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rentalDays, setRentalDays] = useState(3);
  const [includeOperator, setIncludeOperator] = useState(true);
  const [deliverySite, setDeliverySite] = useState('Main Commercial Project Site - Business Bay, Plot 405');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Filter equipment based on category and search query
  const filteredEquipment = useMemo(() => {
    return RENTAL_EQUIPMENT.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All Equipment' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenAvailability = (item: RentalItem) => {
    setSelectedEquipment(item);
    setRentalDays(item.minDays || 3);
    setIncludeOperator(item.operatorAvailable);
    setBookingConfirmed(false);
    setModalVisible(true);
  };

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedRef = `RNT-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRef(generatedRef);
      setIsSubmitting(false);
      setBookingConfirmed(true);
    }, 1000);
  };

  // Price calculations
  const calculateTotal = () => {
    if (!selectedEquipment) return 0;
    const baseCost = selectedEquipment.dailyRate * rentalDays;
    const operatorCost = includeOperator && selectedEquipment.operatorAvailable ? selectedEquipment.operatorDailyCost * rentalDays : 0;
    const siteMobilization = 150; // Standard site delivery & inspection
    return baseCost + operatorCost + siteMobilization;
  };

  return (
    <Screen scrollable={false}>
      <Header title="Heavy Equipment Rentals" showBack onBackPress={() => navigation.goBack()} />

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6 }}>
        <View
          style={[
            styles.searchBarWrap,
            {
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="search" size={18} color={theme.colors.textTertiary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search excavators, cranes, generators..."
            placeholderTextColor={theme.colors.textTertiary}
            style={[styles.searchInput, { color: theme.colors.textPrimary }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Pills Bar */}
      <View style={{ height: 44, marginBottom: 8 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}
        >
          {RENTAL_CATEGORIES.map((cat) => {
            const isActive = cat === selectedCategory;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isActive ? theme.colors.navy : theme.colors.surfaceVariant,
                    borderColor: isActive ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    {
                      color: isActive ? '#FFFFFF' : theme.colors.textSecondary,
                      fontFamily: isActive ? 'Inter_700Bold' : 'Inter_500Medium',
                    },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Equipment List */}
      <FlatList
        data={filteredEquipment}
        contentContainerStyle={{ padding: 16, paddingTop: 4 }}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="construct-outline" size={48} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.navy }]}>No Equipment Found</Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 4 }}>
              Try adjusting your category filter or search keywords.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => handleOpenAvailability(item)}
          >
            <Card variant="outlined" style={styles.rentalCard}>
              <View style={styles.rentalImgWrap}>
                <Image source={{ uri: item.image }} style={styles.rentalImg} contentFit="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(15, 23, 42, 0.7)']}
                  style={styles.rentalImgOverlay}
                />
                {/* Available Badge */}
                <View style={styles.statusBadgeWrap}>
                  <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.statusBadgeText}>AVAILABLE FOR IMMEDIATE DISPATCH</Text>
                </View>

                {/* Location Pill */}
                <View style={styles.locationPill}>
                  <Ionicons name="location" size={12} color="#FFFFFF" />
                  <Text style={styles.locationPillText}>{item.location}</Text>
                </View>
              </View>

              <View style={{ padding: 14 }}>
                <View style={styles.rowBetween}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: theme.colors.primary, textTransform: 'uppercase' }}>
                    {item.category}
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: theme.colors.textTertiary }}>
                    Supplier: {item.vendor}
                  </Text>
                </View>

                <Text style={[styles.rentalName, { color: theme.colors.textPrimary, marginVertical: 4 }]}>
                  {item.name}
                </Text>

                {/* Specifications Snippet */}
                <View style={[styles.specsSnippetRow, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <View style={styles.specSnippetItem}>
                    <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>Weight / Specs</Text>
                    <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: theme.colors.textPrimary }}>
                      {item.specs.operatingWeight}
                    </Text>
                  </View>
                  <View style={styles.specSnippetItem}>
                    <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>Engine Power</Text>
                    <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: theme.colors.textPrimary }}>
                      {item.specs.enginePower}
                    </Text>
                  </View>
                  <View style={styles.specSnippetItem}>
                    <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>Certified Operator</Text>
                    <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: item.operatorAvailable ? theme.colors.success : theme.colors.textTertiary }}>
                      {item.operatorAvailable ? '✓ Available' : 'Optional'}
                    </Text>
                  </View>
                </View>

                {/* Rate & Booking Action Footer */}
                <View style={[styles.rentalFooter, { borderTopColor: theme.colors.border }]}>
                  <View style={styles.priceColumn}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                      <Text style={[styles.priceAmount, { color: theme.colors.navy }]}>
                        {formatPrice(item.dailyRate, item.currency)}
                      </Text>
                      <Text style={[styles.pricePerDay, { color: theme.colors.textSecondary }]}> / Day</Text>
                    </View>
                    <Text style={[styles.weeklyRateText, { color: theme.colors.textTertiary }]}>
                      Weekly: {formatPrice(item.weeklyRate, item.currency)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleOpenAvailability(item)}
                    activeOpacity={0.85}
                    style={[styles.checkAvailBtn, { backgroundColor: theme.colors.primary }]}
                  >
                    <Text style={[styles.checkAvailBtnText, { color: theme.colors.navy }]}>
                      Check Availability
                    </Text>
                    <Ionicons name="arrow-forward" size={13} color={theme.colors.navy} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />

      {/* ========================================== */}
      {/* 4. INTERACTIVE AVAILABILITY & BOOKING MODAL */}
      {/* ========================================== */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.bookingModalContent, { backgroundColor: theme.colors.cardBackground }]}>
            {/* Modal Drag Handle */}
            <View style={styles.modalDragHandle} />

            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: theme.colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  EQUIPMENT AVAILABILITY & QUOTATION
                </Text>
                <Text numberOfLines={1} style={{ fontFamily: 'Poppins_700Bold', fontSize: 17, color: theme.colors.textPrimary, marginTop: 2 }}>
                  {selectedEquipment?.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {bookingConfirmed ? (
              /* Confirmation Success Screen */
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <View style={[styles.successIconCircle, { backgroundColor: `${theme.colors.success}18` }]}>
                  <Ionicons name="checkmark-done" size={36} color={theme.colors.success} />
                </View>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: theme.colors.navy, textAlign: 'center' }}>
                  Availability Confirmed!
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center', marginVertical: 6, paddingHorizontal: 16 }}>
                  Dispatch reservation request sent to <Text style={{ fontFamily: 'Inter_700Bold', color: theme.colors.textPrimary }}>{selectedEquipment?.vendor}</Text>.
                </Text>

                <View style={[styles.confirmDetailCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                  <View style={styles.confirmRow}>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.colors.textSecondary }}>Booking Reference:</Text>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 14, color: theme.colors.primary }}>#{bookingRef}</Text>
                  </View>
                  <View style={[styles.confirmRow, { marginTop: 8 }]}>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.colors.textSecondary }}>Rental Duration:</Text>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: theme.colors.textPrimary }}>{rentalDays} Working Days</Text>
                  </View>
                  <View style={[styles.confirmRow, { marginTop: 8, borderTopWidth: 0.5, borderTopColor: theme.colors.border, paddingTop: 8 }]}>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: theme.colors.textPrimary }}>Total Estimated Quote:</Text>
                    <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 16, color: theme.colors.navy }}>{formatPrice(calculateTotal(), selectedEquipment?.currency)}</Text>
                  </View>
                </View>

                <View style={{ width: '100%', flexDirection: 'row', gap: 10, marginTop: 14 }}>
                  <Button
                    title="Track in Orders"
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate('OrderHistory');
                    }}
                    variant="primary"
                    size="md"
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Done"
                    onPress={() => setModalVisible(false)}
                    variant="outline"
                    size="md"
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            ) : (
              /* Interactive Booking Form */
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Equipment Overview Card */}
                {selectedEquipment && (
                  <View style={[styles.equipmentSummaryBox, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                    <Image source={{ uri: selectedEquipment.image }} style={styles.summaryImg} contentFit="cover" />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text numberOfLines={1} style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: theme.colors.textPrimary }}>
                        {selectedEquipment.name}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                        <Ionicons name="location-outline" size={13} color={theme.colors.textSecondary} style={{ marginRight: 3 }} />
                        <Text numberOfLines={1} style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.colors.textSecondary }}>
                          {selectedEquipment.location}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 }}>
                        <Ionicons name="shield-checkmark" size={13} color={theme.colors.success} />
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: theme.colors.success }}>
                          Inspected & Certified Fleet
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Technical Specifications Grid */}
                <Text style={[styles.formSectionTitle, { color: theme.colors.navy, marginTop: 4 }]}>Machine Specifications</Text>
                {selectedEquipment && (
                  <View style={styles.specCardsGrid}>
                    <View style={[styles.specCardBox, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                      <Text style={[styles.specCardLabel, { color: theme.colors.textTertiary }]}>Operating Weight</Text>
                      <Text style={[styles.specCardValue, { color: theme.colors.textPrimary }]}>{selectedEquipment.specs.operatingWeight}</Text>
                    </View>
                    <View style={[styles.specCardBox, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                      <Text style={[styles.specCardLabel, { color: theme.colors.textTertiary }]}>Engine Rating</Text>
                      <Text style={[styles.specCardValue, { color: theme.colors.textPrimary }]}>{selectedEquipment.specs.enginePower}</Text>
                    </View>
                    <View style={[styles.specCardBox, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                      <Text style={[styles.specCardLabel, { color: theme.colors.textTertiary }]}>Capacity / Reach</Text>
                      <Text style={[styles.specCardValue, { color: theme.colors.textPrimary }]}>{selectedEquipment.specs.maxCapacityOrReach}</Text>
                    </View>
                    <View style={[styles.specCardBox, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                      <Text style={[styles.specCardLabel, { color: theme.colors.textTertiary }]}>Fuel Standard</Text>
                      <Text style={[styles.specCardValue, { color: theme.colors.textPrimary }]}>{selectedEquipment.specs.fuelType}</Text>
                    </View>
                  </View>
                )}

                {/* Duration Stepper Selector */}
                <Text style={[styles.formSectionTitle, { color: theme.colors.navy, marginTop: 14 }]}>Rental Duration (Working Days)</Text>
                <View style={[styles.durationRow, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15, color: theme.colors.textPrimary }}>
                      {rentalDays} {rentalDays === 1 ? 'Working Day' : 'Working Days'}
                    </Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: theme.colors.textTertiary, marginTop: 1 }}>
                      Base Rate: {selectedEquipment ? formatPrice(selectedEquipment.dailyRate, selectedEquipment.currency) : ''}/Day
                    </Text>
                  </View>

                  <View style={styles.stepperWrap}>
                    <TouchableOpacity
                      onPress={() => setRentalDays((prev) => Math.max(selectedEquipment?.minDays || 1, prev - 1))}
                      style={[styles.stepBtn, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="remove" size={16} color={theme.colors.navy} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: theme.colors.navy, minWidth: 28, textAlign: 'center' }}>
                      {rentalDays}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setRentalDays((prev) => prev + 1)}
                      style={[styles.stepBtn, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={16} color={theme.colors.navy} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Operator Requirement Toggle */}
                {selectedEquipment?.operatorAvailable && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIncludeOperator(!includeOperator)}
                    style={[
                      styles.toggleOptionRow,
                      {
                        backgroundColor: includeOperator ? `${theme.colors.primary}12` : theme.colors.surfaceVariant,
                        borderColor: includeOperator ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="person" size={15} color={theme.colors.navy} />
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13.5, color: theme.colors.textPrimary }}>
                          Certified Machine Operator
                        </Text>
                      </View>
                      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11.5, color: theme.colors.textSecondary, marginTop: 2 }}>
                        Include verified OEM heavy equipment operator (+{formatPrice(selectedEquipment.operatorDailyCost, selectedEquipment.currency)}/day)
                      </Text>
                    </View>

                    <Ionicons
                      name={includeOperator ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={includeOperator ? theme.colors.primary : theme.colors.textTertiary}
                    />
                  </TouchableOpacity>
                )}

                {/* Delivery Site Location */}
                <Text style={[styles.formSectionTitle, { color: theme.colors.navy, marginTop: 14 }]}>Site Delivery Location</Text>
                <View style={[styles.siteInputBox, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                  <Ionicons name="location" size={18} color={theme.colors.primary} />
                  <TextInput
                    value={deliverySite}
                    onChangeText={setDeliverySite}
                    style={[styles.siteInput, { color: theme.colors.textPrimary }]}
                    placeholder="Enter project site address..."
                    placeholderTextColor={theme.colors.textTertiary}
                  />
                </View>

                {/* Instant Live Price Summary */}
                <View style={[styles.quoteBreakdownCard, { backgroundColor: theme.colors.navy }]}>
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13.5, color: '#FFF', marginBottom: 10 }}>
                    Estimated Rental Quotation
                  </Text>
                  <View style={styles.quoteRow}>
                    <Text style={{ color: '#94A3B8', fontSize: 12, flex: 1, paddingRight: 8 }}>
                      Machine Rental ({rentalDays} Days @ {selectedEquipment ? formatPrice(selectedEquipment.dailyRate, selectedEquipment.currency) : ''})
                    </Text>
                    <Text style={{ color: '#FFF', fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>
                      {selectedEquipment ? formatPrice(selectedEquipment.dailyRate * rentalDays, selectedEquipment.currency) : ''}
                    </Text>
                  </View>
                  {includeOperator && selectedEquipment?.operatorAvailable && (
                    <View style={styles.quoteRow}>
                      <Text style={{ color: '#94A3B8', fontSize: 12, flex: 1, paddingRight: 8 }}>
                        Certified Operator ({rentalDays} Days @ {formatPrice(selectedEquipment.operatorDailyCost, selectedEquipment.currency)})
                      </Text>
                      <Text style={{ color: '#FFF', fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>
                        {formatPrice(selectedEquipment.operatorDailyCost * rentalDays, selectedEquipment.currency)}
                      </Text>
                    </View>
                  )}
                  <View style={styles.quoteRow}>
                    <Text style={{ color: '#94A3B8', fontSize: 12, flex: 1, paddingRight: 8 }}>Site Mobilization & Freight</Text>
                    <Text style={{ color: '#FFF', fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>
                      {selectedEquipment ? formatPrice(150, selectedEquipment.currency) : ''}
                    </Text>
                  </View>

                  <View style={[styles.quoteRow, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingTop: 10, marginTop: 8 }]}>
                    <Text style={{ color: theme.colors.primary, fontFamily: 'Poppins_700Bold', fontSize: 14 }}>
                      Total Estimated Cost
                    </Text>
                    <Text style={{ color: theme.colors.primary, fontFamily: 'Poppins_800ExtraBold', fontSize: 18 }}>
                      {selectedEquipment ? formatPrice(calculateTotal(), selectedEquipment.currency) : ''}
                    </Text>
                  </View>
                </View>

                {/* Submit Booking Button */}
                <Button
                  title="Confirm Availability & Request Booking"
                  onPress={handleConfirmBooking}
                  isLoading={isSubmitting}
                  size="lg"
                  variant="primary"
                  style={{ marginTop: 16 }}
                />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    padding: 14,
    borderRadius: 14,
  },
  sectionHeading: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  opIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 0.5,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    padding: 0,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  categoryPillText: {
    fontSize: 12,
  },
  rentalCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 0,
  },
  rentalImgWrap: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  rentalImg: {
    width: '100%',
    height: '100%',
  },
  rentalImgOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  statusBadgeWrap: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  locationPill: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  locationPillText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: '#FFFFFF',
  },
  rentalName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    lineHeight: 22,
  },
  specsSnippetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
    gap: 8,
  },
  specSnippetItem: {
    flex: 1,
  },
  rentalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 0.5,
    gap: 10,
  },
  priceColumn: {
    flexShrink: 1,
  },
  priceAmount: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 18,
  },
  pricePerDay: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  weeklyRateText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 1,
  },
  checkAvailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 5,
    flexShrink: 0,
  },
  checkAvailBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 12.5,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    marginTop: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 }
      : { elevation: 6 }),
  },
  bookingModalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '92%',
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    paddingBottom: 10,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmDetailCard: {
    width: '100%',
    padding: 14,
    borderRadius: 14,
    marginVertical: 12,
    borderWidth: 1,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  equipmentSummaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 0.5,
  },
  summaryImg: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  formSectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13.5,
    marginBottom: 8,
  },
  specCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  specCardBox: {
    width: '48.5%',
    padding: 10,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  specCardLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10.5,
  },
  specCardValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    marginTop: 2,
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 0.5,
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  toggleOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
  },
  siteInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    gap: 8,
  },
  siteInput: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    padding: 0,
  },
  quoteBreakdownCard: {
    padding: 14,
    borderRadius: 14,
    marginTop: 14,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3.5,
  },
});

