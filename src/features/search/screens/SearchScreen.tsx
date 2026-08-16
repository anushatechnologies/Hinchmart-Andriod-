/**
 * HINCH MART — Search Screen with Real-Time Results & Voice Search
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Chip } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { ProductCard } from '../../../components/cards/ProductCard';
import { Product } from '../../../types/product.types';

const TRENDING_KEYWORDS = [
  'Steel Rebar',
  'Portland Cement 50kg',
  'Excavator Rental',
  'Armored Cable 4-Core',
  'Scaffolding Clamps',
  'PPE Hard Hats',
];

const RECENT_SEARCHES = ['Tata Steel', 'Concrete Mixer', 'Bosch Drill 800W'];

const ALL_SEARCH_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Grade 50 High-Yield Steel Rebar 12mm',
    slug: 'steel-rebar-12mm',
    sku: 'ST-12MM-50',
    description: 'High tensile strength steel rebar ideal for reinforced concrete foundations.',
    shortDescription: '12mm Steel Rebar Grade 50',
    images: [{ id: 'i1', url: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=600&q=80', thumbnail: '', alt: '', isPrimary: true, order: 1 }],
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
    minOrderQuantity: 5,
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
    images: [{ id: 'i2', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80', thumbnail: '', alt: '', isPrimary: true, order: 1 }],
    category: { id: 'c1', name: 'Cement', slug: 'cement', icon: '', image: '', description: '', productCount: 200, parentId: null, subCategories: [], order: 2 },
    subCategory: { id: 'sc2', name: 'OPC', slug: 'opc', image: '', productCount: 60, parentId: 'c1' },
    brand: { id: 'b2', name: 'UltraTech', logo: '', slug: 'ultratech', description: '', productCount: 80, isVerified: true },
    vendor: { id: 'v2', name: 'Apex Building Supplies', logo: '', rating: 4.7, isVerified: true, location: 'Riyadh, KSA' },
    price: { amount: 12, compareAtPrice: 15, currency: 'USD', discount: 20, discountType: 'percentage', bulkPricing: [] },
    variants: [],
    specifications: [],
    rating: { average: 4.9, count: 310, distribution: { 1: 0, 2: 1, 3: 4, 4: 35, 5: 270 } },
    reviewCount: 310,
    stock: { available: 2000, isInStock: true, lowStockThreshold: 100, isLowStock: false },
    tags: ['cement', 'opc'],
    isFeatured: true,
    isTrending: true,
    isDealOfDay: true,
    minOrderQuantity: 50,
    maxOrderQuantity: 5000,
    unit: 'Bag',
    weight: 50,
    weightUnit: 'kg',
    dimensions: { length: 60, width: 40, height: 15, unit: 'cm' },
    warranty: 'Standard Storage Warranty',
    returnPolicy: 'No Return on Open Bags',
    buyingGuide: '',
    faqs: [],
    relatedProducts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function SearchScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const filteredProducts = query.trim()
    ? ALL_SEARCH_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.name.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleSearchSubmit = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  return (
    <Screen scrollable={false}>
      <Header title="Search Marketplace" showBack onBackPress={() => navigation.goBack()} showCart={false} />

      <View style={styles.paddingBox}>
        <SearchBar
          value={query}
          onChangeText={(text) => setQuery(text)}
          onSubmit={() => handleSearchSubmit(query)}
          onClear={() => setQuery('')}
          onVoicePress={() => setShowVoiceModal(true)}
          autoFocus
        />

        {query.trim().length > 0 ? (
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginBottom: 12 }]}>
              Search Results ({filteredProducts.length})
            </Text>
            {filteredProducts.length > 0 ? (
              <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ProductCard
                    product={item}
                    variant="list"
                    onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                  />
                )}
              />
            ) : (
              <View style={styles.noResultsBox}>
                <Ionicons name="search" size={36} color={theme.colors.textTertiary} style={{ marginBottom: 8 }} />
                <Text style={[styles.noResultsTitle, { color: theme.colors.navy }]}>No Products Found</Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>
                  Try searching for "steel", "cement", or "rebar"
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View>
            {/* Recent Searches */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Recent Searches</Text>
            </View>
            <View style={styles.chipRow}>
              {RECENT_SEARCHES.map((item, idx) => (
                <Chip
                  key={idx}
                  label={item}
                  onPress={() => handleSearchSubmit(item)}
                  style={styles.chipMargin}
                />
              ))}
            </View>

            {/* Trending Searches */}
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="trending-up" size={18} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Trending Now</Text>
              </View>
            </View>
            <View style={styles.chipRow}>
              {TRENDING_KEYWORDS.map((item, idx) => (
                <Chip
                  key={idx}
                  label={item}
                  onPress={() => handleSearchSubmit(item)}
                  selected={idx === 0}
                  style={styles.chipMargin}
                />
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Voice Search Modal Shell */}
      {showVoiceModal && (
        <View style={[styles.voiceModalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <Card variant="elevated" style={styles.voiceCard}>
            <Ionicons name="mic" size={48} color={theme.colors.primary} style={{ alignSelf: 'center', marginBottom: 16 }} />
            <Text style={[styles.voiceTitle, { color: theme.colors.navy }]}>Listening...</Text>
            <Text style={[styles.voiceSub, { color: theme.colors.textSecondary }]}>
              Say something like "Find Steel Rebar 12mm"
            </Text>

            <TouchableOpacity
              onPress={() => setShowVoiceModal(false)}
              style={[styles.closeVoiceBtn, { backgroundColor: theme.colors.danger }]}
            >
              <Text style={{ color: '#FFF', fontFamily: 'Poppins_600SemiBold' }}>Cancel</Text>
            </TouchableOpacity>
          </Card>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  paddingBox: {
    padding: 16,
    flex: 1,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipMargin: {
    marginBottom: 8,
  },
  noResultsBox: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  voiceModalOverlay: {
    ...StyleSheet.absoluteFill as object,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 100,
  },
  voiceCard: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  voiceTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  voiceSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
  },
  closeVoiceBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
});
