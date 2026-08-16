/**
 * HINCH MART — International Language & Currency Selection Screen
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { SUPPORTED_LANGUAGES, SUPPORTED_CURRENCIES, STORAGE_KEYS } from '../../../constants/app';
import { setAppLanguage } from '../../../localization';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setLanguage, setCurrency } from '../../../redux/slices/themeSlice';
import { mmkvStorage } from '../../../services/storage/mmkv';

export function LanguageCurrencyScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const currentLang = useAppSelector((state) => state.theme.language);
  const currentCurr = useAppSelector((state) => state.theme.currency);

  const handleSelectLang = (code: string) => {
    setAppLanguage(code);
    dispatch(setLanguage(code));
  };

  const handleSelectCurr = (code: string) => {
    mmkvStorage.setString(STORAGE_KEYS.CURRENCY, code);
    dispatch(setCurrency(code));
  };

  return (
    <Screen scrollable>
      <Header title="Language & Currency" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        {/* Language Selection */}
        <Text style={[styles.heading, { color: theme.colors.navy }]}>Select Application Language</Text>

        <Card variant="outlined" style={{ padding: 8, marginBottom: 24, borderRadius: 16 }}>
          {SUPPORTED_LANGUAGES.map((lang, idx) => {
            const isSelected = currentLang === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleSelectLang(lang.code)}
                activeOpacity={0.7}
                style={[
                  styles.itemRow,
                  idx < SUPPORTED_LANGUAGES.length - 1 && { borderBottomColor: theme.colors.border, borderBottomWidth: 1 },
                  isSelected && { backgroundColor: `${theme.colors.primary}15` },
                ]}
              >
                <View style={styles.leftMeta}>
                  <Ionicons
                    name="language-outline"
                    size={20}
                    color={isSelected ? theme.colors.primary : theme.colors.textTertiary}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={[styles.itemText, { color: isSelected ? theme.colors.primary : theme.colors.textPrimary }]}>
                    {lang.name} ({lang.nativeName}){lang.rtl ? ' [RTL]' : ''}
                  </Text>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />}
              </TouchableOpacity>
            );
          })}
        </Card>

        {/* Currency Selection */}
        <Text style={[styles.heading, { color: theme.colors.navy }]}>Select Display Currency</Text>

        <Card variant="outlined" style={{ padding: 8, borderRadius: 16 }}>
          {SUPPORTED_CURRENCIES.map((curr, idx) => {
            const isSelected = currentCurr === curr.code;
            return (
              <TouchableOpacity
                key={curr.code}
                onPress={() => handleSelectCurr(curr.code)}
                activeOpacity={0.7}
                style={[
                  styles.itemRow,
                  idx < SUPPORTED_CURRENCIES.length - 1 && { borderBottomColor: theme.colors.border, borderBottomWidth: 1 },
                  isSelected && { backgroundColor: `${theme.colors.primary}15` },
                ]}
              >
                <View style={styles.leftMeta}>
                  <View style={[styles.symbolBadge, { backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant }]}>
                    <Text style={[styles.symbolText, { color: isSelected ? theme.colors.navy : theme.colors.textPrimary }]}>
                      {curr.symbol}
                    </Text>
                  </View>
                  <Text style={[styles.itemText, { color: isSelected ? theme.colors.primary : theme.colors.textPrimary }]}>
                    {curr.name} ({curr.code})
                  </Text>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />}
              </TouchableOpacity>
            );
          })}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    direction: 'ltr',
  },
  leftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  symbolText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
  },
  itemText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
});
