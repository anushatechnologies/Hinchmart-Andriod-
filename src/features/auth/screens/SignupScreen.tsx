/**
 * HINCH MART — Premium Dynamic Create Account Screen
 * Modern corporate multi-tier registration with rich account cards,
 * dynamic company/GST/PAN fields, and real-time field validation.
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
import { AccountType } from '../../../types/auth.types';
import { useAppDispatch } from '../../../redux/hooks';
import { setCredentials } from '../../../redux/slices/authSlice';
import { AUTH_CONFIG } from '../../../constants/auth.config';

interface AccountCardOption {
  type: AccountType;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  badge: string;
}

const ACCOUNT_CARD_OPTIONS: AccountCardOption[] = [
  {
    type: 'individual',
    title: 'Individual / Home Owner',
    subtitle: 'For personal home build & renovations',
    icon: 'home',
    color: '#3B82F6',
    badge: 'Retail',
  },
  {
    type: 'business',
    title: 'Business / Company',
    subtitle: 'Bulk orders, GST billing & credit lines',
    icon: 'business',
    color: '#10B981',
    badge: 'Popular',
  },
  {
    type: 'contractor',
    title: 'Contractor / Builder',
    subtitle: 'Project tenders, RFQ & heavy machinery',
    icon: 'construct',
    color: '#F59E0B',
    badge: 'B2B Pro',
  },
  {
    type: 'vendor',
    title: 'Vendor / Supplier',
    subtitle: 'Sell materials & lease equipment',
    icon: 'storefront',
    color: '#8B5CF6',
    badge: 'Partner',
  },
];

export function SignupScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  // ── Form State ────────────────────────────────────────────────
  const [accountType, setAccountType] = useState<AccountType>('business');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Conditional visibility ────────────────────────────────────
  const isBusinessTier = accountType !== 'individual';
  const showGstinField = accountType === 'business' || accountType === 'vendor';

  // ── Validation ────────────────────────────────────────────────
  const validate = () => {
    if (!firstName.trim()) {
      setError('Please enter your first name');
      return false;
    }
    if (!lastName.trim()) {
      setError('Please enter your last name');
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }
    if (phone.trim() && !AUTH_CONFIG.phoneRegex.test(phone.replace(/\D/g, ''))) {
      setError('Mobile phone must be a 10-digit number');
      return false;
    }
    if (isBusinessTier && !companyName.trim()) {
      setError('Please enter your company or firm name');
      return false;
    }
    if (gstin.trim() && !AUTH_CONFIG.gstinRegex.test(gstin.trim().toUpperCase())) {
      setError('Invalid GSTIN format (e.g. 22AAAAA0000A1Z5)');
      return false;
    }
    if (pan.trim() && !AUTH_CONFIG.panRegex.test(pan.trim().toUpperCase())) {
      setError('Invalid PAN format (e.g. ABCDE1234F)');
      return false;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  // ── Submit Account Creation ───────────────────────────────────
  const handleCreateAccount = () => {
    setError('');
    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const userPayload = {
        user: {
          id: `u_${Date.now()}`,
          email: email.trim().toLowerCase(),
          phone: phone ? `+91 ${phone.replace(/\D/g, '')}` : '+91 98765 43210',
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          fullName: `${firstName.trim()} ${lastName.trim()}`,
          avatar: null,
          accountType,
          isVerified: true,
          isPhoneVerified: !!phone,
          isEmailVerified: true,
          businessProfile: isBusinessTier
            ? {
                id: `b_${Date.now()}`,
                companyName: companyName.trim(),
                companyLogo: null,
                registrationNumber: gstin.trim().toUpperCase() || 'PENDING',
                taxId: pan.trim().toUpperCase() || 'PENDING',
                industry: 'Construction & Building Procurement',
                website: 'https://hinchmart.com',
                description: 'Verified buyer/contractor profile',
                employeeCount: '10-50',
                annualRevenue: '$1M-$5M',
                foundedYear: new Date().getFullYear(),
                certifications: ['Verified Member'],
                isVerified: true,
              }
            : null,
          language: 'en',
          currency: 'INR',
          timezone: 'Asia/Kolkata',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        tokens: {
          accessToken: `access_token_${Date.now()}`,
          refreshToken: `refresh_token_${Date.now()}`,
          expiresIn: 86400,
        },
      };

      dispatch(setCredentials(userPayload as any));
      navigation.replace('MainTabs');
    }, 600);
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
                Create Account
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                Join HINCH MART for verified procurement
              </Text>
            </View>
          </View>

          {/* ── Error Banner ───────────────────────────────────── */}
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
            Select Account Type
          </Text>

          <View style={styles.cardGrid}>
            {ACCOUNT_CARD_OPTIONS.map((item) => {
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
            Personal & Contact Details
          </Text>

          {/* First Name & Last Name (Side by Side) */}
          <View style={styles.rowTwo}>
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>First Name *</Text>
              <View style={[styles.inputBox, { borderColor: theme.colors.inputBorder }]}>
                <Ionicons name="person-outline" size={16} color="#868E96" style={styles.inputIcon} />
                <TextInput
                  value={firstName}
                  onChangeText={(t) => { setFirstName(t); setError(''); }}
                  placeholder="John"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  style={styles.fieldInput}
                />
              </View>
            </View>

            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>Last Name *</Text>
              <View style={[styles.inputBox, { borderColor: theme.colors.inputBorder }]}>
                <Ionicons name="person-outline" size={16} color="#868E96" style={styles.inputIcon} />
                <TextInput
                  value={lastName}
                  onChangeText={(t) => { setLastName(t); setError(''); }}
                  placeholder="Doe"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  style={styles.fieldInput}
                />
              </View>
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.fullCol}>
            <Text style={styles.fieldLabel}>Email Address *</Text>
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

          {/* Mobile Phone */}
          <View style={styles.fullCol}>
            <Text style={styles.fieldLabel}>Mobile Phone (Optional)</Text>
            <View style={[styles.inputBox, { borderColor: theme.colors.inputBorder }]}>
              <Text style={{ fontSize: 16, marginRight: 6 }}>🇮🇳</Text>
              <Text style={[styles.phonePrefix, { color: theme.colors.navy }]}>+91</Text>
              <TextInput
                value={phone}
                onChangeText={(t) => { setPhone(t); setError(''); }}
                placeholder="98765 43210"
                placeholderTextColor={theme.colors.inputPlaceholder}
                keyboardType="phone-pad"
                maxLength={10}
                style={styles.fieldInput}
              />
            </View>
          </View>

          {/* ── Business Details Section ──────────────────────── */}
          {isBusinessTier && (
            <Animated.View entering={SlideInRight.duration(300)}>
              <Text style={[styles.sectionLabel, { color: theme.colors.navy, marginTop: 10 }]}>
                Company / Business Details
              </Text>

              {/* Company Name */}
              <View style={styles.fullCol}>
                <Text style={styles.fieldLabel}>Company / Firm Name *</Text>
                <View style={[styles.inputBox, { borderColor: theme.colors.inputBorder }]}>
                  <Ionicons name="business-outline" size={16} color="#868E96" style={styles.inputIcon} />
                  <TextInput
                    value={companyName}
                    onChangeText={(t) => { setCompanyName(t); setError(''); }}
                    placeholder="e.g. Apex Global Construction Ltd"
                    placeholderTextColor={theme.colors.inputPlaceholder}
                    style={styles.fieldInput}
                  />
                </View>
              </View>

              {/* GSTIN */}
              {showGstinField && (
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

          {/* ── Password ───────────────────────────────────────── */}
          <Text style={[styles.sectionLabel, { color: theme.colors.navy, marginTop: 10 }]}>
            Security
          </Text>
          <View style={styles.fullCol}>
            <Text style={styles.fieldLabel}>Password *</Text>
            <View style={[styles.inputBox, { borderColor: theme.colors.inputBorder }]}>
              <Ionicons name="lock-closed-outline" size={16} color="#868E96" style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={(t) => { setPassword(t); setError(''); }}
                placeholder="••••••••"
                placeholderTextColor={theme.colors.inputPlaceholder}
                secureTextEntry={!showPassword}
                style={styles.fieldInput}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#868E96"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Submit Button ──────────────────────────────────── */}
          <TouchableOpacity
            onPress={handleCreateAccount}
            disabled={isLoading}
            activeOpacity={0.85}
            style={styles.submitBtn}
          >
            {isLoading ? (
              <Text style={styles.submitBtnText}>Creating Account...</Text>
            ) : (
              <View style={styles.btnInner}>
                <Ionicons name="checkmark-circle" size={20} color="#152238" style={{ marginRight: 6 }} />
                <Text style={styles.submitBtnText}>Create Account</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* ── Already have account? ──────────────────────────── */}
          <View style={styles.loginPrompt}>
            <Text style={[styles.promptText, { color: theme.colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, { color: theme.colors.navy }]}>
                Sign In with Mobile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

// ═══════════════════════════════════════════════════════════════════
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
    marginBottom: 16,
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
  rowTwo: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  halfCol: {
    flex: 1,
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
  phonePrefix: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginRight: 6,
  },
  fieldInput: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#152238',
    height: '100%',
  },
  eyeBtn: {
    padding: 6,
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
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  promptText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  loginLink: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
