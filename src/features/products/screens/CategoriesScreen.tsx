/**
 * HINCH MART — Enterprise Construction Marketplace Categories Screen
 * Ultra-professional B2B UI/UX featuring Live Category Search, Grid/List View Switcher,
 * Industry Domain Filters, Subcategory Deep Links, and RFQ Procurement Callouts.
 */
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Card } from '../../../components/ui/Card';

export interface CategoryItem {
  id: string;
  name: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  bgGradient: [string, string];
  count: string;
  industry: 'Civil & Structural' | 'MEP & Electrical' | 'Finishing & Architecture' | 'Heavy Equipment';
  sla: string;
  sub: string[];
  popularSpec?: string;
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'c1',
    name: 'Cement & Ready-Mix Concrete',
    iconName: 'wall',
    color: '#3B82F6',
    bgGradient: ['#1E3A8A', '#3B82F6'],
    count: '450+ Products',
    industry: 'Civil & Structural',
    sla: 'Same-Day Bulk Delivery',
    popularSpec: 'OPC 53 Grade & PPC',
    sub: ['Ordinary Portland Cement', 'Ready Mix Concrete', 'Concrete Admixtures', 'Fly Ash Blocks', 'Precast Slabs'],
  },
  {
    id: 'c2',
    name: 'Structural Steel & Rebar',
    iconName: 'factory',
    color: '#0284C7',
    bgGradient: ['#0C4A6E', '#0284C7'],
    count: '320+ Products',
    industry: 'Civil & Structural',
    sla: 'Mill Test Certified',
    popularSpec: 'Fe 550D & TMT Bars',
    sub: ['Deformed Rebar (Fe 500/550D)', 'Structural I-Beams & Channels', 'Steel Wire Mesh', 'Stainless Steel Sheets', 'Binding Wire'],
  },
  {
    id: 'c3',
    name: 'Heavy Machinery & Earthmovers',
    iconName: 'dump-truck',
    color: '#D97706',
    bgGradient: ['#78350F', '#D97706'],
    count: '180+ Products',
    industry: 'Heavy Equipment',
    sla: 'Verified Operator & Fleet',
    popularSpec: '20-Ton Excavators & Cranes',
    sub: ['Crawler Excavators', 'Tower Cranes & Hoists', 'Transit Mixers', 'Diesel Generators (100kVA+)', 'Submersible Dewatering Pumps'],
  },
  {
    id: 'c4',
    name: 'Plumbing, Piping & Drainage',
    iconName: 'pipe-wrench',
    color: '#06B6D4',
    bgGradient: ['#164E63', '#06B6D4'],
    count: '600+ Products',
    industry: 'MEP & Electrical',
    sla: 'ISO/DIN Standards Approved',
    popularSpec: 'HDPE & Schedule 80 PVC',
    sub: ['HDPE & UPVC Pressure Pipes', 'Flanged Gate & Butterfly Valves', 'Overhead Water Tanks (5,000L+)', 'Sub-surface Drainage Channels', 'Fire Hydrant Piping'],
  },
  {
    id: 'c5',
    name: 'Electrical, Cables & Switchgear',
    iconName: 'lightning-bolt',
    color: '#EAB308',
    bgGradient: ['#713F12', '#EAB308'],
    count: '520+ Products',
    industry: 'MEP & Electrical',
    sla: 'UL & CE Certified',
    popularSpec: '11kV Armored XLPE Cables',
    sub: ['Armored XLPE High-Voltage Cables', 'Main Distribution Switchgears', '3-Phase Dry Transformers', 'Industrial High-Bay LED Lighting', 'Busbar Trunking Systems'],
  },
  {
    id: 'c6',
    name: 'Paints, Coatings & Waterproofing',
    iconName: 'format-paint',
    color: '#EC4899',
    bgGradient: ['#831843', '#EC4899'],
    count: '290+ Products',
    industry: 'Finishing & Architecture',
    sla: '10-Year Warranty Tier',
    popularSpec: 'Bituminous Membranes & Epoxies',
    sub: ['Weatherproof Exterior Emulsions', 'Bituminous Waterproofing Membrane', 'Epoxy Heavy-Duty Flooring', 'Anti-Corrosive Primers', 'Thermal Insulation Sheeting'],
  },
  {
    id: 'c7',
    name: 'Industrial Tools & Fasteners',
    iconName: 'hammer-wrench',
    color: '#8B5CF6',
    bgGradient: ['#4C1D95', '#8B5CF6'],
    count: '750+ Products',
    industry: 'Civil & Structural',
    sla: 'Heavy Duty Tool Spec',
    popularSpec: 'SDS Rotary Hammers & Anchors',
    sub: ['Rotary SDS Drills & Drivers', 'Chemical Anchor Bolts', 'Diamond Cutting Blades', 'MIG/TIG Welding Machines', 'Laser Distance Scanners'],
  },
  {
    id: 'c8',
    name: 'Site Safety Equipment (PPE)',
    iconName: 'hard-hat',
    color: '#10B981',
    bgGradient: ['#064E3B', '#10B981'],
    count: '210+ Products',
    industry: 'Civil & Structural',
    sla: 'OSHA & EN Certified',
    popularSpec: 'Full PPE Kits & Harnesses',
    sub: ['Vented Hard Hats (EN 397)', 'Full-Body Fall Safety Harnesses', 'Steel-Toe Kevlar Boots', 'High-Visibility Reflective Vests', 'Gas & Dust Respirators'],
  },
  {
    id: 'c9',
    name: 'Roofing, Cladding & Insulation',
    iconName: 'home-roof',
    color: '#F97316',
    bgGradient: ['#7C2D12', '#F97316'],
    count: '310+ Products',
    industry: 'Finishing & Architecture',
    sla: 'Custom Cut Lengths',
    popularSpec: 'Galvalume Sheets & PUF Panels',
    sub: ['Corrugated Galvalume Sheets', 'PUF Insulated Sandwich Panels', 'Polycarbonate Skylight Sheets', 'Rockwool Acoustic Insulation', 'Gutters & Accessories'],
  },
  {
    id: 'c10',
    name: 'Doors, Windows & Hardware',
    iconName: 'door-sliding',
    color: '#6366F1',
    bgGradient: ['#312E81', '#6366F1'],
    count: '380+ Products',
    industry: 'Finishing & Architecture',
    sla: 'Fire-Rated Certified',
    popularSpec: '2-Hour Fire Doors & UPVC',
    sub: ['Steel Fire-Rated Doors', 'Double-Glazed UPVC Windows', 'Heavy Duty Mortise Locks', 'Automatic Sliding Glass Systems', 'Panic Bar Assemblies'],
  },
];

