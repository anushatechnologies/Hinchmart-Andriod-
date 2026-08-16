/**
 * HINCH MART — OTP Verification Screen
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/Screen';
import { OTPInput } from '../../../components/ui/OTPInput';
import { Button } from '../../../components/ui/Button';
import { translate } from '../../../localization';
import { OTP_RESEND_SECONDS } from '../../../constants/app';

export function OTPScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const { email, phone } = route.params ?? {};

  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(OTP_RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = (code: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      navigation.replace('MainTabs');
    }, 1200);
  };

  const handleResend = () => {
    setCountdown(OTP_RESEND_SECONDS);
  };

  return (
    <Screen scrollable>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 36 }}>🔐</Text>
        </View>

        <Text style={[styles.title, { color: theme.colors.navy }]}>
          {translate('auth.otpTitle')}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {translate('auth.otpSubtitle')} ({email || phone || 'demo@hinchmart.com'})
        </Text>

        <OTPInput length={6} onCodeFilled={handleVerify} />

        <Button
          title="Verify & Continue"
          onPress={() => handleVerify(otpCode)}
          isLoading={isVerifying}
          disabled={otpCode.length < 6}
          size="lg"
          variant="primary"
          style={styles.verifyBtn}
        />

        <View style={styles.resendRow}>
          {countdown > 0 ? (
            <Text style={[styles.resendText, { color: theme.colors.textTertiary }]}>
              {translate('auth.resendIn')} {countdown}s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={[styles.resendLink, { color: theme.colors.primary }]}>
                {translate('auth.resendOtp')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    marginTop: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  verifyBtn: {
    marginTop: 24,
    marginBottom: 24,
  },
  resendRow: {
    alignItems: 'center',
  },
  resendText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  resendLink: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
});
