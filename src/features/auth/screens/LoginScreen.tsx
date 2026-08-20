/**
 * HINCH MART — Premium Dynamic Mobile-OTP Login Screen
 * Ultra-modern corporate UI with dynamic focus states,
 * seamless phone formatting, inline OTP, and quick demo fill.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInDown,
  Layout,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/Screen';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type LoginPhase = 'phone' | 'otp';

export function LoginScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const phoneInputRef = useRef<TextInput>(null);

  // ── State ─────────────────────────────────────────────────────
  const [phase, setPhase] = useState<LoginPhase>('phone');
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
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

    if (digits.length <= 5) {
      setFormattedPhone(digits);
    } else {
      setFormattedPhone(`${digits.slice(0, 5)} ${digits.slice(5)}`);
    }
  }, []);

  const isPhoneValid = AUTH_CONFIG.phoneRegex.test(phone);

  // ── Quick Auto-Fill Demo ──────────────────────────────────────
  const handleQuickDemoFill = () => {
    const demo = AUTH_CONFIG.devPhone;
    setPhone(demo);
    setFormattedPhone(`${demo.slice(0, 5)} ${demo.slice(5)}`);
    setError('');
  };

  // ── Clear Phone ───────────────────────────────────────────────
  const handleClearPhone = () => {
    setPhone('');
    setFormattedPhone('');
    setError('');
    phoneInputRef.current?.focus();
  };

  // ── Send OTP ──────────────────────────────────────────────────
  const handleSendOTP = async () => {
    if (!isPhoneValid) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (AUTH_CONFIG.developmentMode) {
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
    if (code.length < 6) return;

    setIsLoading(true);
    setOtpError(false);
    setError('');

    try {
      if (AUTH_CONFIG.developmentMode) {
        if (code !== AUTH_CONFIG.devOtp) {
          setOtpError(true);
          setError(`Invalid OTP. Use ${AUTH_CONFIG.devOtp} in Dev Mode.`);
          setIsLoading(false);
          return;
        }

        if (phone === AUTH_CONFIG.devPhone) {
          dispatch(setCredentials(AUTH_CONFIG.devMockUser as any));
          navigation.replace('MainTabs');
        } else {
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
            dispatch(setCredentials({ user: data.user, tokens: data.tokens }));
            navigation.replace('MainTabs');
          }
        } else {
          setOtpError(true);
          setError('Invalid OTP. Please try again.');
        }
      }
    } catch (err: any) {
      if (AUTH_CONFIG.developmentMode && code === AUTH_CONFIG.devOtp) {
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
      } catch {}
    }
  };

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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.container}>
          {/* ── Brand Logo & Header ─────────────────────────────── */}
          <Animated.View entering={FadeInDown.duration(600)} style={styles.headerSection}>
            <View style={styles.logoCard}>
              <Image
                source={require('../../../../assets/logo.png')}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>

            <Text style={[styles.title, { color: theme.colors.navy }]}>
              {phase === 'phone' ? 'Welcome to HINCH MART' : 'Verify Mobile OTP'}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {phase === 'phone'
                ? 'Everything for Every Construction. Sign in with your mobile.'
                : `Enter the 6-digit verification code sent to +91 ${formattedPhone}`}
            </Text>
          </Animated.View>

          {/* ── Dev Mode Banner ─────────────────────────────────── */}
          {AUTH_CONFIG.developmentMode && (
            <Animated.View
              entering={FadeIn.delay(200)}
              style={[styles.devBanner, { backgroundColor: '#FFF8E1', borderColor: '#FDB913' }]}
            >
              <View style={styles.devBannerHeader}>
                <View style={styles.devIconBox}>
                  <Ionicons name="flash" size={14} color="#152238" />
                </View>
                <Text style={styles.devBannerTitle}>Development & Review Mode</Text>
              </View>
              <Text style={styles.devBannerSub}>
                • Bypass OTP: <Text style={{ fontFamily: 'Poppins_600SemiBold', color: '#152238' }}>{AUTH_CONFIG.devOtp}</Text>
                {'  '}|{'  '}
                • Existing Account: <Text style={{ fontFamily: 'Poppins_600SemiBold', color: '#152238' }}>{AUTH_CONFIG.devPhone}</Text>
              </Text>
              {phase === 'phone' && (
                <TouchableOpacity
                  onPress={handleQuickDemoFill}
                  style={styles.quickFillBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="sparkles" size={13} color="#FFFFFF" />
                  <Text style={styles.quickFillText}>Auto-Fill Demo Number</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}

          {/* ── Error Banner ─────────────────────────────────────── */}
          {error ? (
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={[styles.errorBox, { backgroundColor: theme.colors.dangerLight, borderColor: `${theme.colors.danger}40` }]}
            >
              <Ionicons name="alert-circle" size={18} color={theme.colors.danger} />
              <Text style={[styles.errorText, { color: theme.colors.danger }]}>{error}</Text>
            </Animated.View>
          ) : null}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* PHASE 1: PHONE NUMBER INPUT                             */}
          {/* ═══════════════════════════════════════════════════════ */}
          {phase === 'phone' && (
            <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.formContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Mobile Number
              </Text>

              {/* Combined Phone Input Row */}
              <View
                style={[
                  styles.phoneRowWrapper,
                  {
                    backgroundColor: theme.colors.inputBackground,
                    borderColor: isPhoneFocused
                      ? theme.colors.primary
                      : isPhoneValid
                      ? theme.colors.success
                      : theme.colors.inputBorder,
                    shadowColor: isPhoneFocused ? theme.colors.primary : '#000',
                    shadowOpacity: isPhoneFocused ? 0.15 : 0.03,
                  },
                ]}
              >
                {/* Country Code Prefix */}
                <View style={[styles.prefixBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Text style={styles.flagEmoji}>🇮🇳</Text>
                  <Text style={[styles.prefixText, { color: theme.colors.navy }]}>+91</Text>
                </View>

                {/* Number TextInput */}
                <TextInput
                  ref={phoneInputRef}
                  value={formattedPhone}
                  onChangeText={handlePhoneChange}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                  placeholder="98765 43210"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  keyboardType="phone-pad"
                  maxLength={11}
                  style={[styles.phoneTextInput, { color: theme.colors.textPrimary }]}
                  returnKeyType="done"
                  onSubmitEditing={handleSendOTP}
                />

                {/* Right State Icon (Clear or Valid Checkmark) */}
                {phone.length > 0 && (
                  <TouchableOpacity
                    onPress={handleClearPhone}
                    style={styles.clearBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={isPhoneValid ? 'checkmark-circle' : 'close-circle'}
                      size={20}
                      color={isPhoneValid ? theme.colors.success : theme.colors.textTertiary}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Helper text */}
              <Text style={[styles.helperText, { color: theme.colors.textTertiary }]}>
                A 6-digit verification code will be sent via SMS
              </Text>

              {/* Continue with OTP Button */}
              <TouchableOpacity
                onPress={handleSendOTP}
                disabled={!isPhoneValid || isLoading}
                activeOpacity={0.85}
                style={[
                  styles.primaryActionBtn,
                  {
                    backgroundColor: isPhoneValid ? '#FDB913' : '#F4D37A',
                    shadowColor: '#FDB913',
                    shadowOpacity: isPhoneValid ? 0.35 : 0,
                  },
                ]}
              >
                {isLoading ? (
                  <View style={styles.btnInner}>
                    <Text style={[styles.primaryActionText, { color: '#152238' }]}>Sending OTP...</Text>
                  </View>
                ) : (
                  <View style={styles.btnInner}>
                    <Text style={[styles.primaryActionText, { color: '#152238' }]}>
                      Continue with OTP
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color="#152238" style={{ marginLeft: 6 }} />
                  </View>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerBox}>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
                <Text style={[styles.dividerLabel, { color: theme.colors.textTertiary }]}>
                  NEW TO HINCH MART?
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
              </View>

              {/* Create New Account Button */}
              <TouchableOpacity
                onPress={() => navigation.navigate('Signup')}
                activeOpacity={0.75}
                style={[styles.createAccountBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
              >
                <Ionicons name="person-add-outline" size={18} color={theme.colors.navy} />
                <Text style={[styles.createAccountText, { color: theme.colors.navy }]}>
                  Create New Account
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* PHASE 2: INLINE OTP VERIFICATION                       */}
          {/* ═══════════════════════════════════════════════════════ */}
          {phase === 'otp' && (
            <Animated.View entering={SlideInDown.duration(400)} style={styles.formContainer}>
              {/* Phone Display Chip with Edit */}
              <View style={[styles.phoneChipRow, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                <View style={styles.phoneChipLeft}>
                  <View style={[styles.phoneIconCircle, { backgroundColor: '#FDB913' }]}>
                    <Ionicons name="phone-portrait" size={14} color="#152238" />
                  </View>
                  <View>
                    <Text style={[styles.phoneChipLabel, { color: theme.colors.textSecondary }]}>Code sent to</Text>
                    <Text style={[styles.phoneChipNumber, { color: theme.colors.navy }]}>
                      +91 {formattedPhone}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={handleEditPhone} style={styles.editPhoneBtn} activeOpacity={0.7}>
                  <Ionicons name="pencil" size={14} color={theme.colors.navy} />
                  <Text style={[styles.editPhoneText, { color: theme.colors.navy }]}>Change</Text>
                </TouchableOpacity>
              </View>

              {/* OTP Boxes */}
              <View style={styles.otpSection}>
                <OTPInput
                  length={6}
                  onCodeFilled={handleVerifyOTP}
                  onCodeChanged={setOtpCode}
                  hasError={otpError}
                  autoFocus
                />
              </View>

              {/* Verify & Proceed Button */}
              <TouchableOpacity
                onPress={() => handleVerifyOTP(otpCode)}
                disabled={otpCode.length < 6 || isLoading}
                activeOpacity={0.85}
                style={[
                  styles.primaryActionBtn,
                  {
                    backgroundColor: otpCode.length >= 6 ? '#FDB913' : '#F4D37A',
                    shadowColor: '#FDB913',
                    shadowOpacity: otpCode.length >= 6 ? 0.35 : 0,
                  },
                ]}
              >
                {isLoading ? (
                  <Text style={[styles.primaryActionText, { color: '#152238' }]}>Verifying Code...</Text>
                ) : (
                  <View style={styles.btnInner}>
                    <Ionicons name="checkmark-done" size={20} color="#152238" style={{ marginRight: 6 }} />
                    <Text style={[styles.primaryActionText, { color: '#152238' }]}>
                      Verify & Proceed
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Resend Timer & Action */}
              <View style={styles.resendRow}>
                {countdown > 0 ? (
                  <Text style={[styles.resendTimerText, { color: theme.colors.textSecondary }]}>
                    Resend code in{' '}
                    <Text style={{ color: theme.colors.navy, fontFamily: 'Poppins_700Bold' }}>
                      {countdown}s
                    </Text>
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResendOTP} style={styles.resendActionBtn} activeOpacity={0.7}>
                    <Ionicons name="refresh" size={16} color={theme.colors.navy} />
                    <Text style={[styles.resendActionText, { color: theme.colors.navy }]}>
                      Resend OTP Code
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          )}

          {/* ── Terms & Privacy Footer ──────────────────────────── */}
          <View style={styles.footerSection}>
            <Text style={[styles.termsText, { color: theme.colors.textTertiary }]}>
              By continuing, you agree to our{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
              <Text style={[styles.termsLink, { color: theme.colors.navy }]}>Terms</Text>
            </TouchableOpacity>
            <Text style={[styles.termsText, { color: theme.colors.textTertiary }]}> & </Text>
            <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
              <Text style={[styles.termsLink, { color: theme.colors.navy }]}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ██  STYLES
// ═══════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    flex: 1,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCard: {
    width: 140,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#152238',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(253, 185, 19, 0.25)',
  },
  logoImage: {
    width: 120,
    height: 55,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  devBanner: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 18,
  },
  devBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  devIconBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#FDB913',
    justifyContent: 'center',
    alignItems: 'center',
  },
  devBannerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#152238',
  },
  devBannerSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#495057',
    marginBottom: 8,
  },
  quickFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#152238',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  quickFillText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#FFFFFF',
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
  formContainer: {
    width: '100%',
  },
  inputLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginBottom: 8,
  },
  phoneRowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 6,
    marginBottom: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  prefixBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    gap: 6,
  },
  flagEmoji: {
    fontSize: 18,
  },
  prefixText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
  },
  phoneTextInput: {
    flex: 1,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    paddingHorizontal: 12,
    height: '100%',
    letterSpacing: 0.5,
  },
  clearBtn: {
    padding: 8,
    marginRight: 4,
  },
  helperText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginBottom: 20,
    marginLeft: 4,
  },
  primaryActionBtn: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  dividerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    marginHorizontal: 12,
    letterSpacing: 0.8,
  },
  createAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 8,
  },
  createAccountText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  phoneChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  phoneChipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  phoneIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneChipLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  phoneChipNumber: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },
  editPhoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    gap: 4,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  editPhoneText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  otpSection: {
    marginBottom: 8,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  resendTimerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  resendActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  resendActionText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footerSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 24,
    paddingHorizontal: 12,
  },
  termsText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  termsLink: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    lineHeight: 18,
  },
});
