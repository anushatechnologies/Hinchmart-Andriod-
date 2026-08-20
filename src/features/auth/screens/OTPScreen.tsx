/**
 * HINCH MART — Dedicated OTP Verification Screen
 *
 * Full-screen OTP entry with:
 * - 6-box input with auto-advance & backspace
 * - Shake animation on error
 * - Resend countdown timer
 * - Dev mode bypass (123456)
 * - Edit phone number option
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/Screen';
import { Button } from '../../../components/ui/Button';
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

  // Format phone for display
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
          setError('Invalid OTP. Use 123456 in dev mode.');
          setIsVerifying(false);
          return;
        }

        // Dev mode: check if existing user
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
      } catch (err) {
        // Silent fail for resend
      }
    }
  };

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

        {/* Icon */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.iconSection}>
          <View style={[styles.iconCircle, { backgroundColor: `${theme.colors.primary}15` }]}>
            <Ionicons name="shield-checkmark-outline" size={40} color={theme.colors.primary} />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.headerBox}>
          <Text style={[styles.title, { color: theme.colors.navy }]}>
            Verify Your Number
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Enter the 6-digit code sent to
          </Text>
        </Animated.View>

        {/* Phone Display with Edit */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.phoneChip, { backgroundColor: theme.colors.surfaceVariant }]}
            activeOpacity={0.7}
          >
            <Ionicons name="phone-portrait-outline" size={16} color={theme.colors.navy} />
            <Text style={[styles.phoneText, { color: theme.colors.navy }]}>
              +91 {formattedPhone}
            </Text>
            <Ionicons name="pencil-outline" size={14} color={theme.colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Dev Mode Hint */}
        {AUTH_CONFIG.developmentMode && (
          <Animated.View
            entering={FadeIn.delay(300)}
            style={[styles.devHint, { backgroundColor: `${theme.colors.info}12`, borderColor: `${theme.colors.info}30` }]}
          >
            <Ionicons name="information-circle-outline" size={16} color={theme.colors.info} />
            <Text style={[styles.devHintText, { color: theme.colors.info }]}>
              Dev Mode: Enter {AUTH_CONFIG.devOtp} to verify
            </Text>
          </Animated.View>
        )}

        {/* Error */}
        {error ? (
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={[styles.errorBox, { backgroundColor: theme.colors.dangerLight }]}
          >
            <Ionicons name="alert-circle-outline" size={16} color={theme.colors.danger} />
            <Text style={[styles.errorText, { color: theme.colors.danger }]}>{error}</Text>
          </Animated.View>
        ) : null}

        {/* OTP Input */}
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
        <Button
          title="Verify & Continue"
          onPress={() => handleVerify(otpCode)}
          isLoading={isVerifying}
          disabled={otpCode.length < 6}
          size="lg"
          variant="primary"
          style={styles.verifyBtn}
        />

        {/* Resend Row */}
        <View style={styles.resendRow}>
          {countdown > 0 ? (
            <Text style={[styles.resendTimer, { color: theme.colors.textTertiary }]}>
              Didn't receive code? Resend in{' '}
              <Text style={{ color: theme.colors.navy, fontFamily: 'Poppins_600SemiBold' }}>
                {countdown}s
              </Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
              <Ionicons name="refresh-outline" size={16} color={theme.colors.primary} />
              <Text style={[styles.resendLink, { color: theme.colors.primary }]}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

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
    marginBottom: 16,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  phoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    marginBottom: 20,
  },
  phoneText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  devHint: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    gap: 6,
  },
  devHintText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    flex: 1,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    gap: 6,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    flex: 1,
  },
  otpWrapper: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  verifyBtn: {
    marginTop: 4,
    marginBottom: 20,
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
  },
  resendLink: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
});
