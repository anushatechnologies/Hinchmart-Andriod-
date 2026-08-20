/**
 * HINCH MART — Premium Dynamic Registration Details Screen
 * Complete profile setup after mobile OTP verification with
 * 2x2 interactive account-type cards and real-time GSTIN/PAN validation.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInRight,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/Screen';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setCredentials, clearOtpFlow } from '../../../redux/slices/authSlice';
import { authApi } from '../../../services/api/auth.api';
import { AUTH_CONFIG } from '../../../constants/auth.config';
import { AccountType } from '../../../types/auth.types';

interface AccountOption {
  type: AccountType;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  badge: string;
}

const ACCOUNT_TIERS: AccountOption[] = [
  {
    type: 'individual',
    title: 'Individual / Home Owner',
    subtitle: 'Retail pricing for personal builds',
    icon: 'home',
    color: '#3B82F6',
    badge: 'Retail',
  },
  {
    type: 'business',
    title: 'Business / Company',
    subtitle: 'Bulk pricing & GST invoice',
    icon: 'business',
    color: '#10B981',
    badge: 'Popular',
  },
  {
    type: 'contractor',
    title: 'Contractor / Builder',
    subtitle: 'Tenders, RFQ & machinery',
    icon: 'construct',
    color: '#F59E0B',
    badge: 'B2B Pro',
  },
  {
    type: 'vendor',
    title: 'Vendor / Supplier',
    subtitle: 'Sell & supply materials',
    icon: 'storefront',
    color: '#8B5CF6',
    badge: 'Partner',
  },
];

export function RegistrationDetailsScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const phone = route?.params?.phone || useAppSelector((s) => s.auth.phone) || '';
  const registrationToken = useAppSelector((s) => s.auth.registrationToken);

  // ── Form State ────────────────────────────────────────────────
  const [accountType, setAccountType] = useState<AccountType>('business');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isBusinessTier = accountType !== 'individual';
  const showGstin = accountType === 'business' || accountType === 'vendor';
  const showCompanyName = accountType === 'contractor';

  const formattedPhone = phone.length === 10
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
    : `+91 ${phone}`;

  // ── Validation ────────────────────────────────────────────────
  const validate = () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }
    if (isBusinessTier && !showCompanyName && !businessName.trim()) {
      setError('Please enter your business name');
      return false;
    }
    if (showCompanyName && !companyName.trim()) {
      setError('Please enter your contractor / firm name');
      return false;
    }
    if (showGstin && gstin.trim() && !AUTH_CONFIG.gstinRegex.test(gstin.trim().toUpperCase())) {
      setError('Invalid GSTIN format (e.g. 22AAAAA0000A1Z5)');
      return false;
    }
    if (pan.trim() && !AUTH_CONFIG.panRegex.test(pan.trim().toUpperCase())) {
      setError('Invalid PAN format (e.g. ABCDE1234F)');
      return false;
    }
    return true;
  };

  // ── Submit Registration ───────────────────────────────────────
  const handleRegister = async () => {
    setError('');
    if (!validate()) return;

    setIsLoading(true);

    const registerData = {
      phone,
      fullName: fullName.trim(),
      email: email.trim() || undefined,
      businessName: businessName.trim() || undefined,
      accountType,
      gstin: gstin.trim().toUpperCase() || undefined,
      pan: pan.trim().toUpperCase() || undefined,
      companyName: companyName.trim() || undefined,
      registrationToken: registrationToken || undefined,
    };

    try {
      if (AUTH_CONFIG.developmentMode) {
        const nameParts = fullName.trim().split(' ');
        const mockUser = {
          user: {
            id: `u_${Date.now()}`,
            email: email.trim() || `${phone}@hinchmart.com`,
            phone: formattedPhone,
            firstName: nameParts[0] || 'New',
            lastName: nameParts.slice(1).join(' ') || 'User',
            fullName: fullName.trim(),
            avatar: null,
            accountType,
            isVerified: true,
            isPhoneVerified: true,
            isEmailVerified: !!email.trim(),
            businessProfile: isBusinessTier
              ? {
                  id: `b_${Date.now()}`,
                  companyName: companyName || businessName || `${nameParts[0]}'s Business`,
                  companyLogo: null,
                  registrationNumber: gstin || 'PENDING',
                  taxId: pan || 'PENDING',
                  industry: 'Construction & Procurement',
                  website: '',
                  description: '',
                  employeeCount: '1-10',
                  annualRevenue: '$0-$1M',
                  foundedYear: new Date().getFullYear(),
                  certifications: [],
                  isVerified: false,
                }
              : null,
            language: 'en',
            currency: 'INR',
            timezone: 'Asia/Kolkata',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          tokens: {
            accessToken: `dev_access_${Date.now()}`,
            refreshToken: `dev_refresh_${Date.now()}`,
            expiresIn: 86400,
          },
        };

        dispatch(setCredentials(mockUser as any));
        dispatch(clearOtpFlow());
        navigation.replace('MainTabs');
      } else {
        const res = await authApi.register(registerData);
        const data = res?.data?.data;

        if (data?.user && data?.tokens) {
          dispatch(setCredentials({ user: data.user, tokens: data.tokens }));
          dispatch(clearOtpFlow());
          navigation.replace('MainTabs');
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err: any) {
      if (AUTH_CONFIG.developmentMode) {
        const nameParts = fullName.trim().split(' ');
        dispatch(
          setCredentials({
            user: {
              id: `u_${Date.now()}`,
              email: email.trim() || `${phone}@hinchmart.com`,
              phone: formattedPhone,
              firstName: nameParts[0] || 'New',
              lastName: nameParts.slice(1).join(' ') || 'User',
              fullName: fullName.trim(),
              avatar: null,
              accountType,
              isVerified: true,
              isPhoneVerified: true,
              isEmailVerified: false,
              businessProfile: null,
              language: 'en',
              currency: 'INR',
              timezone: 'Asia/Kolkata',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            tokens: {
              accessToken: `dev_fallback_${Date.now()}`,
              refreshToken: `dev_fallback_r_${Date.now()}`,
              expiresIn: 86400,
            },
          } as any)
        );
        dispatch(clearOtpFlow());
        navigation.replace('MainTabs');
      } else {
        setError(err?.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen scrollable>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.container}>
          {/* ── Top Bar ────────────────────────────────────────── */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color={theme.colors.navy} />
            </TouchableOpacity>
            <View style={styles.topTitleBox}>
              <Text style={[styles.headerTitle, { color: theme.colors.navy }]}>
                Complete Profile
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                Set up your verified buyer account
              </Text>
            </View>
          </View>

          {/* Verified Phone Badge */}
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.verifiedText}>Mobile {formattedPhone} Verified</Text>
          </View>

          {/* Error Banner */}
          {error ? (
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={[styles.errorBox, { backgroundColor: theme.colors.dangerLight, borderColor: `${theme.colors.danger}40` }]}
            >
              <Ionicons name="alert-circle" size={18} color={theme.colors.danger} />
              <Text style={[styles.errorText, { color: theme.colors.danger }]}>{error}</Text>
            </Animated.View>
          ) : null}

          {/* ── Account Type Selector ──────────────────────────── */}
          <Text style={[styles.sectionLabel, { color: theme.colors.navy }]}>
            Select Account Tier
          </Text>

          <View style={styles.cardGrid}>
            {ACCOUNT_TIERS.map((item) => {
              const isSelected = accountType === item.type;
              return (
                <TouchableOpacity
                  key={item.type}
                  onPress={() => {
                    setAccountType(item.type);
                    setError('');
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.accountCard,
                    {
                      backgroundColor: isSelected ? '#FFFFFF' : theme.colors.surface,
                      borderColor: isSelected ? '#FDB913' : theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      shadowColor: isSelected ? '#FDB913' : '#000',
                      shadowOpacity: isSelected ? 0.25 : 0.04,
                    },
                  ]}
                >
                  <View style={styles.cardTopRow}>
                    <View
                      style={[
                        styles.cardIconBox,
                        { backgroundColor: isSelected ? '#FDB913' : `${item.color}15` },
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={18}
                        color={isSelected ? '#152238' : item.color}
                      />
                    </View>
                    <View
                      style={[
                        styles.cardBadge,
                        {
                          backgroundColor: isSelected ? '#152238' : `${item.color}12`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.cardBadgeText,
                          { color: isSelected ? '#FFFFFF' : item.color },
                        ]}
                      >
                        {item.badge}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.cardTitle,
                      { color: isSelected ? '#152238' : theme.colors.textPrimary },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={[styles.cardSub, { color: theme.colors.textTertiary }]}>
                    {item.subtitle}
                  </Text>

                  {isSelected && (
                    <View style={styles.selectedCheck}>
                      <Ionicons name="checkmark-circle" size={16} color="#FDB913" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Form Fields ────────────────────────────────────── */}
          <Text style={[styles.sectionLabel, { color: theme.colors.navy, marginTop: 10 }]}>
            Profile Details
          </Text>

          {/* Full Name */}
          <View style={styles.fullCol}>
            <Text style={styles.fieldLabel}>Full Name *</Text>
            <View style={[styles.inputBox, { borderColor: theme.colors.inputBorder }]}>
              <Ionicons name="person-outline" size={16} color="#868E96" style={styles.inputIcon} />
              <TextInput
                value={fullName}
                onChangeText={(t) => { setFullName(t); setError(''); }}
                placeholder="e.g. Anusha Sharma"
                placeholderTextColor={theme.colors.inputPlaceholder}
                autoCapitalize="words"
                style={styles.fieldInput}
              />
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.fullCol}>
            <Text style={styles.fieldLabel}>Email Address (Optional)</Text>
            <View style={[styles.inputBox, { borderColor: theme.colors.inputBorder }]}>
              <Ionicons name="mail-outline" size={16} color="#868E96" style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
                placeholder="name@company.com"
                placeholderTextColor={theme.colors.inputPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.fieldInput}
              />
            </View>
          </View>

          {/* Business / Contractor Fields */}
          {isBusinessTier && (
            <Animated.View entering={SlideInRight.duration(300)}>
              {!showCompanyName && (
                <View style={styles.fullCol}>
                  <Text style={styles.fieldLabel}>Business / Enterprise Name *</Text>
                  <View style={[styles.inputBox, { borderColor: theme.colors.inputBorder }]}>
                    <Ionicons name="business-outline" size={16} color="#868E96" style={styles.inputIcon} />
                    <TextInput
                      value={businessName}
                      onChangeText={(t) => { setBusinessName(t); setError(''); }}
                      placeholder="e.g. Apex Construction Materials Pvt Ltd"
                      placeholderTextColor={theme.colors.inputPlaceholder}
                      style={styles.fieldInput}
                    />
                  </View>
                </View>
              )}

              {showCompanyName && (
                <View style={styles.fullCol}>
                  <Text style={styles.fieldLabel}>Contractor / Firm Name *</Text>
                  <View style={[styles.inputBox, { borderColor: theme.colors.inputBorder }]}>
                    <Ionicons name="construct-outline" size={16} color="#868E96" style={styles.inputIcon} />
                    <TextInput
                      value={companyName}
                      onChangeText={(t) => { setCompanyName(t); setError(''); }}
                      placeholder="e.g. Supreme Builders & Infra"
                      placeholderTextColor={theme.colors.inputPlaceholder}
                      style={styles.fieldInput}
                    />
                  </View>
                </View>
              )}

              {/* GSTIN */}
              {showGstin && (
                <View style={styles.fullCol}>
                  <Text style={styles.fieldLabel}>GSTIN (Optional)</Text>
                  <View style={[styles.inputBox, { borderColor: theme.colors.inputBorder }]}>
                    <Ionicons name="receipt-outline" size={16} color="#868E96" style={styles.inputIcon} />
                    <TextInput
                      value={gstin}
                      onChangeText={(t) => { setGstin(t.toUpperCase()); setError(''); }}
                      placeholder="22AAAAA0000A1Z5"
                      placeholderTextColor={theme.colors.inputPlaceholder}
                      autoCapitalize="characters"
                      maxLength={15}
                      style={styles.fieldInput}
                    />
                  </View>
                </View>
              )}

              {/* PAN */}
              <View style={styles.fullCol}>
                <Text style={styles.fieldLabel}>PAN Number (Optional)</Text>
                <View style={[styles.inputBox, { borderColor: theme.colors.inputBorder }]}>
                  <Ionicons name="card-outline" size={16} color="#868E96" style={styles.inputIcon} />
                  <TextInput
                    value={pan}
                    onChangeText={(t) => { setPan(t.toUpperCase()); setError(''); }}
                    placeholder="ABCDE1234F"
                    placeholderTextColor={theme.colors.inputPlaceholder}
                    autoCapitalize="characters"
                    maxLength={10}
                    style={styles.fieldInput}
                  />
                </View>
              </View>
            </Animated.View>
          )}

          {/* ── Submit Button ──────────────────────────────────── */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.85}
            style={styles.submitBtn}
          >
            {isLoading ? (
              <Text style={styles.submitBtnText}>Completing Registration...</Text>
            ) : (
              <View style={styles.btnInner}>
                <Ionicons name="checkmark-circle" size={20} color="#152238" style={{ marginRight: 6 }} />
                <Text style={styles.submitBtnText}>Complete Registration</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  topTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  verifiedText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#2E7D32',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    flex: 1,
  },
  sectionLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginBottom: 10,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  accountCard: {
    width: '48.5%',
    borderRadius: 14,
    padding: 12,
    minHeight: 110,
    justifyContent: 'space-between',
    elevation: 2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
  },
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 2,
  },
  cardSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    lineHeight: 14,
  },
  selectedCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  fullCol: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#495057',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  fieldInput: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#152238',
    height: '100%',
  },
  submitBtn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#FDB913',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#FDB913',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#152238',
  },
});
