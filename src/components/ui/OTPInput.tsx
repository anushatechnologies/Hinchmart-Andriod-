/**
 * HINCH MART — OTP Input Component
 * Enhanced: error state (red + shake), autoFocus, clipboard paste
 */
import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ViewStyle, Clipboard, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

export interface OTPInputProps {
  length?: number;
  onCodeFilled: (code: string) => void;
  onCodeChanged?: (code: string) => void;
  style?: ViewStyle;
  hasError?: boolean;
  autoFocus?: boolean;
}

export function OTPInput({
  length = 6,
  onCodeFilled,
  onCodeChanged,
  style,
  hasError = false,
  autoFocus = true,
}: OTPInputProps) {
  const { theme } = useTheme();
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const shakeX = useSharedValue(0);

  // Shake animation when error is set
  useEffect(() => {
    if (hasError) {
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-4, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [hasError]);

  // Auto-focus first input
  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 300);
    }
  }, [autoFocus]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handleChangeText = (text: string, index: number) => {
    // Handle paste: if user pastes a full OTP code
    if (text.length > 1) {
      const digits = text.replace(/\D/g, '').slice(0, length);
      if (digits.length > 0) {
        const newCode = Array(length).fill('');
        digits.split('').forEach((d, i) => {
          if (i < length) newCode[i] = d;
        });
        setCode(newCode);
        onCodeChanged?.(newCode.join(''));
        if (digits.length >= length) {
          onCodeFilled(newCode.join(''));
          inputsRef.current[length - 1]?.blur();
        } else {
          inputsRef.current[digits.length]?.focus();
        }
        return;
      }
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    const fullCode = newCode.join('');
    onCodeChanged?.(fullCode);

    if (text.length > 0 && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (fullCode.length === length && !fullCode.includes('')) {
      onCodeFilled(fullCode);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      onCodeChanged?.(newCode.join(''));
      inputsRef.current[index - 1]?.focus();
    }
  };

  /** Reset OTP boxes externally */
  const reset = () => {
    setCode(Array(length).fill(''));
    inputsRef.current[0]?.focus();
  };

  return (
    <Animated.View style={[styles.container, style, shakeStyle]}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => { inputsRef.current[index] = ref; }}
          value={digit}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          style={[
            styles.box,
            {
              backgroundColor: theme.colors.inputBackground,
              borderColor: hasError
                ? theme.colors.danger
                : digit
                  ? theme.colors.primary
                  : theme.colors.inputBorder,
              color: theme.colors.textPrimary,
            },
            hasError && styles.boxError,
          ]}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 16,
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
  },
  boxError: {
    borderWidth: 2,
  },
});
