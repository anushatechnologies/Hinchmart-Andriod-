/**
 * HINCH MART — AddressCard Component
 * Reusable card for Address Management and Checkout Selection
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Address } from '../../types/order.types';

export interface AddressCardProps {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  showActions?: boolean;
  style?: ViewStyle;
}

export function AddressCard({
  address,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  showActions = false,
  style,
}: AddressCardProps) {
  const { theme, isDark } = useTheme();

  const getIconForLabel = (label: string): keyof typeof Ionicons.glyphMap => {
    const l = label.toLowerCase();
    if (l.includes('site') || l.includes('project') || l.includes('warehouse')) return 'business-outline';
    if (l.includes('work') || l.includes('office') || l.includes('headquarters')) return 'briefcase-outline';
    return 'home-outline';
  };

  return (
    <Card
      onPress={onSelect}
      variant="outlined"
      style={[
        styles.card,
        selected && {
          borderColor: theme.colors.primary,
          borderWidth: 2,
          backgroundColor: isDark ? 'rgba(253, 185, 19, 0.05)' : 'rgba(253, 185, 19, 0.03)',
        },
        style,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.labelRow}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${theme.colors.primary}18` },
            ]}
          >
            <Ionicons
              name={getIconForLabel(address.label || '')}
              size={16}
              color={theme.colors.navy}
            />
          </View>
          <Text style={[styles.labelText, { color: theme.colors.navy }]}>
            {address.label || 'Project Site'}
          </Text>
        </View>

        <View style={styles.badgeRow}>
          {address.isDefault && (
            <Badge label="DEFAULT SITE" variant="navy" size="sm" />
          )}
          {onSelect !== undefined && (
            <View
              style={[
                styles.radioOuter,
                { borderColor: selected ? theme.colors.primary : theme.colors.border },
              ]}
            >
              {selected && (
                <View
                  style={[
                    styles.radioInner,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
              )}
            </View>
          )}
        </View>
      </View>

      <Text style={[styles.recipientName, { color: theme.colors.textPrimary }]}>
        {address.fullName || (address as any).name || 'Site Manager'}
      </Text>

      <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
        {address.addressLine1}
        {address.addressLine2 ? `, ${address.addressLine2}` : ''}
      </Text>
      <Text style={[styles.cityText, { color: theme.colors.textSecondary }]}>
        {address.city}{address.state ? `, ${address.state}` : ''} - {address.postalCode}
      </Text>

      <View style={styles.phoneRow}>
        <Ionicons name="call-outline" size={13} color={theme.colors.textTertiary} />
        <Text style={[styles.phoneText, { color: theme.colors.textTertiary }]}>
          {address.phone}
        </Text>
      </View>

      {showActions && (
        <View style={[styles.actionsRow, { borderTopColor: theme.colors.border }]}>
          {!address.isDefault && onSetDefault && (
            <TouchableOpacity
              onPress={onSetDefault}
              style={styles.actionBtn}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionBtnText, { color: theme.colors.textSecondary }]}>
                Set as Default
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.actionRight}>
            {onEdit && (
              <TouchableOpacity
                onPress={onEdit}
                style={[styles.actionIconBtn, { backgroundColor: `${theme.colors.primary}15` }]}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={15} color={theme.colors.navy} />
                <Text style={[styles.actionIconText, { color: theme.colors.navy }]}>Edit</Text>
              </TouchableOpacity>
            )}

            {onDelete && (
              <TouchableOpacity
                onPress={onDelete}
                style={[styles.actionIconBtn, { backgroundColor: `${theme.colors.danger}15` }]}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={15} color={theme.colors.danger} />
                <Text style={[styles.actionIconText, { color: theme.colors.danger }]}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  recipientName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  addressText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  cityText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12.5,
    marginTop: 2,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  phoneText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 12,
  },
  actionBtn: {
    paddingVertical: 4,
  },
  actionBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  actionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  actionIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  actionIconText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
});
