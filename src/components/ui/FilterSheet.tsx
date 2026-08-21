/**
 * HINCH MART — FilterSheet Modal Component
 * Construction-specific dynamic filter sheet
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Button } from './Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface FilterValues {
  brand?: string;
  grade?: string;
  priceRange?: string;
  inStockOnly?: boolean;
  minRating?: number;
}

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
  availableBrands?: string[];
  availableGrades?: string[];
}

const DEFAULT_BRANDS = [
  'UltraTech',
  'Tata Tiscon',
  'JSW Steel',
  'ACC Limited',
  'Ambuja Cement',
  'Astral Pipes',
  'Asian Paints',
  'Havells',
  'JCB Fleet',
];

const DEFAULT_GRADES = [
  'OPC 53 Grade',
  'PPC 43 Grade',
  'Fe 500D',
  'Fe 550D',
  '12mm',
  '16mm',
  '20mm',
  'M-20 Concreting',
];

const PRICE_RANGES = [
  { id: 'under_500', label: 'Under ₹500' },
  { id: '500_2000', label: '₹500 - ₹2,000' },
  { id: '2000_10000', label: '₹2,000 - ₹10,000' },
  { id: 'above_10000', label: '₹10,000 & Above' },
];

export function FilterSheet({
  visible,
  onClose,
  onApply,
  initialFilters = {},
  availableBrands = DEFAULT_BRANDS,
  availableGrades = DEFAULT_GRADES,
}: FilterSheetProps) {
  const { theme, isDark } = useTheme();
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    initialFilters.brand
  );
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>(
    initialFilters.grade
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | undefined>(
    initialFilters.priceRange
  );
  const [inStockOnly, setInStockOnly] = useState<boolean>(
    initialFilters.inStockOnly ?? false
  );
  const [minRating, setMinRating] = useState<number | undefined>(
    initialFilters.minRating
  );

  const handleReset = () => {
    setSelectedBrand(undefined);
    setSelectedGrade(undefined);
    setSelectedPriceRange(undefined);
    setInStockOnly(false);
    setMinRating(undefined);
  };

  const handleApply = () => {
    onApply({
      brand: selectedBrand,
      grade: selectedGrade,
      priceRange: selectedPriceRange,
      inStockOnly,
      minRating,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
          activeOpacity={1}
        />

        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {/* Top Handle */}
          <View style={styles.handleWrap}>
            <View
              style={[
                styles.handle,
                { backgroundColor: theme.colors.border },
              ]}
            />
          </View>

          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.colors.navy }]}>
              Filters
            </Text>
            <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
              <Text style={[styles.resetText, { color: theme.colors.primary }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* 1. Brands Section */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Brand
            </Text>
            <View style={styles.chipRow}>
              {availableBrands.map((brand) => {
                const isSelected = selectedBrand === brand;
                return (
                  <TouchableOpacity
                    key={brand}
                    onPress={() =>
                      setSelectedBrand(isSelected ? undefined : brand)
                    }
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected
                          ? `${theme.colors.primary}20`
                          : theme.colors.surfaceVariant,
                        borderColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected
                            ? theme.colors.navy
                            : theme.colors.textPrimary,
                          fontFamily: isSelected
                            ? 'Inter_700Bold'
                            : 'Inter_500Medium',
                        },
                      ]}
                    >
                      {brand}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 2. Construction Grade / Specification */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Grade / Specification
            </Text>
            <View style={styles.chipRow}>
              {availableGrades.map((grade) => {
                const isSelected = selectedGrade === grade;
                return (
                  <TouchableOpacity
                    key={grade}
                    onPress={() =>
                      setSelectedGrade(isSelected ? undefined : grade)
                    }
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected
                          ? `${theme.colors.primary}20`
                          : theme.colors.surfaceVariant,
                        borderColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected
                            ? theme.colors.navy
                            : theme.colors.textPrimary,
                          fontFamily: isSelected
                            ? 'Inter_700Bold'
                            : 'Inter_500Medium',
                        },
                      ]}
                    >
                      {grade}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 3. Price Range */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Price Range
            </Text>
            <View style={styles.chipRow}>
              {PRICE_RANGES.map((pr) => {
                const isSelected = selectedPriceRange === pr.id;
                return (
                  <TouchableOpacity
                    key={pr.id}
                    onPress={() =>
                      setSelectedPriceRange(isSelected ? undefined : pr.id)
                    }
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected
                          ? `${theme.colors.primary}20`
                          : theme.colors.surfaceVariant,
                        borderColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected
                            ? theme.colors.navy
                            : theme.colors.textPrimary,
                          fontFamily: isSelected
                            ? 'Inter_700Bold'
                            : 'Inter_500Medium',
                        },
                      ]}
                    >
                      {pr.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 4. Availability & Rating */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Availability & Rating
            </Text>
            <TouchableOpacity
              onPress={() => setInStockOnly(!inStockOnly)}
              style={[
                styles.checkboxRow,
                { borderBottomColor: theme.colors.border },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.checkboxLabel, { color: theme.colors.textPrimary }]}>
                In Stock Items Only
              </Text>
              <Ionicons
                name={inStockOnly ? 'checkbox' : 'square-outline'}
                size={22}
                color={inStockOnly ? theme.colors.primary : theme.colors.textTertiary}
              />
            </TouchableOpacity>

            <View style={styles.ratingFilterRow}>
              {[4.5, 4.0, 3.5].map((stars) => {
                const isSelected = minRating === stars;
                return (
                  <TouchableOpacity
                    key={stars}
                    onPress={() =>
                      setMinRating(isSelected ? undefined : stars)
                    }
                    style={[
                      styles.ratingChip,
                      {
                        backgroundColor: isSelected
                          ? `${theme.colors.primary}20`
                          : theme.colors.surfaceVariant,
                        borderColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="star" size={14} color="#FDB913" />
                    <Text
                      style={[
                        styles.ratingChipText,
                        { color: theme.colors.textPrimary },
                      ]}
                    >
                      {stars}+
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Action footer */}
          <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
            <Button
              title="Apply Filters"
              onPress={handleApply}
              variant="primary"
              size="lg"
              style={{ width: '100%' }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    maxHeight: SCREEN_HEIGHT * 0.85,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 8,
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
  resetText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  scrollArea: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginTop: 14,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  checkboxLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  ratingFilterRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 20,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  ratingChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12.5,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
