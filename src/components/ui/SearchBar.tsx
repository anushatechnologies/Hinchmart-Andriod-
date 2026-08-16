/**
 * HINCH MART — Premium Pill SearchBar with Ionicons
 * Enhanced with pill shape, focus glow, and refined inner styling
 */
import React, { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  onVoicePress?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
  style?: ViewStyle;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onClear,
  onVoicePress,
  placeholder = 'Search cement, steel, tools...',
  autoFocus = false,
  editable = true,
  style,
}: SearchBarProps) {
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    inputRef.current?.focus();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: isFocused ? theme.colors.primary : theme.colors.border,
          borderWidth: isFocused ? 1.5 : 1,
        },
        isFocused && {
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 2,
        },
        style,
      ]}
    >
      {/* Search Icon with circle background */}
      <View style={[styles.searchIconBg, { backgroundColor: `${theme.colors.primary}15` }]}>
        <Ionicons name="search" size={16} color={theme.colors.primary} />
      </View>

      {/* Text Input */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.inputPlaceholder}
        autoFocus={autoFocus}
        editable={editable}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.input, { color: theme.colors.textPrimary }]}
      />

      {/* Clear / Voice Button */}
      {value.length > 0 ? (
        <TouchableOpacity
          onPress={handleClear}
          style={styles.actionBtn}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          activeOpacity={0.6}
        >
          <View style={[styles.clearCircle, { backgroundColor: theme.colors.textTertiary }]}>
            <Ionicons name="close" size={12} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      ) : onVoicePress ? (
        <TouchableOpacity
          onPress={onVoicePress}
          style={styles.actionBtn}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          activeOpacity={0.6}
        >
          <Ionicons name="mic-outline" size={20} color={theme.colors.textTertiary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingHorizontal: 6,
    height: 48,
    width: '100%',
    direction: 'ltr',
  },
  searchIconBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    height: '100%',
    paddingVertical: 0,
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  actionBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  clearCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
