/**
 * HINCH MART — OTP Verification Screen (Frontend-Only)
 *
 * Manual OTP: 123456
 * - Existing user (9876543210) → MainTabs
 * - New user → RegistrationDetails
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Button } from '../../../components/ui/Button';
import { authStore } from '../../../store/authStore';
import { AUTH_CONFIG } from '../../../config/authConfig';

const OTP_LENGTH = 6;
const RESEND_SECONDS = AUTH_CONFIG.resendSeconds || 45;

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10) {
    return `+91 XXXXX ${digits.slice(-5)}`;
  }
  return phone;
}

export function OTPScreen({ route, navigation }: any) {
  const { theme, isDark } = useTheme();
  const { phone = '+919876543210', purpose = 'login' } = route?.params ?? {};

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const inputRefs = useRef<Array<TextInput | null>>(
    Array.from({ length: OTP_LENGTH }, () => null)
  );

  // Countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Autofocus
  useEffect(() => {
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 250);
    return () => clearTimeout(t);
  }, []);

  // ── Verify OTP ─────────────────────────────────────────────────────────────
  const triggerVerify = useCallback(
    async (otpDigits: string[]) => {
      const otpCode = otpDigits.join('');
      if (otpCode.length < OTP_LENGTH || isVerifying) return;

      setIsVerifying(true);
      setError('');

      try {
        // Simulate short processing time
        await new Promise((r) => setTimeout(r, 400));

        // ── FRONTEND-ONLY VALIDATION ────────────────────────────────────────
        if (otpCode !== AUTH_CONFIG.developmentOtp) {
          throw new Error('Invalid OTP. Please enter the correct OTP.');
        }

        // Check if existing user
        const clean = (p: string) => p.replace(/\D/g, '').slice(-10);
        const last10 = clean(phone);
        const isExisting = AUTH_CONFIG.mockExistingUsers.map(clean).includes(last10);

        setSuccessMsg('OTP verified successfully!');
        await new Promise((r) => setTimeout(r, 450));

        // Retrieve existing profile or generate user profile for the phone number
        const existingProfile =
          AUTH_CONFIG.mockExistingUserProfiles[last10] ||
          AUTH_CONFIG.mockExistingUserProfiles['9876543210'];

        const userProfile = existingProfile || {
          id: `usr_${last10 || Date.now()}`,
          phone: phone.startsWith('+91') ? phone : `+91${phone}`,
          firstName: 'User',
          lastName: last10.slice(-4) || 'Member',
          fullName: `User ${last10.slice(-4) || ''}`.trim(),
          email: null,
          accountType: 'individual' as const,
          businessProfile: null,
          isVerified: true,
          isPhoneVerified: true,
          isEmailVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Save authenticated session locally and into Redux
        await authStore.saveSession({
          user: userProfile,
          accessToken: `mock_access_${Date.now()}`,
          refreshToken: `mock_refresh_${Date.now()}`,
        });

        // Navigate directly to HOME (MainTabs)
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      } catch (err: any) {
        setError(err?.message || 'Invalid OTP. Please enter the correct OTP.');
        setDigits(Array(OTP_LENGTH).fill(''));
        setFocusedIndex(0);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } finally {
        setIsVerifying(false);
      }
    },
    [phone, isVerifying, navigation]
  );

  // ── Input handlers ──────────────────────────────────────────────────────────
  const handleChangeText = useCallback(
    (text: string, index: number) => {
      setError('');
      setSuccessMsg('');

      if (text.length > 1) {
        const pasted = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
        const next = Array(OTP_LENGTH).fill('');
        pasted.split('').forEach((d, i) => { next[i] = d; });
        setDigits(next);
        const target = Math.min(pasted.length, OTP_LENGTH - 1);
        setFocusedIndex(target);
        inputRefs.current[target]?.focus();
        if (pasted.length === OTP_LENGTH) triggerVerify(next);
        return;
      }

      const digit = text.replace(/\D/g, '').slice(0, 1);
      const next = [...digits];
      next[index] = digit;
      setDigits(next);

      if (digit && index < OTP_LENGTH - 1) {
        setFocusedIndex(index + 1);
        inputRefs.current[index + 1]?.focus();
      }
      if (digit && index === OTP_LENGTH - 1) {
        inputRefs.current[index]?.blur();
        triggerVerify(next);
      }
    },
    [digits, triggerVerify]
  );

  const handleKeyPress = useCallback(
    (e: any, index: number) => {
      if (e.nativeEvent.key === 'Backspace') {
        setError('');
        const next = [...digits];
        if (next[index]) {
          next[index] = '';
          setDigits(next);
        } else if (index > 0) {
          next[index - 1] = '';
          setDigits(next);
          setFocusedIndex(index - 1);
          inputRefs.current[index - 1]?.focus();
        }
      }
    },
    [digits]
  );

  const handleResend = async () => {
    if (countdown > 0) return;
    setDigits(Array(OTP_LENGTH).fill(''));
    setError('');
    setSuccessMsg('');
    setFocusedIndex(0);
    setCountdown(RESEND_SECONDS);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const isComplete = digits.join('').length === OTP_LENGTH;

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#0A0F1E' : '#F4F6FB' }]}>
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
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#2D3748' : '#E8EDF5',
              },
            ]}
          >
            {/* Back */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              disabled={isVerifying}
            >
              <Ionicons name="arrow-back" size={20} color={isDark ? '#F1F5F9' : '#152238'} />
              <Text style={[styles.backText, { color: isDark ? '#F1F5F9' : '#152238' }]}>Back</Text>
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(253, 185, 19, 0.12)' }]}>
                <Ionicons name="shield-checkmark" size={28} color="#FDB913" />
              </View>
              <Text style={[styles.title, { color: isDark ? '#F1F5F9' : '#152238' }]}>
                Verify Your Number
              </Text>
              <Text style={[styles.subtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                OTP sent to
              </Text>
              <Text style={[styles.phone, { color: isDark ? '#FDB913' : '#152238' }]}>
                {maskPhone(phone)}
              </Text>
            </View>

            {/* Dev Banner */}
            {AUTH_CONFIG.developmentMode && (
              <View style={styles.devBanner}>
                <Ionicons name="construct" size={13} color="#B45309" />
                <Text style={styles.devText}>
                  Development OTP:{' '}
                  <Text style={styles.devOtp}>{AUTH_CONFIG.developmentOtp}</Text>
                </Text>
              </View>
            )}

            {/* OTP Boxes */}
            <View style={styles.otpRow}>
              {digits.map((digit, index) => {
                const isFoc = focusedIndex === index;
                return (
                  <TextInput
                    key={index}
                    ref={(r) => { inputRefs.current[index] = r; }}
                    value={digit}
                    onChangeText={(t) => handleChangeText(t, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    onFocus={() => setFocusedIndex(index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    caretHidden
                    style={[
                      styles.otpBox,
                      {
                        backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                        color: isDark ? '#F1F5F9' : '#152238',
                        borderColor: error
                          ? '#EF4444'
                          : successMsg
                          ? '#10B981'
                          : isFoc
                          ? '#FDB913'
                          : digit
                          ? '#64748B'
                          : isDark
                          ? '#334155'
                          : '#DDE3EE',
                        borderWidth: isFoc ? 2.5 : 1.5,
                      },
                    ]}
                  />
                );
              })}
            </View>

            {/* Status Messages */}
            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={15} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : successMsg ? (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                <Text style={styles.successText}>{successMsg}</Text>
              </View>
            ) : null}

            {/* Timer / Resend */}
            <View style={styles.resendSection}>
              {countdown > 0 ? (
                <Text style={[styles.countdownText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Resend OTP in{' '}
                  <Text style={{ fontFamily: 'Poppins_600SemiBold', color: '#FDB913' }}>
                    {countdown}s
                  </Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
                  <Ionicons name="refresh" size={14} color="#FDB913" />
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Verify Button */}
            <Button
              title={isVerifying ? 'Verifying...' : 'Verify OTP'}
              onPress={() => triggerVerify(digits)}
              isLoading={isVerifying}
              disabled={isVerifying || !isComplete}
              size="lg"
              variant="primary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  topStrip: { height: 6, width: '100%' },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderWidth: 1,
    ...Platform.select({
      ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 16 },
      android: { elevation: 3 },
    }),
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  backText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(253, 185, 19, 0.2)',
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  phone: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginTop: 2,
    textAlign: 'center',
  },
  devBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  devText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#78350F',
  },
  devOtp: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: '#B45309',
    letterSpacing: 2,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  otpBox: {
    flex: 1,
    height: 58,
    borderRadius: 14,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
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
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#EF4444',
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 16,
  },
  successText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#10B981',
    flex: 1,
  },
  resendSection: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    marginBottom: 20,
  },
  countdownText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  resendText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#FDB913',
  },
});

export default OTPScreen;
