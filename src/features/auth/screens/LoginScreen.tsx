/**
 * HINCHMART — Login Screen
 * Pixel-perfect, ultra-clean responsive layout for all mobile screen sizes.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authStore } from '../../../store/authStore';
import { AUTH_CONFIG } from '../../../config/authConfig';

const NAVY = '#0A2540';
const ORANGE = '#F47B20';
const BORDER = '#E5E7EB';
const MUTED = '#9CA3AF';
const ERR = '#EF4444';
const OTP_LENGTH = 6;
const RESEND_SECONDS = AUTH_CONFIG.resendSeconds || 45;

export function LoginScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();

  // State
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const phoneRef = useRef<TextInput>(null);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [otpFocusedIndex, setOtpFocusedIndex] = useState(0);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');

  const otpInputRefs = useRef<Array<TextInput | null>>(
    Array.from({ length: OTP_LENGTH }, () => null)
  );

  // Countdown timer
  useEffect(() => {
    if (!otpSent || countdown <= 0) return;
    const t = setTimeout(() => setCountdown((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [otpSent, countdown]);

  const onPhoneChange = (t: string) => {
    setPhone(t.replace(/\D/g, '').slice(0, 10));
    if (error) setError('');
    if (otpSent) {
      setOtpSent(false);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setOtpError('');
    }
  };

  const fillOtp = useCallback((code: string) => {
    const arr = code.split('').slice(0, OTP_LENGTH);
    while (arr.length < OTP_LENGTH) arr.push('');
    setOtpDigits(arr);
    setOtpFocusedIndex(OTP_LENGTH - 1);
    setOtpError('');
  }, []);

  const onContinue = async () => {
    if (!phone) {
      setError('Please enter your mobile number.');
      phoneRef.current?.focus();
      return;
    }
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      phoneRef.current?.focus();
      return;
    }
    if (!/^[6-9]/.test(phone)) {
      setError('Mobile number must start with 6, 7, 8 or 9.');
      phoneRef.current?.focus();
      return;
    }

    try {
      setLoading(true);
      setError('');
      setOtpError('');
      await new Promise((r) => setTimeout(r, 350));
      setOtpSent(true);
      setCountdown(RESEND_SECONDS);

      const code = AUTH_CONFIG.developmentOtp || '123456';
      fillOtp(code);
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (countdown > 0 || loading || isVerifying) return;
    try {
      setLoading(true);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setOtpError('');
      await new Promise((r) => setTimeout(r, 300));
      setCountdown(RESEND_SECONDS);
      const code = AUTH_CONFIG.developmentOtp || '123456';
      fillOtp(code);
    } finally {
      setLoading(false);
    }
  };

  const onChangeNumber = () => {
    setOtpSent(false);
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    setOtpError('');
    setTimeout(() => {
      phoneRef.current?.focus();
    }, 100);
  };

  const onVerify = async () => {
    const otpCode = otpDigits.join('');
    if (otpCode.length < OTP_LENGTH || isVerifying) return;

    setIsVerifying(true);
    setOtpError('');

    try {
      await new Promise((r) => setTimeout(r, 400));

      if (otpCode !== AUTH_CONFIG.developmentOtp && otpCode !== '123456') {
        throw new Error('Invalid OTP. Please enter the correct OTP.');
      }

      const clean = (p: string) => p.replace(/\D/g, '').slice(-10);
      const last10 = clean(phone);

      const existingProfile =
        AUTH_CONFIG.mockExistingUserProfiles[last10] ||
        AUTH_CONFIG.mockExistingUserProfiles['9876543210'];

      const userProfile = existingProfile || {
        id: `usr_${last10 || Date.now()}`,
        phone: `+91${last10}`,
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

      await authStore.saveSession({
        user: userProfile,
        accessToken: `mock_access_${Date.now()}`,
        refreshToken: `mock_refresh_${Date.now()}`,
      });

      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (err: any) {
      setOtpError(err?.message || 'Invalid OTP. Please enter the correct OTP.');
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setOtpFocusedIndex(0);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    setOtpError('');

    if (text.length > 1) {
      const pasted = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
      const next = Array(OTP_LENGTH).fill('');
      pasted.split('').forEach((d, i) => {
        next[i] = d;
      });
      setOtpDigits(next);
      const target = Math.min(pasted.length, OTP_LENGTH - 1);
      setOtpFocusedIndex(target);
      otpInputRefs.current[target]?.focus();
      return;
    }

    const digit = text.replace(/\D/g, '').slice(0, 1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);

    if (digit && index < OTP_LENGTH - 1) {
      setOtpFocusedIndex(index + 1);
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      setOtpError('');
      const next = [...otpDigits];
      if (next[index]) {
        next[index] = '';
        setOtpDigits(next);
      } else if (index > 0) {
        next[index - 1] = '';
        setOtpDigits(next);
        setOtpFocusedIndex(index - 1);
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };

  const onRegister = () =>
    navigation.navigate('Register', { phone: phone ? `+91${phone}` : '', directRegister: true });

  const isOtpComplete = otpDigits.join('').length === OTP_LENGTH;
  const formWidth = Math.min(W - 48, 380);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Decorative dot pattern top-right */}
      <View style={[s.dotGrid, { top: insets.top + 8 }]} pointerEvents="none">
        {Array.from({ length: 6 }).map((_, r) => (
          <View key={r} style={s.dotRow}>
            {Array.from({ length: 5 }).map((_, c) => (
              <View
                key={c}
                style={[s.dot, { opacity: Math.max(0.1, 0.4 - c * 0.06 - r * 0.05) }]}
              />
            ))}
          </View>
        ))}
      </View>

      <KeyboardAvoidingView
        style={s.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            s.scrollContent,
            {
              paddingTop: insets.top + (H < 720 ? 12 : 24),
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Main Form Content */}
          <View style={s.mainSection}>
            {/* Logo */}
            <View style={s.logoWrap}>
              <Image
                source={require('../../../../assets/logo.png')}
                style={s.logo}
                contentFit="contain"
              />
              <View style={s.tagRow}>
                <View style={s.tagLine} />
                <Text style={s.tagText}>BUILDING YOUR BUSINESS</Text>
                <View style={s.tagLine} />
              </View>
            </View>

            {/* Welcome Heading */}
            <View style={s.welcomeWrap}>
              <Text style={s.h1}>Welcome Back 👋</Text>
              <Text style={s.h2}>Login to your HinchMart account</Text>
            </View>

            {/* Form */}
            <View style={[s.form, { width: formWidth }]}>
              {/* Phone Label */}
              <View style={s.labelRow}>
                <Text style={s.label}>Mobile Number</Text>
                {otpSent && (
                  <TouchableOpacity
                    onPress={onChangeNumber}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={s.changeText}>Change</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Mobile Input Box */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => !otpSent && phoneRef.current?.focus()}
                style={[
                  s.inputBox,
                  error ? s.inputErr : focused ? s.inputFocus : s.inputDefault,
                  otpSent && s.inputDisabled,
                ]}
              >
                <View style={s.prefix}>
                  <Text style={s.prefixTxt}>+91</Text>
                </View>
                <View style={s.divider} />
                <TextInput
                  ref={phoneRef}
                  value={phone}
                  onChangeText={onPhoneChange}
                  placeholder="Enter your mobile number"
                  placeholderTextColor={MUTED}
                  keyboardType="phone-pad"
                  maxLength={10}
                  editable={!otpSent}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={[s.textInput, otpSent && { color: '#4B5563' }]}
                  accessibilityLabel="Mobile Number"
                />
                {!otpSent && phone.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setPhone('');
                      setError('');
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={s.clear}
                  >
                    <Ionicons name="close-circle" size={18} color={MUTED} />
                  </TouchableOpacity>
                )}
                {otpSent && (
                  <TouchableOpacity onPress={onChangeNumber} style={s.clear}>
                    <Ionicons name="pencil" size={16} color={ORANGE} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {!!error && !otpSent && (
                <View style={s.errRow}>
                  <Ionicons name="alert-circle" size={14} color={ERR} />
                  <Text style={s.errTxt}>{error}</Text>
                </View>
              )}

              {/* ─── INLINE OTP ─── */}
              {otpSent ? (
                <View style={s.otpSection}>
                  <Text style={s.otpLabel}>Enter 6-Digit OTP</Text>

                  {/* 6 OTP Boxes */}
                  <View style={s.otpRow}>
                    {otpDigits.map((digit, idx) => {
                      const isFoc = otpFocusedIndex === idx;
                      return (
                        <TextInput
                          key={idx}
                          ref={(r) => {
                            otpInputRefs.current[idx] = r;
                          }}
                          value={digit}
                          onChangeText={(t) => handleOtpChange(t, idx)}
                          onKeyPress={(e) => handleOtpKeyPress(e, idx)}
                          onFocus={() => setOtpFocusedIndex(idx)}
                          keyboardType="number-pad"
                          maxLength={1}
                          selectTextOnFocus
                          caretHidden
                          style={[
                            s.otpBox,
                            isFoc ? s.otpFocus : digit ? s.otpFilled : s.otpDefault,
                            otpError ? s.otpErr : null,
                          ]}
                        />
                      );
                    })}
                  </View>

                  {/* OTP Error */}
                  {!!otpError && (
                    <View style={s.errRow}>
                      <Ionicons name="alert-circle" size={14} color={ERR} />
                      <Text style={s.errTxt}>{otpError}</Text>
                    </View>
                  )}

                  {/* Resend Link */}
                  <View style={s.resendRow}>
                    {countdown > 0 ? (
                      <Text style={s.resendTxt}>
                        Resend OTP in <Text style={s.resendNum}>{countdown}s</Text>
                      </Text>
                    ) : (
                      <TouchableOpacity onPress={onResend} disabled={loading || isVerifying}>
                        <Text style={s.resendBtn}>Resend OTP</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Verify & Login Button */}
                  <TouchableOpacity
                    onPress={onVerify}
                    disabled={isVerifying || !isOtpComplete}
                    activeOpacity={0.88}
                    style={[s.btn, (isVerifying || !isOtpComplete) && { opacity: 0.8 }]}
                    accessibilityRole="button"
                  >
                    {isVerifying ? (
                      <View style={s.btnInner}>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text style={s.btnTxt}>Verifying...</Text>
                      </View>
                    ) : (
                      <View style={s.btnInner}>
                        <Text style={s.btnTxt}>Verify & Login</Text>
                        <Ionicons name="arrow-forward" size={18} color={ORANGE} style={s.btnArrow} />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                /* Continue with OTP Button */
                <TouchableOpacity
                  onPress={onContinue}
                  disabled={loading}
                  activeOpacity={0.88}
                  style={[s.btn, loading && { opacity: 0.8 }]}
                  accessibilityRole="button"
                >
                  {loading ? (
                    <View style={s.btnInner}>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={s.btnTxt}>Sending OTP...</Text>
                    </View>
                  ) : (
                    <View style={s.btnInner}>
                      <Text style={s.btnTxt}>Continue with OTP</Text>
                      <Ionicons name="arrow-forward" size={18} color={ORANGE} style={s.btnArrow} />
                    </View>
                  )}
                </TouchableOpacity>
              )}

              {/* OR Divider */}
              <View style={s.orRow}>
                <View style={s.orLine} />
                <Text style={s.orTxt}>OR</Text>
                <View style={s.orLine} />
              </View>

              {/* Create Account Link */}
              <View style={s.caWrap}>
                <Text style={s.caHint}>Don't have an account?</Text>
                <TouchableOpacity onPress={onRegister} activeOpacity={0.75} style={s.caBtn}>
                  <Text style={s.caLink}>Create Account</Text>
                  <Ionicons name="arrow-forward" size={14} color={ORANGE} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ─── ILLUSTRATION (Clean, grounded, proportional) ─── */}
          <View style={s.illusContainer} pointerEvents="none">
            <LinearGradient
              colors={['rgba(255,255,255,0)', '#EEF2F7', '#E2E8F0']}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Skyline Buildings */}
            <View style={s.skyline}>
              {[
                { h: 90, w: 36, pos: { left: 16 } },
                { h: 120, w: 46, pos: { left: 54 } },
                { h: 72, w: 30, pos: { left: 104 } },
                { h: 105, w: 42, pos: { right: 120 } },
                { h: 125, w: 52, pos: { right: 64 } },
                { h: 80, w: 36, pos: { right: 20 } },
              ].map((t, i) => (
                <View key={i} style={[s.tower, { height: t.h, width: t.w, ...t.pos }]} />
              ))}
            </View>

            {/* Warehouse */}
            <View style={[s.warehouse, { right: Math.max(16, W * 0.05) }]}>
              <View style={s.whRoof} />
              <View style={s.whSign}>
                <Text style={s.whSignTxt}>HINCHMART</Text>
              </View>
              <View style={s.bayRow}>
                {[false, true, false].map((open, i) => (
                  <View key={i} style={[s.bay, open && s.bayOpen]}>
                    {open ? (
                      <>
                        <View style={[s.cargo, { bottom: 0, left: 3, width: 14, height: 14 }]} />
                        <View
                          style={[
                            s.cargo,
                            { bottom: 0, right: 3, width: 12, height: 12, opacity: 0.7 },
                          ]}
                        />
                        <View style={[s.cargo, { bottom: 14, left: 6, width: 10, height: 9 }]} />
                      </>
                    ) : (
                      [0, 1, 2].map((j) => <View key={j} style={s.shutter} />)
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Forklift */}
            <View style={[s.fl, { left: Math.max(76, W * 0.3) }]}>
              <View style={s.flBody} />
              <View style={s.flCab} />
              <View style={s.flHead} />
              <View style={s.flMast} />
              <View style={[s.flWhl, { left: 2 }]} />
              <View style={[s.flWhl, { right: 12, width: 10, height: 10, borderRadius: 5 }]} />
              <View style={s.palBase} />
              <View style={s.pal1} />
              <View style={s.pal2} />
            </View>

            {/* Van */}
            <View style={s.van}>
              <View style={s.vanBody} />
              <View style={s.vanCab} />
              <View style={s.vanWin} />
              <View style={s.vanLight} />
              <View style={[s.vanWhl, { left: 9 }]} />
              <View style={[s.vanWhl, { right: 7 }]} />
            </View>

            {/* Ground line */}
            <View style={s.ground} />

            {/* Bottom Wave curves */}
            <View style={s.curves}>
              <View style={[s.orangeWave, { width: W + 80, left: -40 }]} />
              <View style={[s.navyWave, { width: W + 80, left: -40 }]} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ffffff' },
  kav: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  /* ── Dot grid ── */
  dotGrid: { position: 'absolute', right: 16, zIndex: 2 },
  dotRow: { flexDirection: 'row', gap: 5, marginBottom: 5 },
  dot: { width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: '#94A3B8' },

  /* ── Main content section ── */
  mainSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  /* Logo */
  logoWrap: { alignItems: 'center', marginBottom: 12 },
  logo: { width: 210, height: 112, marginBottom: 4 },
  tagRow: { flexDirection: 'row', alignItems: 'center' },
  tagLine: { width: 32, height: 1, backgroundColor: '#CBD5E1' },
  tagText: {
    fontWeight: '600',
    fontSize: 9.5,
    letterSpacing: 2,
    color: '#64748B',
    marginHorizontal: 8,
    textTransform: 'uppercase',
  },

  /* Welcome */
  welcomeWrap: { alignItems: 'center', marginBottom: 16 },
  h1: {
    fontWeight: '700',
    fontSize: 26,
    color: NAVY,
    textAlign: 'center',
    marginBottom: 4,
  },
  h2: {
    fontWeight: '400',
    fontSize: 14.5,
    color: '#6B7280',
    textAlign: 'center',
  },

  /* Form */
  form: { alignSelf: 'center' },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  label: { fontWeight: '600', fontSize: 14, color: '#111827' },
  changeText: {
    fontWeight: '600',
    fontSize: 13.5,
    color: ORANGE,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  inputDefault: { borderWidth: 1, borderColor: BORDER },
  inputFocus: { borderWidth: 1.5, borderColor: NAVY },
  inputErr: { borderWidth: 1.5, borderColor: ERR, backgroundColor: '#FEF2F2' },
  inputDisabled: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },

  prefix: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  prefixTxt: { fontWeight: '600', fontSize: 15, color: '#111827' },
  divider: { width: 1, height: 26, backgroundColor: BORDER },
  textInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    fontWeight: '500',
    fontSize: 15,
    color: '#111827',
  },
  clear: { padding: 8, marginRight: 4 },

  errRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  errTxt: { fontWeight: '400', fontSize: 12, color: ERR, flex: 1 },

  /* ─── Inline OTP ─── */
  otpSection: {
    marginTop: 12,
  },
  otpLabel: {
    fontWeight: '600',
    fontSize: 13.5,
    color: '#111827',
    marginBottom: 8,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 6,
  },
  otpBox: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    backgroundColor: '#ffffff',
    color: NAVY,
  },
  otpDefault: { borderWidth: 1, borderColor: BORDER },
  otpFilled: { borderWidth: 1.5, borderColor: NAVY, backgroundColor: '#F8FAFC' },
  otpFocus: { borderWidth: 2, borderColor: NAVY, backgroundColor: '#ffffff' },
  otpErr: { borderWidth: 1.5, borderColor: ERR, backgroundColor: '#FEF2F2' },

  resendRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  resendTxt: {
    fontWeight: '400',
    fontSize: 13,
    color: '#64748B',
  },
  resendNum: {
    fontWeight: '600',
    color: ORANGE,
  },
  resendBtn: {
    fontWeight: '600',
    fontSize: 13.5,
    color: ORANGE,
  },

  /* Buttons */
  btn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: NAVY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 18,
    gap: 8,
  },
  btnTxt: {
    fontWeight: '600',
    fontSize: 15.5,
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  btnArrow: { position: 'absolute', right: 18 },

  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  orLine: { flex: 1, height: 1, backgroundColor: BORDER },
  orTxt: {
    fontWeight: '500',
    fontSize: 12,
    color: MUTED,
    marginHorizontal: 14,
  },

  caWrap: { alignItems: 'center', gap: 3 },
  caHint: { fontWeight: '400', fontSize: 13.5, color: '#6B7280' },
  caBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 2 },
  caLink: { fontWeight: '600', fontSize: 14.5, color: ORANGE },

  /* ─── Illustration ─── */
  illusContainer: {
    width: '100%',
    height: 150,
    minHeight: 140,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginTop: 16,
  },

  skyline: {
    position: 'absolute',
    bottom: 38,
    left: 0,
    right: 0,
    height: 110,
    opacity: 0.35,
  },
  tower: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#CBD5E1',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  warehouse: {
    position: 'absolute',
    bottom: 34,
    width: 170,
    height: 64,
    backgroundColor: '#E2E8F0',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    alignItems: 'center',
    paddingTop: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    opacity: 0.85,
  },
  whRoof: {
    position: 'absolute',
    top: -7,
    left: -5,
    right: -5,
    height: 8,
    backgroundColor: '#CBD5E1',
    borderRadius: 2.5,
  },
  whSign: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 0.8,
    borderColor: '#94A3B8',
    marginBottom: 4,
  },
  whSignTxt: {
    fontSize: 8,
    fontWeight: '700',
    color: NAVY,
    letterSpacing: 0.8,
  },
  bayRow: {
    flexDirection: 'row',
    gap: 7,
    width: '90%',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
  },
  bay: {
    width: 34,
    height: 30,
    backgroundColor: '#94A3B8',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    paddingTop: 4,
    alignItems: 'center',
    gap: 2.5,
  },
  bayOpen: { backgroundColor: '#F1F5F9', position: 'relative', overflow: 'hidden' },
  shutter: { width: '80%', height: 1.5, backgroundColor: '#CBD5E1' },
  cargo: { position: 'absolute', backgroundColor: ORANGE, borderRadius: 1 },

  fl: { position: 'absolute', bottom: 36, width: 46, height: 38, opacity: 0.85 },
  flBody: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    width: 22,
    height: 14,
    backgroundColor: '#64748B',
    borderRadius: 3,
  },
  flCab: {
    position: 'absolute',
    top: 4,
    left: 5,
    width: 13,
    height: 16,
    borderWidth: 1.8,
    borderColor: '#475569',
    borderRadius: 2,
  },
  flHead: {
    position: 'absolute',
    top: 7,
    left: 9,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#475569',
  },
  flMast: {
    position: 'absolute',
    bottom: 0,
    right: 12,
    width: 3,
    height: 34,
    backgroundColor: '#334155',
  },
  flWhl: {
    position: 'absolute',
    bottom: 0,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#1E293B',
  },
  palBase: {
    position: 'absolute',
    bottom: 4,
    right: 0,
    width: 12,
    height: 2.5,
    backgroundColor: '#B45309',
  },
  pal1: {
    position: 'absolute',
    bottom: 6.5,
    right: 0,
    width: 11,
    height: 10,
    backgroundColor: ORANGE,
    borderRadius: 1.5,
  },
  pal2: {
    position: 'absolute',
    bottom: 17,
    right: 1,
    width: 9,
    height: 8,
    backgroundColor: ORANGE,
    opacity: 0.85,
    borderRadius: 1.5,
  },

  van: { position: 'absolute', bottom: 36, left: 14, width: 62, height: 30, opacity: 0.8 },
  vanBody: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    width: 40,
    height: 22,
    backgroundColor: '#94A3B8',
    borderTopLeftRadius: 3,
  },
  vanCab: {
    position: 'absolute',
    bottom: 4,
    left: 38,
    width: 22,
    height: 17,
    backgroundColor: '#CBD5E1',
    borderTopRightRadius: 5,
  },
  vanWin: {
    position: 'absolute',
    top: 11,
    left: 41,
    width: 12,
    height: 8,
    backgroundColor: '#475569',
    borderTopRightRadius: 3,
  },
  vanLight: {
    position: 'absolute',
    bottom: 7,
    right: 0,
    width: 2.5,
    height: 3.5,
    backgroundColor: '#FDE047',
    borderTopLeftRadius: 1,
    borderBottomLeftRadius: 1,
  },
  vanWhl: {
    position: 'absolute',
    bottom: 0,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#334155',
  },

  ground: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: '#CBD5E1',
    opacity: 0.6,
  },

  curves: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    overflow: 'hidden',
  },
  orangeWave: {
    position: 'absolute',
    bottom: -30,
    height: 68,
    borderRadius: 500,
    backgroundColor: ORANGE,
  },
  navyWave: {
    position: 'absolute',
    bottom: -36,
    height: 68,
    borderRadius: 500,
    backgroundColor: NAVY,
  },
});

export default LoginScreen;