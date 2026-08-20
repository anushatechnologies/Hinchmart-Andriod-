/**
 * HINCH MART — Registration Details Screen
 *
 * Shown after OTP verification for new (unregistered) users.
 * Dynamic fields by account type with GSTIN/PAN validation.
 *
 * Account Types:
 *  - Individual: Full Name, Email
 *  - Business: Full Name, Email, Business Name, GSTIN, PAN
 *  - Contractor: Full Name, Email, Firm/Company Name, PAN
 *  - Vendor: Full Name, Email, Business Name, GSTIN, PAN
 */
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/Screen';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setCredentials, clearOtpFlow } from '../../../redux/slices/authSlice';
import { authApi } from '../../../services/api/auth.api';
import { AUTH_CONFIG } from '../../../constants/auth.config';
import { AccountType } from '../../../types/auth.types';
import { ACCOUNT_TYPES } from '../../../constants/app';

// ── Account type icons & colors ─────────────────────────────────
const ACCOUNT_TYPE_META: Record<string, { icon: string; color: string; emoji: string }> = {
  individual: { icon: 'person-outline', color: '#3B82F6', emoji: '👤' },
  business: { icon: 'business-outline', color: '#10B981', emoji: '🏢' },
  contractor: { icon: 'construct-outline', color: '#F59E0B', emoji: '🔨' },
  vendor: { icon: 'storefront-outline', color: '#8B5CF6', emoji: '🏪' },
};

