/**
 * HINCH MART — SortSheet Modal Component
 */
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export type SortOptionId =
  | 'recommended'
  | 'popular'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'discount';

interface SortSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: SortOptionId;
  onSelect: (sortId: SortOptionId) => void;
}

const SORT_OPTIONS: Array<{ id: SortOptionId; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { id: 'recommended', label: 'Recommended (Best Match)', icon: 'sparkles-outline' },
  { id: 'popular', label: 'Most Popular & Best Sellers', icon: 'flame-outline' },
  { id: 'newest', label: 'New Arrivals', icon: 'calendar-outline' },
  { id: 'price_asc', label: 'Price: Low to High', icon: 'trending-up-outline' },
  { id: 'price_desc', label: 'Price: High to Low', icon: 'trending-down-outline' },
  { id: 'rating', label: 'Customer Rating: High to Low', icon: 'star-outline' },
  { id: 'discount', label: 'Discount: Highest First', icon: 'pricetag-outline' },
];

export function SortSheet({
  visible,
  onClose,
  selectedSort,
  onSelect,
}: SortSheetProps) {
  const { theme, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
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

          <Text style={[styles.title, { color: theme.colors.navy }]}>
            Sort Products By
          </Text>

          <View style={styles.optionsList}>
            {SORT_OPTIONS.map((opt) => {
              const isSelected = selectedSort === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => {
                    onSelect(opt.id);
                    onClose();
                  }}
                  style={[
                    styles.optionRow,
                    isSelected && {
                      backgroundColor: isDark ? 'rgba(253, 185, 19, 0.08)' : 'rgba(253, 185, 19, 0.06)',
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionLeft}>
                    <Ionicons
                      name={opt.icon}
                      size={18}
                      color={isSelected ? theme.colors.primary : theme.colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.optionLabel,
                        {
                          color: isSelected ? theme.colors.navy : theme.colors.textPrimary,
                          fontFamily: isSelected ? 'Poppins_600SemiBold' : 'Inter_500Medium',
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioOuter,
                      { borderColor: isSelected ? theme.colors.primary : theme.colors.border },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: theme.colors.primary },
                        ]}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 8,
    paddingBottom: 24,
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
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  optionsList: {
    paddingHorizontal: 12,
    marginTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    fontSize: 13.5,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
