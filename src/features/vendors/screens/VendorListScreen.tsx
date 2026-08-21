/**
 * HINCH MART — Verified Suppliers & Vendors Directory
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { VendorCard } from '../../../components/cards/VendorCard';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Vendor } from '../../../types/vendor.types';

export const MOCK_VENDORS: any[] = [
  {
    id: 'v1',
    name: 'Apex Building Materials Ltd',
    logo: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=400&q=80',
    coverImage: '',
    slug: 'apex-building-materials',
    description: 'Leading distributor of structural cement, TMT rebar, and aggregate.',
    email: 'contact@apexmaterials.com',
    phone: '+91 98765 43210',
    website: 'https://apexmaterials.com',
    address: { city: 'Hyderabad', state: 'Telangana', country: 'India', fullAddress: 'Plot 405, Industrial Area, Hyderabad' },
    rating: 4.9,
    reviewCount: 320,
    productCount: 140,
    orderCount: 1250,
    isVerified: true,
    isFeatured: true,
    categories: ['Cement & Concrete', 'TMT Steel'],
    certifications: ['ISO 9001', 'BIS Certified'],
    minimumOrder: 5000,
    currency: 'INR',
    responseTime: '< 15 mins',
    memberSince: '2022',
    performance: { onTimeDelivery: 99, qualityScore: 98, responseRate: 100, fulfillmentRate: 99, returnRate: 0.5 },
  },
  {
    id: 'v2',
    name: 'Tata Steel Direct Hub',
    logo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
    coverImage: '',
    slug: 'tata-steel-direct',
    description: 'Official distributor of genuine Tata Tiscon Fe 500D / 550D TMT rebar.',
    email: 'sales@tatasteeldirect.com',
    phone: '+91 98765 43211',
    website: 'https://tatasteeldirect.com',
    address: { city: 'Secunderabad', state: 'Telangana', country: 'India', fullAddress: 'Hub 12, Logistics Park, Secunderabad' },
    rating: 4.8,
    reviewCount: 450,
    productCount: 85,
    orderCount: 3400,
    isVerified: true,
    isFeatured: true,
    categories: ['Steel & Rebar'],
    certifications: ['BIS 1786', 'GreenPro'],
    minimumOrder: 10000,
    currency: 'INR',
    responseTime: '< 30 mins',
    memberSince: '2021',
    performance: { onTimeDelivery: 98, qualityScore: 100, responseRate: 95, fulfillmentRate: 98, returnRate: 0.2 },
  },
];

const VENDOR_SPECIALIZATIONS = ['All', 'Cement & Concrete', 'TMT Steel', 'Plumbing', 'Power Tools', 'Machinery'];

export function VendorListScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');

  const filteredVendors = MOCK_VENDORS.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <Screen scrollable={false}>
      <Header
        title="Verified Suppliers"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search verified manufacturers, distributors..."
        />
      </View>

      {/* Specialization Filter Pills */}
      <View style={[styles.filterScrollWrap, { borderBottomColor: theme.colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {VENDOR_SPECIALIZATIONS.map((spec) => {
            const isSelected = selectedSpec === spec;
            return (
              <TouchableOpacity
                key={spec}
                onPress={() => setSelectedSpec(spec)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? theme.colors.navy : theme.colors.surfaceVariant,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    {
                      color: isSelected ? '#FFFFFF' : theme.colors.textSecondary,
                      fontFamily: isSelected ? 'Poppins_600SemiBold' : 'Inter_500Medium',
                    },
                  ]}
                >
                  {spec}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Vendors Grid / List */}
      <FlatList
        data={filteredVendors}
        contentContainerStyle={styles.listPadding}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VendorCard
            vendor={item}
            onPress={() => navigation.navigate('VendorDetail', { vendorId: item.id })}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  filterScrollWrap: {
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
  },
  listPadding: {
    padding: 16,
    paddingBottom: 40,
  },
});
