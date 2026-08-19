/**
 * HINCH MART — Product Listing Screen with Live API, Filters & Grid/List Toggle
 * Features:
 * - GET /api/products backend integration
 * - Filter by: Category, Subcategory, Brand, Minimum Price, Maximum Price, Availability, Seller
 * - Search query filter
 * - Dynamic view mode (Grid / List)
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { ProductCard } from '../../../components/cards/ProductCard';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Button } from '../../../components/ui/Button';
import { Chip } from '../../../components/ui/Badge';
import { productApi } from '../../../api/productApi';
import { Product } from '../../../types/product.types';

export const SAMPLE_PRODUCTS: Product[] = [
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
  {
    id: 'p4',
    name: 'Schedule 80 Heavy-Duty PVC Pressure Pipe 4-inch',
    slug: 'pvc-pipe-schedule-80',
    sku: 'PP-SCH80-4IN',
    description: 'Corrosion resistant industrial grade PVC pipe for potable water and drainage.',
    shortDescription: '4-inch Schedule 80 PVC Pipe',
    images: [{ id: 'i4', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=600&q=80', thumbnail: '', alt: '', isPrimary: true, order: 1 }],
    category: { id: 'c4', name: 'Plumbing', slug: 'plumbing', icon: '', image: '', description: '', productCount: 300, parentId: null, subCategories: [], order: 4 },
    subCategory: { id: 'sc4', name: 'Pipes', slug: 'pipes', image: '', productCount: 75, parentId: 'c4' },
    brand: { id: 'b4', name: 'Astral Pipes', logo: '', slug: 'astral', description: '', productCount: 95, isVerified: true },
    vendor: { id: 'v1', name: 'Global Metals Co', logo: '', rating: 4.9, isVerified: true, location: 'Dubai, UAE' },
    price: { amount: 45, compareAtPrice: 55, currency: 'USD', discount: 18, discountType: 'percentage', bulkPricing: [] },
    variants: [],
    specifications: [],
    rating: { average: 4.6, count: 64, distribution: { 1: 0, 2: 1, 3: 4, 4: 15, 5: 44 } },
    reviewCount: 64,
    stock: { available: 320, isInStock: true, lowStockThreshold: 15, isLowStock: false },
    tags: ['plumbing', 'pipes'],
    isFeatured: true,
    isTrending: true,
    isDealOfDay: false,
    minOrderQuantity: 10,
    maxOrderQuantity: 500,
    unit: 'Length',
    weight: 8.5,
    weightUnit: 'kg',
    dimensions: { length: 600, width: 11.4, height: 11.4, unit: 'cm' },
    warranty: '5 Years',
    returnPolicy: '14 Days Return',
    buyingGuide: '',
    faqs: [],
    relatedProducts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const AVAILABLE_CATEGORIES = ['All', 'Steel', 'Cement', 'Tools', 'Plumbing', 'Electrical', 'Finishing'];
const AVAILABLE_BRANDS = ['All', 'Tata Tiscon', 'UltraTech', 'Bosch Professional', 'Astral Pipes', 'Hilti'];
const AVAILABLE_SELLERS = ['All', 'Global Metals Co', 'Apex Building Supplies', 'Hilti Distribution'];

export function ProductListScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const initialCategory = route?.params?.categoryId || route?.params?.category || 'All';
  const initialSubCategory = route?.params?.subCategory || '';

  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [layoutView, setLayoutView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter States
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(initialSubCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedSeller, setSelectedSeller] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Fetch Products from Backend: GET /api/products
  const fetchProducts = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const queryParams: any = {};
      if (selectedCategory && selectedCategory !== 'All') queryParams.category = selectedCategory;
      if (selectedSubCategory) queryParams.subCategory = selectedSubCategory;
      if (selectedBrand && selectedBrand !== 'All') queryParams.brand = selectedBrand;
      if (selectedSeller && selectedSeller !== 'All') queryParams.seller = selectedSeller;
      if (minPrice) queryParams.minPrice = Number(minPrice);
      if (maxPrice) queryParams.maxPrice = Number(maxPrice);
      if (inStockOnly) queryParams.availability = 'in_stock';
      if (search.trim()) queryParams.search = search.trim();

      const response = await productApi.getProducts(queryParams);
      const resData = (response.data?.data || response.data) as any;
      const items = Array.isArray(resData) ? resData : (resData?.items || []);

      if (items.length > 0) {
        setProducts(items);
      } else {
        // Apply client-side filtering on mock data as fallback
        setProducts(filterLocalProducts());
      }
    } catch (error) {
      console.log('[ProductListScreen] API fallback to local products list');
      setProducts(filterLocalProducts());
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const filterLocalProducts = (): Product[] => {
    return SAMPLE_PRODUCTS.filter((p) => {
      // Category Filter
      if (selectedCategory && selectedCategory !== 'All') {
        const catMatch =
          p.category.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          p.category.id.toLowerCase() === selectedCategory.toLowerCase();
        if (!catMatch) return false;
      }

      // Subcategory Filter
      if (selectedSubCategory) {
        const subMatch =
          p.subCategory?.name.toLowerCase().includes(selectedSubCategory.toLowerCase()) ||
          p.subCategory?.id.toLowerCase() === selectedSubCategory.toLowerCase();
        if (!subMatch) return false;
      }

      // Brand Filter
      if (selectedBrand && selectedBrand !== 'All') {
        if (!p.brand?.name.toLowerCase().includes(selectedBrand.toLowerCase())) return false;
      }

      // Seller / Vendor Filter
      if (selectedSeller && selectedSeller !== 'All') {
        if (!p.vendor?.name.toLowerCase().includes(selectedSeller.toLowerCase())) return false;
      }

      // Price Range Filter
      const price = p.price.amount;
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;

      // Availability Filter
      if (inStockOnly && !p.stock.isInStock) return false;

      // Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesDesc) return false;
      }

      return true;
    });
  };

  useEffect(() => {
    fetchProducts(false);
  }, [selectedCategory, selectedSubCategory, selectedBrand, selectedSeller, inStockOnly]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (selectedSubCategory) count++;
    if (selectedBrand !== 'All') count++;
    if (selectedSeller !== 'All') count++;
    if (minPrice || maxPrice) count++;
    if (inStockOnly) count++;
    return count;
  }, [selectedCategory, selectedSubCategory, selectedBrand, selectedSeller, minPrice, maxPrice, inStockOnly]);

  const handleApplyFilters = () => {
    setIsFilterModalVisible(false);
    fetchProducts(true);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCategory('');
    setSelectedBrand('All');
    setSelectedSeller('All');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setIsFilterModalVisible(false);
  };

  return (
    <Screen scrollable={false}>
      <Header
        title="Construction Products"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Top Search & Filter Bar */}
      <View style={styles.topControlRow}>
        <View style={styles.searchFlex}>
          <SearchBar
            value={search}
            onChangeText={(t) => {
              setSearch(t);
            }}
            onSubmit={() => fetchProducts(true)}
            placeholder="Search steel, cement, tools..."
          />
        </View>

        {/* Filter Trigger Button */}
        <TouchableOpacity
          onPress={() => setIsFilterModalVisible(true)}
          style={[
            styles.actionIconBtn,
            {
              backgroundColor: activeFilterCount > 0 ? theme.colors.navy : theme.colors.surfaceVariant,
              borderColor: activeFilterCount > 0 ? theme.colors.primary : theme.colors.border,
            },
          ]}
          activeOpacity={0.8}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeFilterCount > 0 ? '#FFFFFF' : theme.colors.textPrimary}
          />
          {activeFilterCount > 0 && (
            <View style={[styles.filterBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Grid/List View Toggle */}
        <TouchableOpacity
          onPress={() => setLayoutView(layoutView === 'grid' ? 'list' : 'grid')}
          style={[styles.actionIconBtn, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}
          activeOpacity={0.8}
        >
          <Ionicons
            name={layoutView === 'grid' ? 'grid' : 'list'}
            size={18}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activePillsRow}>
          {selectedCategory !== 'All' && (
            <View style={[styles.activePill, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text style={[styles.activePillText, { color: theme.colors.textPrimary }]}>Cat: {selectedCategory}</Text>
              <TouchableOpacity onPress={() => setSelectedCategory('All')}>
                <Ionicons name="close-circle" size={14} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          {selectedBrand !== 'All' && (
            <View style={[styles.activePill, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text style={[styles.activePillText, { color: theme.colors.textPrimary }]}>Brand: {selectedBrand}</Text>
              <TouchableOpacity onPress={() => setSelectedBrand('All')}>
                <Ionicons name="close-circle" size={14} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          {selectedSeller !== 'All' && (
            <View style={[styles.activePill, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text style={[styles.activePillText, { color: theme.colors.textPrimary }]}>Seller: {selectedSeller}</Text>
              <TouchableOpacity onPress={() => setSelectedSeller('All')}>
                <Ionicons name="close-circle" size={14} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          {(minPrice || maxPrice) && (
            <View style={[styles.activePill, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text style={[styles.activePillText, { color: theme.colors.textPrimary }]}>
                Price: ${minPrice || '0'} - ${maxPrice || '∞'}
              </Text>
              <TouchableOpacity onPress={() => { setMinPrice(''); setMaxPrice(''); }}>
                <Ionicons name="close-circle" size={14} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          {inStockOnly && (
            <View style={[styles.activePill, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text style={[styles.activePillText, { color: theme.colors.textPrimary }]}>In Stock</Text>
              <TouchableOpacity onPress={() => setInStockOnly(false)}>
                <Ionicons name="close-circle" size={14} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* Product List / Grid */}
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading Verified Products...
          </Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.centerBox}>
          <Ionicons name="cube-outline" size={48} color={theme.colors.textDisabled} />
          <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
            No matching construction materials found
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            Try clearing filters or search for another spec
          </Text>
          <Button title="Reset All Filters" onPress={handleResetFilters} variant="primary" style={{ marginTop: 16 }} />
        </View>
      ) : (
        <FlatList
          data={products}
          key={layoutView}
          numColumns={layoutView === 'grid' ? 2 : 1}
          contentContainerStyle={styles.listPadding}
          columnWrapperStyle={layoutView === 'grid' ? styles.columnWrapper : undefined}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                fetchProducts(false);
              }}
              colors={[theme.colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              variant={layoutView}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* FILTER BOTTOM SHEET / MODAL */}
      <Modal visible={isFilterModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: theme.colors.surface }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="filter" size={18} color={theme.colors.primary} />
                <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>Filter Products</Text>
              </View>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              {/* Category Filter */}
              <Text style={[styles.filterGroupTitle, { color: theme.colors.textPrimary }]}>Category</Text>
              <View style={styles.chipRow}>
                {AVAILABLE_CATEGORIES.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    selected={selectedCategory === cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={styles.chipItem}
                  />
                ))}
              </View>

              {/* Brand Filter */}
              <Text style={[styles.filterGroupTitle, { color: theme.colors.textPrimary }]}>Brand</Text>
              <View style={styles.chipRow}>
                {AVAILABLE_BRANDS.map((brand) => (
                  <Chip
                    key={brand}
                    label={brand}
                    selected={selectedBrand === brand}
                    onPress={() => setSelectedBrand(brand)}
                    style={styles.chipItem}
                  />
                ))}
              </View>

              {/* Seller / Vendor Filter */}
              <Text style={[styles.filterGroupTitle, { color: theme.colors.textPrimary }]}>Seller / Vendor</Text>
              <View style={styles.chipRow}>
                {AVAILABLE_SELLERS.map((seller) => (
                  <Chip
                    key={seller}
                    label={seller}
                    selected={selectedSeller === seller}
                    onPress={() => setSelectedSeller(seller)}
                    style={styles.chipItem}
                  />
                ))}
              </View>

              {/* Price Range */}
              <Text style={[styles.filterGroupTitle, { color: theme.colors.textPrimary }]}>Price Range ($ USD)</Text>
              <View style={styles.priceRow}>
                <View style={styles.priceInputBox}>
                  <Text style={[styles.priceInputLabel, { color: theme.colors.textTertiary }]}>Min Price</Text>
                  <TextInput
                    value={minPrice}
                    onChangeText={setMinPrice}
                    placeholder="$0"
                    keyboardType="numeric"
                    style={[styles.priceInput, { color: theme.colors.textPrimary, borderColor: theme.colors.border }]}
                  />
                </View>
                <Text style={{ alignSelf: 'center', marginHorizontal: 8, color: theme.colors.textSecondary }}>—</Text>
                <View style={styles.priceInputBox}>
                  <Text style={[styles.priceInputLabel, { color: theme.colors.textTertiary }]}>Max Price</Text>
                  <TextInput
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    placeholder="$10,000+"
                    keyboardType="numeric"
                    style={[styles.priceInput, { color: theme.colors.textPrimary, borderColor: theme.colors.border }]}
                  />
                </View>
              </View>

              {/* Availability Filter */}
              <Text style={[styles.filterGroupTitle, { color: theme.colors.textPrimary }]}>Availability</Text>
              <TouchableOpacity
                onPress={() => setInStockOnly(!inStockOnly)}
                style={[
                  styles.stockCheckboxRow,
                  {
                    backgroundColor: inStockOnly ? `${theme.colors.primary}15` : theme.colors.surfaceVariant,
                    borderColor: inStockOnly ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={inStockOnly ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={inStockOnly ? theme.colors.primary : theme.colors.textSecondary}
                />
                <Text style={[styles.stockCheckboxText, { color: theme.colors.textPrimary }]}>
                  In Stock & Ready for Immediate Dispatch
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Modal Actions */}
            <View style={[styles.modalActionsRow, { borderTopColor: theme.colors.border }]}>
              <Button
                title="Reset Filters"
                onPress={handleResetFilters}
                variant="outline"
                style={{ flex: 1, marginRight: 10 }}
              />
              <Button
                title="Apply Filters"
                onPress={handleApplyFilters}
                variant="primary"
                style={{ flex: 1.5 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  searchFlex: {
    flex: 1,
  },
  actionIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#152238',
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
  },
  activePillsRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  activePillText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    marginTop: 12,
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  emptySubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
  },
  modalScrollContent: {
    padding: 16,
  },
  filterGroupTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginTop: 14,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chipItem: {
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInputBox: {
    flex: 1,
  },
  priceInputLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginBottom: 4,
  },
  priceInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  stockCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginTop: 4,
  },
  stockCheckboxText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    flex: 1,
  },
  modalActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