const INDUSTRY_FILTERS = [
  'All Categories',
  'Civil & Structural',
  'MEP & Electrical',
  'Finishing & Architecture',
  'Heavy Equipment',
];

import { categoryApi } from '../../../api/categoryApi';

export function CategoriesScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [categories, setCategories] = useState<CategoryItem[]>(CATEGORIES_DATA);
  const [selectedFilter, setSelectedFilter] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch live categories from backend: GET /api/categories
  const fetchCategories = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const response = await categoryApi.getCategories();
      const apiData = response.data?.data || (response.data as any);
      if (Array.isArray(apiData) && apiData.length > 0) {
        // Map backend category format to screen category item
        const mapped: CategoryItem[] = apiData.map((c: any, idx: number) => ({
          id: c.id || `cat_${idx}`,
          name: c.name,
          iconName: (c.icon || 'wall') as any,
          color: c.color || CATEGORIES_DATA[idx % CATEGORIES_DATA.length]?.color || '#3B82F6',
          bgGradient: c.bgGradient || CATEGORIES_DATA[idx % CATEGORIES_DATA.length]?.bgGradient || ['#1E3A8A', '#3B82F6'],
          count: c.productCount ? `${c.productCount}+ Products` : `${c.count || '100+ Products'}`,
          industry: c.industry || 'Civil & Structural',
          sla: c.sla || 'Standard Delivery',
          popularSpec: c.popularSpec || '',
          sub: Array.isArray(c.subCategories) ? c.subCategories.map((s: any) => typeof s === 'string' ? s : s.name) : (c.sub || []),
        }));
        setCategories(mapped);
      }
    } catch (error) {
      console.log('[CategoriesScreen] API fetch fallback to standard category list');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchCategories(false);
  }, []);

  // Filter Categories dynamically based on industry and search query
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesIndustry =
        selectedFilter === 'All Categories' || cat.industry === selectedFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.sub.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cat.popularSpec && cat.popularSpec.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesIndustry && matchesSearch;
    });
  }, [categories, selectedFilter, searchQuery]);

  return (
    <Screen scrollable={false}>
      <Header
        title="Procurement Categories"
        showBack={false}
        showNotification
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {/* Top Controls: Search Bar + Layout Switcher */}
      <View style={[styles.topControlContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search 3,500+ categories or specs..."
            onClear={() => setSearchQuery('')}
          />
        </View>

        {/* View Switcher Button */}
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          style={[styles.viewToggleBtn, { backgroundColor: theme.colors.navy }]}
          activeOpacity={0.8}
        >
          <Ionicons
            name={viewMode === 'list' ? 'grid-outline' : 'list-outline'}
            size={18}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>

      {/* Industry Filter Pills Scroll Row */}
      <View style={[styles.filterScrollWrap, { borderBottomColor: theme.colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {INDUSTRY_FILTERS.map((item) => {
            const active = item === selectedFilter;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setSelectedFilter(item)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: active ? theme.colors.navy : theme.colors.surfaceVariant,
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                {active && (
                  <Ionicons
                    name="checkmark-circle"
                    size={13}
                    color={theme.colors.primary}
                    style={{ marginRight: 5 }}
                  />
                )}
                <Text
                  style={[
                    styles.filterPillText,
                    { color: active ? '#FFFFFF' : theme.colors.textSecondary },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Bulk RFQ Quick Banner */}
      <TouchableOpacity
        onPress={() => navigation.navigate('MainTabs', { screen: 'RFQTab' })}
        activeOpacity={0.9}
        style={styles.rfqBannerWrap}
      >
        <LinearGradient
          colors={['#152238', '#0B0F17']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.rfqBannerGradient}
        >
          <View style={styles.rfqBannerLeft}>
            <View style={styles.rfqIconCircle}>
              <Ionicons name="document-text-outline" size={18} color="#FDB913" />
            </View>
            <View>
              <Text style={styles.rfqBannerTitle}>Can't Find Custom Specifications?</Text>
              <Text style={styles.rfqBannerSubtitle}>Submit a direct RFQ for bulk factory orders</Text>
            </View>
          </View>

          <View style={styles.rfqActionBadge}>
            <Text style={styles.rfqActionText}>Create RFQ</Text>
            <Ionicons name="arrow-forward" size={12} color="#152238" style={{ marginLeft: 3 }} />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Category Results Count Summary */}
      <View style={styles.resultMetaRow}>
        <Text style={[styles.resultMetaText, { color: theme.colors.textSecondary }]}>
          Showing <Text style={{ color: theme.colors.navy, fontFamily: 'Inter_700Bold' }}>{filteredCategories.length}</Text> Categories
        </Text>
        <Text style={[styles.resultMetaBadge, { color: theme.colors.primary }]}>
          Wholesale Verified
        </Text>
      </View>

      {/* Main Categories Display (List or 2-Column Grid) */}
      <FlatList
        key={viewMode}
        data={filteredCategories}
        numColumns={viewMode === 'grid' ? 2 : 1}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        renderItem={({ item }) => {
          if (viewMode === 'grid') {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('ProductList', { categoryId: item.id })}
                activeOpacity={0.85}
                style={styles.gridCardWrapper}
              >
                <Card variant="outlined" style={styles.gridCardInner}>
                  <LinearGradient
                    colors={[`${item.color}25`, `${item.color}05`]}
                    style={styles.gridIconHeader}
                  >
                    <MaterialCommunityIcons name={item.iconName} size={30} color={item.color} />
                    <View style={[styles.gridCountChip, { backgroundColor: `${item.color}20` }]}>
                      <Text style={[styles.gridCountText, { color: item.color }]}>{item.count.split('+')[0]}+</Text>
                    </View>
                  </LinearGradient>

                  <View style={styles.gridBody}>
                    <Text numberOfLines={2} style={[styles.gridCatName, { color: theme.colors.textPrimary }]}>
                      {item.name}
                    </Text>

                    <View style={styles.gridSlaBadge}>
                      <Ionicons name="flash-outline" size={11} color={theme.colors.primary} style={{ marginRight: 3 }} />
                      <Text numberOfLines={1} style={[styles.gridSlaText, { color: theme.colors.textSecondary }]}>
                        {item.sla}
                      </Text>
                    </View>

                    <View style={styles.gridSubPreview}>
                      <Text numberOfLines={1} style={[styles.gridSubText, { color: theme.colors.textTertiary }]}>
                        {item.sub.slice(0, 2).join(' • ')}
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          }

          return (
            <Card
              onPress={() => navigation.navigate('ProductList', { categoryId: item.id })}
              variant="outlined"
              style={styles.catCard}
            >
              <View style={styles.catCardInner}>
                {/* Left Colored Accent Strip */}
                <View style={[styles.accentStrip, { backgroundColor: item.color }]} />

                <View style={styles.catContent}>
                  <View style={styles.catHeader}>
                    <LinearGradient
                      colors={[`${item.color}22`, `${item.color}08`]}
                      style={styles.iconWrapper}
                    >
                      <MaterialCommunityIcons name={item.iconName} size={28} color={item.color} />
                    </LinearGradient>

                    <View style={styles.catMeta}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[styles.catName, { color: theme.colors.textPrimary }]}>
                          {item.name}
                        </Text>
                        <View style={[styles.countBadge, { backgroundColor: `${item.color}18` }]}>
                          <Text style={[styles.catCount, { color: item.color }]}>{item.count}</Text>
                        </View>
                      </View>

                      {/* Specs and SLA subheader */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <View style={styles.slaChip}>
                          <Ionicons name="shield-checkmark" size={11} color={theme.colors.primary} style={{ marginRight: 3 }} />
                          <Text style={[styles.slaText, { color: theme.colors.textSecondary }]}>{item.sla}</Text>
                        </View>
                        {item.popularSpec && (
                          <Text numberOfLines={1} style={[styles.specText, { color: theme.colors.textTertiary }]}>
                            • {item.popularSpec}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={[styles.arrowCircle, { backgroundColor: `${theme.colors.primary}20` }]}>
                      <Ionicons name="chevron-forward" size={16} color={theme.colors.navy} />
                    </View>
                  </View>

                  {/* Subcategory Pills Row */}
                  <View style={styles.chipRow}>
                    {item.sub.map((sub, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => navigation.navigate('ProductList', { categoryId: item.id, subCategory: sub })}
                        activeOpacity={0.7}
                        style={[styles.subBadge, { backgroundColor: theme.colors.surfaceVariant }]}
                      >
                        <View style={[styles.chipDot, { backgroundColor: item.color }]} />
                        <Text style={[styles.subBadgeText, { color: theme.colors.textSecondary }]}>{sub}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </Card>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  viewToggleBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterScrollWrap: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 6,
  },
  filterPillText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  rfqBannerWrap: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  rfqBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(253, 185, 19, 0.35)',
    borderRadius: 14,
  },
  rfqBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rfqIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(253, 185, 19, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rfqBannerTitle: {
    color: '#FFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
  },
  rfqBannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
  rfqActionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDB913',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rfqActionText: {
    color: '#152238',
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
  },
  resultMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  resultMetaText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  resultMetaBadge: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 110,
  },
  catCard: {
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
    borderRadius: 18,
  },
  catCardInner: {
    flexDirection: 'row',
  },
  accentStrip: {
    width: 4,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  catContent: {
    flex: 1,
    padding: 14,
  },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    direction: 'ltr',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catMeta: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
  },
  catName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    flex: 1,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  catCount: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
  },
  slaChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slaText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  specText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginLeft: 4,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    direction: 'ltr',
  },
  subBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  chipDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 6,
  },
  subBadgeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  gridCardWrapper: {
    flex: 0.5,
    padding: 5,
  },
  gridCardInner: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 0,
  },
  gridIconHeader: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gridCountChip: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gridCountText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
  },
  gridBody: {
    padding: 10,
  },
  gridCatName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    height: 34,
  },
  gridSlaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  gridSlaText: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },
  gridSubPreview: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  gridSubText: {
    fontSize: 9,
    fontFamily: 'Inter_400Regular',
  },
});