interface FormErrors {
  fullName?: string;
  email?: string;
  businessName?: string;
  gstin?: string;
  pan?: string;
  companyName?: string;
}

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');

  // ── Dynamic field visibility ──────────────────────────────────
  const showBusinessFields = accountType !== 'individual';
  const showGstin = accountType === 'business' || accountType === 'vendor';
  const showPan = accountType !== 'individual';
  const showCompanyName = accountType === 'contractor';

  // ── Formatted phone display ───────────────────────────────────
  const formattedPhone = phone.length === 10
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
    : `+91 ${phone}`;

  // ── Validation ────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // Email (optional but validate format if provided)
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Business Name (required for non-individual)
    if (showBusinessFields && !showCompanyName && !businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    // Company/Firm Name (required for contractor)
    if (showCompanyName && !companyName.trim()) {
      newErrors.companyName = 'Company/Firm name is required';
    }

    // GSTIN
    if (showGstin && gstin.trim()) {
      if (!AUTH_CONFIG.gstinRegex.test(gstin.trim().toUpperCase())) {
        newErrors.gstin = 'Invalid GSTIN format (e.g., 22AAAAA0000A1Z5)';
      }
    }

    // PAN
    if (showPan && pan.trim()) {
      if (!AUTH_CONFIG.panRegex.test(pan.trim().toUpperCase())) {
        newErrors.pan = 'Invalid PAN format (e.g., ABCDE1234F)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Handle Registration ───────────────────────────────────────
  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setApiError('');

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
        // Dev mode: mock registration success
        const nameParts = fullName.trim().split(' ');
        const mockUser = {
          user: {
            id: `u_${Date.now()}`,
            email: email.trim() || `${phone}@hinchmart.com`,
            phone: `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`,
            firstName: nameParts[0] || 'New',
            lastName: nameParts.slice(1).join(' ') || 'User',
            fullName: fullName.trim(),
            avatar: null,
            accountType,
            isVerified: true,
            isPhoneVerified: true,
            isEmailVerified: !!email.trim(),
            businessProfile: showBusinessFields
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
          setApiError('Registration failed. Please try again.');
        }
      }
    } catch (err: any) {
      if (AUTH_CONFIG.developmentMode) {
        // Dev fallback — create mock and proceed
        const nameParts = fullName.trim().split(' ');
        dispatch(
          setCredentials({
            user: {
              id: `u_${Date.now()}`,
              email: email.trim() || `${phone}@hinchmart.com`,
              phone: `+91 ${phone}`,
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
        setApiError(
          err?.response?.data?.message || 'Registration failed. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Clear specific field error on change ──────────────────────
  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ██  RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <Screen scrollable>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.navy} />
        </TouchableOpacity>

        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.headerBox}>
          <Text style={[styles.title, { color: theme.colors.navy }]}>
            Complete Your Profile
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Set up your HINCH MART account
          </Text>
        </Animated.View>

        {/* Phone Verified Badge */}
        <Animated.View
          entering={FadeIn.delay(100)}
          style={[styles.verifiedBadge, { backgroundColor: `${theme.colors.success}12`, borderColor: `${theme.colors.success}30` }]}
        >
          <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
          <Text style={[styles.verifiedText, { color: theme.colors.success }]}>
            {formattedPhone} verified
          </Text>
        </Animated.View>

        {/* API Error */}
        {apiError ? (
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={[styles.errorBox, { backgroundColor: theme.colors.dangerLight }]}
          >
            <Ionicons name="alert-circle-outline" size={16} color={theme.colors.danger} />
            <Text style={[styles.errorText, { color: theme.colors.danger }]}>{apiError}</Text>
          </Animated.View>
        ) : null}

        {/* ── Account Type Selector ──────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Text style={[styles.sectionLabel, { color: theme.colors.textPrimary }]}>
            Account Type
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeScrollContent}
            style={styles.typeScrollView}
          >
            {ACCOUNT_TYPES.map((type) => {
              const meta = ACCOUNT_TYPE_META[type.value] || ACCOUNT_TYPE_META.individual;
              const isSelected = accountType === type.value;
              return (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => {
                    setAccountType(type.value as AccountType);
                    setErrors({});
                  }}
                  activeOpacity={0.7}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: isSelected ? `${meta.color}15` : theme.colors.surface,
                      borderColor: isSelected ? meta.color : theme.colors.border,
                    },
                  ]}
                >
                  <Text style={styles.typeEmoji}>{meta.emoji}</Text>
                  <Text
                    style={[
                      styles.typeLabel,
                      { color: isSelected ? meta.color : theme.colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {type.label.split('/')[0].trim()}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={16} color={meta.color} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* ── Form Fields ────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          {/* Full Name */}
          <Input
            label="Full Name *"
            value={fullName}
            onChangeText={(t) => { setFullName(t); clearError('fullName'); }}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />
          {errors.fullName && (
            <Text style={[styles.fieldError, { color: theme.colors.danger }]}>
              {errors.fullName}
            </Text>
          )}

          {/* Email (optional) */}
          <Input
            label="Email Address (Optional)"
            value={email}
            onChangeText={(t) => { setEmail(t); clearError('email'); }}
            placeholder="name@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && (
            <Text style={[styles.fieldError, { color: theme.colors.danger }]}>
              {errors.email}
            </Text>
          )}

          {/* Business Name (non-individual, non-contractor) */}
          {showBusinessFields && !showCompanyName && (
            <Animated.View entering={SlideInRight.duration(300)}>
              <Input
                label="Business Name *"
                value={businessName}
                onChangeText={(t) => { setBusinessName(t); clearError('businessName'); }}
                placeholder="Your business or company name"
              />
              {errors.businessName && (
                <Text style={[styles.fieldError, { color: theme.colors.danger }]}>
                  {errors.businessName}
                </Text>
              )}
            </Animated.View>
          )}

          {/* Company/Firm Name (contractor) */}
          {showCompanyName && (
            <Animated.View entering={SlideInRight.duration(300)}>
              <Input
                label="Company / Firm Name *"
                value={companyName}
                onChangeText={(t) => { setCompanyName(t); clearError('companyName'); }}
                placeholder="Your firm or company name"
              />
              {errors.companyName && (
                <Text style={[styles.fieldError, { color: theme.colors.danger }]}>
                  {errors.companyName}
                </Text>
              )}
            </Animated.View>
          )}

          {/* GSTIN (business, vendor) */}
          {showGstin && (
            <Animated.View entering={SlideInRight.duration(300)}>
              <Input
                label="GSTIN (Optional)"
                value={gstin}
                onChangeText={(t) => { setGstin(t.toUpperCase()); clearError('gstin'); }}
                placeholder="22AAAAA0000A1Z5"
                autoCapitalize="characters"
                maxLength={15}
              />
              {errors.gstin ? (
                <Text style={[styles.fieldError, { color: theme.colors.danger }]}>
                  {errors.gstin}
                </Text>
              ) : (
                <Text style={[styles.fieldHint, { color: theme.colors.textTertiary }]}>
                  15-character GST Identification Number
                </Text>
              )}
            </Animated.View>
          )}

          {/* PAN (business, contractor, vendor) */}
          {showPan && (
            <Animated.View entering={SlideInRight.duration(300)}>
              <Input
                label="PAN (Optional)"
                value={pan}
                onChangeText={(t) => { setPan(t.toUpperCase()); clearError('pan'); }}
                placeholder="ABCDE1234F"
                autoCapitalize="characters"
                maxLength={10}
              />
              {errors.pan ? (
                <Text style={[styles.fieldError, { color: theme.colors.danger }]}>
                  {errors.pan}
                </Text>
              ) : (
                <Text style={[styles.fieldHint, { color: theme.colors.textTertiary }]}>
                  10-character Permanent Account Number
                </Text>
              )}
            </Animated.View>
          )}
        </Animated.View>

        {/* ── Submit Button ──────────────────────────────────── */}
        <Button
          title="Create Account"
          onPress={handleRegister}
          isLoading={isLoading}
          size="lg"
          variant="primary"
          style={styles.submitBtn}
        />

        {/* Terms Footer */}
        <View style={styles.termsRow}>
          <Text style={[styles.termsText, { color: theme.colors.textTertiary }]}>
            By registering, you agree to our{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
            <Text style={[styles.termsLink, { color: theme.colors.navy }]}>Terms</Text>
          </TouchableOpacity>
          <Text style={[styles.termsText, { color: theme.colors.textTertiary }]}> & </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
            <Text style={[styles.termsLink, { color: theme.colors.navy }]}>Privacy</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

// ═══════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerBox: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    marginBottom: 20,
  },
  verifiedText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    gap: 6,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    flex: 1,
  },
  sectionLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    marginBottom: 12,
  },
  typeScrollView: {
    marginBottom: 20,
  },
  typeScrollContent: {
    gap: 8,
    paddingRight: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
  },
  typeEmoji: {
    fontSize: 18,
  },
  typeLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  fieldError: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  fieldHint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  submitBtn: {
    marginTop: 16,
    marginBottom: 16,
  },
  termsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 32,
  },
  termsText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  termsLink: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 18,
  },
});
