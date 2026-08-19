/**
 * HINCH MART — Registration Details Screen (Frontend-Only)
 *
 * Profile completion for NEW users after OTP verification or direct registration.
 * No backend call — creates mock user and saves session locally.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { authStore } from '../../../store/authStore';
import { AccountType, User } from '../../../types/auth.types';

const ACCOUNT_TYPES: Array<{
  value: AccountType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  desc: string;
}> = [
  { value: 'individual', label: 'Individual',  icon: 'person-outline',    desc: 'Personal use'      },
  { value: 'business',   label: 'Business',    icon: 'business-outline',  desc: 'Company account'   },
  { value: 'contractor', label: 'Contractor',  icon: 'construct-outline', desc: 'Project work'      },
  { value: 'vendor',     label: 'Vendor',      icon: 'storefront-outline',desc: 'Sell on platform'  },
];

const COMPANY_REQUIRED: AccountType[] = ['business', 'contractor', 'vendor'];

export function RegistrationDetailsScreen({ route, navigation }: any) {
  const { theme, isDark } = useTheme();
  const { verificationToken, phone: initialPhone = '', directRegister = false } = route?.params ?? {};

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(initialPhone.replace(/\+91/, ''));
  const [accountType, setAccountType] = useState<AccountType>('individual');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const needsCompany = COMPANY_REQUIRED.includes(accountType);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!firstName.trim()) errs.firstName = 'First name is required.';
    if (!lastName.trim()) errs.lastName = 'Last name is required.';
    
    // Validate phone if direct register or if empty
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      errs.phone = 'Phone number is required.';
    } else if (cleanPhone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (needsCompany && !companyName.trim()) {
      errs.companyName = `Company name is required for ${accountType} accounts.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateAccount = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 450));

      const cleanPhone = phone.replace(/\D/g, '');

      const mockUser: User = {
        id: `usr_${Date.now()}`,
        phone: `+91${cleanPhone}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim() || null,
        accountType,
        businessProfile: needsCompany && companyName.trim()
          ? { companyName: companyName.trim() }
          : null,
        isVerified: true,
        isPhoneVerified: true,
        isEmailVerified: !!email.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await authStore.saveSession({
        user: mockUser,
        accessToken: `mock_access_${Date.now()}`,
        refreshToken: `mock_refresh_${Date.now()}`,
      });

      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (err: any) {
      setErrors({ submit: err?.message || 'Unable to create account. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountTypeChange = (type: AccountType) => {
    setAccountType(type);
    if (!COMPANY_REQUIRED.includes(type)) {
      setCompanyName('');
      if (errors.companyName) {
        const next = { ...errors };
        delete next.companyName;
        setErrors(next);
      }
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#0A0F1E' : '#FFFFFF' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#152238" />
      <LinearGradient colors={['#152238', '#1A3050']} style={styles.topStrip} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back to Login Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={isDark ? '#F1F5F9' : '#0B2240'} />
            <Text style={[styles.backText, { color: isDark ? '#F1F5F9' : '#0B2240' }]}>
              Back to Login
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#2D3748' : '#E5E7EB',
              },
            ]}
          >
            {/* Header */}
            <View style={styles.cardHeader}>
              <LinearGradient
                colors={['#0B2240', '#1A3050']}
                style={styles.headerGradient}
              >
                <View style={styles.headerContent}>
                  <View style={styles.headerIconCircle}>
                    <Ionicons name="person-add" size={22} color="#FDB913" />
                  </View>
                  <Text style={styles.headerTitle}>Create Account</Text>
                  <Text style={styles.headerSub}>
                    Fill in all registration fields to get started
                  </Text>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.formBody}>
              {/* Error Banner */}
              {errors.submit ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={15} color="#EF4444" />
                  <Text style={styles.errorBannerText}>{errors.submit}</Text>
                </View>
              ) : null}

              {/* First Name Field */}
              <Input
                label="First Name *"
                value={firstName}
                onChangeText={(v) => {
                  setFirstName(v);
                  if (errors.firstName) setErrors({ ...errors, firstName: '' });
                }}
                placeholder="Enter your first name"
                autoCapitalize="words"
                error={errors.firstName}
              />

              {/* Last Name Field */}
              <Input
                label="Last Name *"
                value={lastName}
                onChangeText={(v) => {
                  setLastName(v);
                  if (errors.lastName) setErrors({ ...errors, lastName: '' });
                }}
                placeholder="Enter your last name"
                autoCapitalize="words"
                error={errors.lastName}
              />

              {/* Mobile Number Input */}
              <Input
                label="Mobile Number *"
                value={phone}
                onChangeText={(v) => {
                  setPhone(v.replace(/\D/g, '').slice(0, 10));
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder="Enter 10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                error={errors.phone}
              />

              {/* Email */}
              <Input
                label="Email Address (Optional)"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="yourname@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              {/* Account Type */}
              <View style={styles.sectionGroup}>
                <Text style={[styles.sectionLabel, { color: isDark ? '#CBD5E1' : '#374151' }]}>
                  Account Type *
                </Text>
                <View style={styles.typeGrid}>
                  {ACCOUNT_TYPES.map((type) => {
                    const selected = accountType === type.value;
                    return (
                      <TouchableOpacity
                        key={type.value}
                        onPress={() => handleAccountTypeChange(type.value)}
                        activeOpacity={0.75}
                        style={[
                          styles.typeBtn,
                          {
                            backgroundColor: selected
                              ? '#152238'
                              : isDark
                              ? '#0F172A'
                              : '#F9FAFB',
                            borderColor: selected
                              ? '#FDB913'
                              : isDark
                              ? '#334155'
                              : '#E5E7EB',
                            borderWidth: selected ? 2 : 1,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.typeIconBg,
                            {
                              backgroundColor: selected
                                ? 'rgba(253, 185, 19, 0.15)'
                                : isDark
                                ? '#1E293B'
                                : '#F3F4F6',
                            },
                          ]}
                        >
                          <Ionicons
                            name={type.icon}
                            size={18}
                            color={selected ? '#FDB913' : isDark ? '#64748B' : '#9CA3AF'}
                          />
                        </View>
                        <Text
                          style={[
                            styles.typeLabel,
                            {
                              color: selected
                                ? '#FFFFFF'
                                : isDark
                                ? '#F1F5F9'
                                : '#111827',
                              fontFamily: selected
                                ? 'Inter_600SemiBold'
                                : 'Inter_500Medium',
                            },
                          ]}
                        >
                          {type.label}
                        </Text>
                        <Text
                          style={[
                            styles.typeDesc,
                            {
                              color: selected
                                ? 'rgba(255,255,255,0.6)'
                                : isDark
                                ? '#64748B'
                                : '#9CA3AF',
                            },
                          ]}
                        >
                          {type.desc}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Company Name (conditional) */}
              {needsCompany && (
                <Input
                  label="Company Name *"
                  value={companyName}
                  onChangeText={(v) => {
                    setCompanyName(v);
                    if (errors.companyName) setErrors({ ...errors, companyName: '' });
                  }}
                  placeholder="Enter your company name"
                  autoCapitalize="words"
                  error={errors.companyName}
                />
              )}

              {/* Submit */}
              <Button
                title={isLoading ? 'Creating Account...' : 'Create Account'}
                onPress={handleCreateAccount}
                isLoading={isLoading}
                disabled={isLoading}
                size="lg"
                variant="primary"
                style={styles.submitBtn}
              />

              {/* Terms */}
              <Text style={[styles.termsText, { color: isDark ? '#64748B' : '#9CA3AF' }]}>
                By creating an account, you agree to HINCH MART's{' '}
                <Text style={{ color: '#FDB913' }}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={{ color: '#FDB913' }}>Privacy Policy</Text>.
              </Text>

              {/* Already have an account */}
              <View style={styles.loginGroup}>
                <Text style={[styles.loginText, { color: isDark ? '#94A3B8' : '#6B7280' }]}>
                  Already have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.7}
                  style={styles.loginLinkContainer}
                >
                  <Text style={styles.loginLinkText}>Login</Text>
                  <Ionicons name="arrow-forward" size={14} color="#F59E0B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  topStrip: { height: 6 },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    width: '100%',
    maxWidth: 480,
    marginBottom: 16,
    paddingVertical: 4,
  },
  backText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16 },
      android: { elevation: 4 },
    }),
  },
  cardHeader: {
    overflow: 'hidden',
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingVertical: 22,
  },
  headerContent: {
    alignItems: 'flex-start',
    gap: 6,
  },
  headerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(253, 185, 19, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: '#FFFFFF',
    marginTop: 2,
  },
  headerSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  formBody: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  verifiedPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  verifiedLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginBottom: 2,
  },
  verifiedPhone: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16,185,129,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  verifiedBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#10B981',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 16,
  },
  errorBannerText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#EF4444',
    flex: 1,
  },
  sectionGroup: { marginBottom: 20 },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeBtn: {
    width: '47%',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'flex-start',
    gap: 6,
  },
  typeIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  typeLabel: {
    fontSize: 14,
  },
  typeDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  submitBtn: {
    marginTop: 8,
    marginBottom: 14,
  },
  termsText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  loginGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  loginText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  loginLinkText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#F59E0B',
  },
});

export default RegistrationDetailsScreen;
