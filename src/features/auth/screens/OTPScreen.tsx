/**
 * HINCH MART — Premium Dynamic OTP Verification Screen
 * High-aesthetic OTP verification with animated digit boxes,
 * phone editing chip, resend countdown, and dev-mode auto fill.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/Screen';
import { OTPInput } from '../../../components/ui/OTPInput';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  setCredentials,
  setIsNewUser,
  setRegistrationToken,
} from '../../../redux/slices/authSlice';
import { authApi } from '../../../services/api/auth.api';
import { AUTH_CONFIG } from '../../../constants/auth.config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function OTPScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const routePhone = route?.params?.phone || '';
  const storedPhone = useAppSelector((state) => state.auth.phone);
  const phone = routePhone || storedPhone || '';

  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState<number>(AUTH_CONFIG.resendSeconds);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState(false);

  const formattedPhone = phone.length === 10
    ? `${phone.slice(0, 5)} ${phone.slice(5)}`
    : phone;

  // ── Countdown timer ───────────────────────────────────────────
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // ── Verify OTP ────────────────────────────────────────────────
  const handleVerify = async (code: string) => {
    if (code.length < 6) return;

    setIsVerifying(true);
    setError('');
    setOtpError(false);

    try {
      if (AUTH_CONFIG.developmentMode) {
        if (code !== AUTH_CONFIG.devOtp) {
          setOtpError(true);
          setError(`Invalid OTP. Enter ${AUTH_CONFIG.devOtp} in Dev Mode.`);
          setIsVerifying(false);
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
          setError('Invalid OTP code. Please try again.');
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
        setError(err?.response?.data?.message || 'Verification failed. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────
  const handleResend = async () => {
    setCountdown(AUTH_CONFIG.resendSeconds);
    setError('');
    setOtpError(false);
    setOtpCode('');

    if (!AUTH_CONFIG.developmentMode) {
      try {
        await authApi.resendOTP({ phone, type: 'login' });
      } catch {}
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
          {/* Top Bar */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={theme.colors.navy} />
          </TouchableOpacity>

          {/* Central Animated Badge */}
          <Animated.View entering={FadeInDown.duration(500)} style={styles.iconSection}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={38} color="#152238" />
            </View>
          </Animated.View>

          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.headerBox}>
            <Text style={[styles.title, { color: theme.colors.navy }]}>
              OTP Verification
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Enter the 6-digit code sent to your mobile number
            </Text>
          </Animated.View>

          {/* Phone Display Chip */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <View style={[styles.phoneChip, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
              <Ionicons name="phone-portrait" size={16} color={theme.colors.navy} />
              <Text style={[styles.phoneText, { color: theme.colors.navy }]}>
                +91 {formattedPhone}
              </Text>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.editPill}>
                <Ionicons name="pencil" size={12} color="#152238" />
                <Text style={styles.editPillText}>Change</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Dev Mode Tip */}
          {AUTH_CONFIG.developmentMode && (
            <Animated.View
              entering={FadeIn.delay(300)}
              style={styles.devHint}
            >
              <Ionicons name="flash" size={14} color="#152238" />
              <Text style={styles.devHintText}>
                Dev Mode: Enter code <Text style={{ fontFamily: 'Poppins_700Bold' }}>{AUTH_CONFIG.devOtp}</Text>
              </Text>
            </Animated.View>
          )}

          {/* Error Banner */}
          {error ? (
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={[styles.errorBox, { backgroundColor: theme.colors.dangerLight }]}
            >
              <Ionicons name="alert-circle" size={16} color={theme.colors.danger} />
              <Text style={[styles.errorText, { color: theme.colors.danger }]}>{error}</Text>
            </Animated.View>
          ) : null}

          {/* OTP Input Boxes */}
          <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.otpWrapper}>
            <OTPInput
              length={6}
              onCodeFilled={handleVerify}
              onCodeChanged={setOtpCode}
              hasError={otpError}
              autoFocus
            />
          </Animated.View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={() => handleVerify(otpCode)}
            disabled={otpCode.length < 6 || isVerifying}
            activeOpacity={0.85}
            style={[
              styles.verifyBtn,
              {
                backgroundColor: otpCode.length >= 6 ? '#FDB913' : '#F4D37A',
                shadowColor: '#FDB913',
                shadowOpacity: otpCode.length >= 6 ? 0.35 : 0,
              },
            ]}
          >
            {isVerifying ? (
              <Text style={styles.verifyBtnText}>Verifying...</Text>
            ) : (
              <View style={styles.btnInner}>
                <Ionicons name="checkmark-done" size={20} color="#152238" style={{ marginRight: 6 }} />
                <Text style={styles.verifyBtnText}>Verify & Continue</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Resend Row */}
          <View style={styles.resendRow}>
            {countdown > 0 ? (
              <Text style={[styles.resendTimer, { color: theme.colors.textSecondary }]}>
                Didn't receive code? Resend in{' '}
                <Text style={{ color: theme.colors.navy, fontFamily: 'Poppins_700Bold' }}>
                  {countdown}s
                </Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} style={styles.resendBtn} activeOpacity={0.7}>
                <Ionicons name="refresh" size={16} color={theme.colors.navy} />
                <Text style={[styles.resendLink, { color: theme.colors.navy }]}>
                  Resend OTP Code
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
    paddingTop: 16,
    paddingBottom: 32,
    flex: 1,
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
    marginBottom: 20,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FDB913',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FDB913',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 16,
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
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 20,
  },
  phoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    marginBottom: 16,
  },
  phoneText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDB913',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 3,
  },
  editPillText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#152238',
  },
  devHint: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FDB913',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
    marginBottom: 12,
  },
  devHintText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#152238',
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
  otpWrapper: {
    marginBottom: 12,
  },
  verifyBtn: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#152238',
  },
  resendRow: {
    alignItems: 'center',
  },
  resendTimer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  resendLink: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
