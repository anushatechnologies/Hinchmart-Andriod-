/**
 * HINCH MART — Login Screen (Mobile OTP Flow)
 *
 * Phase 1: Enter 10-digit mobile number
 * Phase 2: Inline 6-digit OTP verification
 * Dev mode: 123456 auto-accepted, 9876543210 = existing user
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInDown,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/Screen';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { OTPInput } from '../../../components/ui/OTPInput';
import { useAppDispatch } from '../../../redux/hooks';
import {
  setCredentials,
  setPhone as setPhoneAction,
  setOtpRequestId,
  setIsNewUser,
  setRegistrationToken,
} from '../../../redux/slices/authSlice';
import { authApi } from '../../../services/api/auth.api';
import { AUTH_CONFIG } from '../../../constants/auth.config';
import { gradients } from '../../../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type LoginPhase = 'phone' | 'otp';

export function LoginScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  // ── State ─────────────────────────────────────────────────────
  const [phase, setPhase] = useState<LoginPhase>('phone');
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpCode, setOtpCode] = useState('');

  // ── Countdown timer for resend ────────────────────────────────
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // ── Phone formatting (98765 43210) ────────────────────────────
  const handlePhoneChange = useCallback((text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
    setError('');

    // Format: 98765 43210
    if (digits.length <= 5) {
      setFormattedPhone(digits);
    } else {
      setFormattedPhone(`${digits.slice(0, 5)} ${digits.slice(5)}`);
    }
  }, []);

  // ── Validate phone ───────────────────────────────────────────
  const isPhoneValid = AUTH_CONFIG.phoneRegex.test(phone);

  // ── Send OTP ──────────────────────────────────────────────────
  const handleSendOTP = async () => {
    if (!isPhoneValid) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (AUTH_CONFIG.developmentMode) {
        // Dev mode: skip API call
        dispatch(setPhoneAction(phone));
        dispatch(setOtpRequestId('dev_otp_request'));
        setPhase('otp');
        setCountdown(AUTH_CONFIG.resendSeconds);
      } else {
        const res = await authApi.sendOTP({ phone });
        if (res?.data?.data) {
          dispatch(setPhoneAction(phone));
          dispatch(setOtpRequestId(res.data.data.otpRequestId));
          setPhase('otp');
          setCountdown(AUTH_CONFIG.resendSeconds);
        } else {
          setError('Failed to send OTP. Please try again.');
        }
      }
    } catch (err: any) {
      if (AUTH_CONFIG.developmentMode) {
        // Fallback in dev mode
        dispatch(setPhoneAction(phone));
        setPhase('otp');
        setCountdown(AUTH_CONFIG.resendSeconds);
      } else {
        setError(err?.response?.data?.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Verify OTP ────────────────────────────────────────────────
  const handleVerifyOTP = async (code: string) => {
    setIsLoading(true);
    setOtpError(false);
    setError('');

    try {
      if (AUTH_CONFIG.developmentMode) {
        // Dev mode validation
        if (code !== AUTH_CONFIG.devOtp) {
          setOtpError(true);
          setError('Invalid OTP. Use 123456 in dev mode.');
          setIsLoading(false);
          return;
        }

        // Check if existing user (dev phone)
        if (phone === AUTH_CONFIG.devPhone) {
          // Existing user → go to Home
          dispatch(setCredentials(AUTH_CONFIG.devMockUser as any));
          navigation.replace('MainTabs');
        } else {
          // New user → go to Registration
          dispatch(setIsNewUser(true));
          dispatch(setRegistrationToken('dev_reg_token'));
          navigation.navigate('RegistrationDetails', { phone });
        }
      } else {
        const res = await authApi.verifyOTP({ phone, otp: code });
        const data = res?.data?.data;

        if (data) {
          if (data.isNewUser) {
            dispatch(setIsNewUser(true));
            dispatch(setRegistrationToken(data.registrationToken || null));
            navigation.navigate('RegistrationDetails', { phone });
          } else if (data.user && data.tokens) {
            dispatch(
              setCredentials({
                user: data.user,
                tokens: data.tokens,
              })
            );
            navigation.replace('MainTabs');
          }
        } else {
          setOtpError(true);
          setError('Invalid OTP. Please try again.');
        }
      }
    } catch (err: any) {
      if (AUTH_CONFIG.developmentMode && code === AUTH_CONFIG.devOtp) {
        // Dev fallback
        if (phone === AUTH_CONFIG.devPhone) {
          dispatch(setCredentials(AUTH_CONFIG.devMockUser as any));
          navigation.replace('MainTabs');
        } else {
          dispatch(setIsNewUser(true));
          navigation.navigate('RegistrationDetails', { phone });
        }
      } else {
        setOtpError(true);
        setError(err?.response?.data?.message || 'Invalid OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────
  const handleResendOTP = async () => {
    setCountdown(AUTH_CONFIG.resendSeconds);
    setError('');
    setOtpError(false);

    if (!AUTH_CONFIG.developmentMode) {
      try {
        await authApi.resendOTP({ phone, type: 'login' });
      } catch (err) {
        // Silent fail for resend
      }
    }
  };

  // ── Back to phone phase ───────────────────────────────────────
  const handleEditPhone = () => {
    setPhase('phone');
    setError('');
    setOtpError(false);
    setOtpCode('');
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
        {/* ── Brand Header ─────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.headerBox}>
          <View style={styles.logoRow}>
            <Image
              source={require('../../../../assets/logo.png')}
              style={styles.logoImage}
              contentFit="contain"
            />
          </View>
          <Text style={[styles.title, { color: theme.colors.navy }]}>
            {phase === 'phone' ? 'Welcome Back' : 'Verify OTP'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {phase === 'phone'
              ? 'Enter your mobile number to continue'
              : `We've sent a 6-digit code to +91 ${formattedPhone}`}
          </Text>
        </Animated.View>

        {/* ── Dev Mode Badge ───────────────────────────────────── */}
        {AUTH_CONFIG.developmentMode && (
          <Animated.View
            entering={FadeIn.delay(200)}
            style={[styles.devBadge, { backgroundColor: `${theme.colors.warning}18`, borderColor: `${theme.colors.warning}50` }]}
          >
            <Ionicons name="bug-outline" size={16} color={theme.colors.warning} />
            <Text style={[styles.devBadgeText, { color: theme.colors.warning }]}>
              Dev Mode — OTP: {AUTH_CONFIG.devOtp} | Existing: {AUTH_CONFIG.devPhone}
            </Text>
          </Animated.View>
        )}

        {/* ── Error Banner ─────────────────────────────────────── */}
        {error ? (
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={[styles.errorBox, { backgroundColor: theme.colors.dangerLight }]}
          >
            <Ionicons name="alert-circle-outline" size={18} color={theme.colors.danger} />
            <Text style={[styles.errorText, { color: theme.colors.danger }]}>{error}</Text>
          </Animated.View>
        ) : null}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* PHASE 1: PHONE INPUT                                   */}
        {/* ═══════════════════════════════════════════════════════ */}
        {phase === 'phone' && (
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            {/* Phone Input */}
            <View style={styles.phoneInputRow}>
              <View style={[styles.countryCode, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                <Text style={[styles.flagText]}>🇮🇳</Text>
                <Text style={[styles.codeText, { color: theme.colors.textPrimary }]}>+91</Text>
              </View>
              <View style={styles.phoneInputWrapper}>
                <Input
                  label=""
                  value={formattedPhone}
                  onChangeText={handlePhoneChange}
                  placeholder="98765 43210"
                  keyboardType="phone-pad"
                  maxLength={11}
                  style={styles.phoneInput}
                />
              </View>
            </View>

            {/* Continue Button */}
            <Button
              title="Continue with OTP"
              onPress={handleSendOTP}
              isLoading={isLoading}
              disabled={!isPhoneValid}
              size="lg"
              variant="primary"
              style={styles.ctaButton}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.textTertiary }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            </View>

            {/* Skip to Signup */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Signup')}
              style={[styles.secondaryBtn, { borderColor: theme.colors.border }]}
            >
              <Ionicons name="person-add-outline" size={18} color={theme.colors.navy} />
              <Text style={[styles.secondaryBtnText, { color: theme.colors.navy }]}>
                Create New Account
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* PHASE 2: OTP INPUT                                     */}
        {/* ═══════════════════════════════════════════════════════ */}
        {phase === 'otp' && (
          <Animated.View entering={SlideInDown.duration(400)}>
            {/* Phone display with edit */}
            <TouchableOpacity
              onPress={handleEditPhone}
              style={[styles.phoneDisplayRow, { backgroundColor: theme.colors.surfaceVariant }]}
            >
              <View style={styles.phoneDisplayLeft}>
                <Ionicons name="phone-portrait-outline" size={18} color={theme.colors.navy} />
                <Text style={[styles.phoneDisplayText, { color: theme.colors.textPrimary }]}>
                  +91 {formattedPhone}
                </Text>
              </View>
              <View style={styles.editBadge}>
                <Ionicons name="pencil-outline" size={14} color={theme.colors.primary} />
                <Text style={[styles.editText, { color: theme.colors.primary }]}>Edit</Text>
              </View>
            </TouchableOpacity>

            {/* OTP Input Boxes */}
            <View style={styles.otpSection}>
              <Text style={[styles.otpLabel, { color: theme.colors.textSecondary }]}>
                Enter 6-digit OTP
              </Text>
              <OTPInput
                length={6}
                onCodeFilled={handleVerifyOTP}
                onCodeChanged={setOtpCode}
                hasError={otpError}
                autoFocus
              />
            </View>

            {/* Verify Button */}
            <Button
              title="Verify & Continue"
              onPress={() => handleVerifyOTP(otpCode)}
              isLoading={isLoading}
              disabled={otpCode.length < 6}
              size="lg"
              variant="primary"
              style={styles.ctaButton}
            />

            {/* Resend Timer */}
            <View style={styles.resendRow}>
              {countdown > 0 ? (
                <Text style={[styles.resendTimer, { color: theme.colors.textTertiary }]}>
                  Resend OTP in{' '}
                  <Text style={{ color: theme.colors.navy, fontFamily: 'Poppins_600SemiBold' }}>
                    {countdown}s
                  </Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendOTP} style={styles.resendBtn}>
                  <Ionicons name="refresh-outline" size={16} color={theme.colors.primary} />
                  <Text style={[styles.resendLink, { color: theme.colors.primary }]}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}

        {/* ── Terms & Privacy ──────────────────────────────────── */}
        <Animated.View entering={FadeIn.delay(500)} style={styles.termsRow}>
          <Text style={[styles.termsText, { color: theme.colors.textTertiary }]}>
            By continuing, you agree to our{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
            <Text style={[styles.termsLink, { color: theme.colors.navy }]}>Terms</Text>
          </TouchableOpacity>
          <Text style={[styles.termsText, { color: theme.colors.textTertiary }]}> & </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
            <Text style={[styles.termsLink, { color: theme.colors.navy }]}>Privacy Policy</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

// ═══════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    marginTop: 10,
  },
  headerBox: {
    marginBottom: 24,
    alignItems: 'center',
  },
  logoRow: {
    marginBottom: 20,
  },
  logoImage: {
    width: SCREEN_WIDTH * 0.5,
    height: 80,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  devBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    gap: 6,
  },
  devBadgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    flex: 1,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    flex: 1,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
    gap: 8,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
    minHeight: 52,
  },
  flagText: {
    fontSize: 20,
  },
  codeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },
  phoneInputWrapper: {
    flex: 1,
  },
  phoneInput: {
    marginBottom: 0,
  },
  ctaButton: {
    marginTop: 8,
    marginBottom: 20,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginHorizontal: 12,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 8,
    marginBottom: 20,
  },
  secondaryBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },
  phoneDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  phoneDisplayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneDisplayText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  editBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  otpSection: {
    marginBottom: 4,
  },
  otpLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    marginBottom: 4,
    textAlign: 'center',
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendTimer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resendLink: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  termsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: 16,
    paddingBottom: 24,
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
