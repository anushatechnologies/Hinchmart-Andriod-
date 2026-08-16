/**
 * HINCH MART — Product Listing Screen with Grid/List Toggle & Filters
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { ProductCard } from '../../../components/cards/ProductCard';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Product } from '../../../types/product.types';

const SAMPLE_PRODUCTS: Product[] = [
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
    minOrderQuantity: 50,
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
  {
    id: 'p3',
    name: 'Industrial Heavy-Duty Rotary Hammer Drill 800W',
    slug: 'rotary-hammer-drill-800w',
    sku: 'TL-DRILL-800',
    description: 'High-performance SDS Plus rotary hammer for heavy concrete drilling.',
    shortDescription: '800W SDS Plus Drill',
    images: [{ id: 'i3', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80', thumbnail: '', alt: '', isPrimary: true, order: 1 }],
    category: { id: 'c7', name: 'Tools', slug: 'tools', icon: '', image: '', description: '', productCount: 150, parentId: null, subCategories: [], order: 3 },
    subCategory: { id: 'sc3', name: 'Drills', slug: 'drills', image: '', productCount: 30, parentId: 'c7' },
    brand: { id: 'b3', name: 'Bosch Professional', logo: '', slug: 'bosch', description: '', productCount: 110, isVerified: true },
    vendor: { id: 'v3', name: 'Hilti Distribution', logo: '', rating: 4.9, isVerified: true, location: 'Berlin, DE' },
    price: { amount: 189, compareAtPrice: 220, currency: 'USD', discount: 14, discountType: 'percentage', bulkPricing: [] },
    variants: [],
    specifications: [],
    rating: { average: 4.9, count: 210, distribution: { 1: 0, 2: 0, 3: 2, 4: 18, 5: 190 } },
    reviewCount: 210,
    stock: { available: 85, isInStock: true, lowStockThreshold: 10, isLowStock: false },
    tags: ['tools', 'drill'],
    isFeatured: false,
    isTrending: true,
    isDealOfDay: false,
    minOrderQuantity: 1,
    maxOrderQuantity: 50,
    unit: 'Piece',
    weight: 3.2,
    weightUnit: 'kg',
    dimensions: { length: 38, width: 22, height: 10, unit: 'cm' },
    warranty: '2 Years Manufacturer Warranty',
    returnPolicy: '30 Days Return',
    buyingGuide: '',
    faqs: [],
    relatedProducts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function ProductListScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const [layoutView, setLayoutView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  return (
    <Screen scrollable={false}>
      <Header
        title="Construction Products"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Top Filter Bar */}
      <View style={styles.topControlRow}>
        <View style={styles.searchFlex}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Filter in list..." />
        </View>

        <TouchableOpacity
          onPress={() => setLayoutView(layoutView === 'grid' ? 'list' : 'grid')}
          style={[styles.toggleBtn, { backgroundColor: theme.colors.surfaceVariant }]}
        >
          <Text style={{ fontSize: 16 }}>{layoutView === 'grid' ? '☰' : '⊞'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={SAMPLE_PRODUCTS}
        key={layoutView}
        numColumns={layoutView === 'grid' ? 2 : 1}
        contentContainerStyle={styles.listPadding}
        columnWrapperStyle={layoutView === 'grid' ? styles.columnWrapper : undefined}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            variant={layoutView}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchFlex: {
    flex: 1,
    marginRight: 8,
  },
  toggleBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
