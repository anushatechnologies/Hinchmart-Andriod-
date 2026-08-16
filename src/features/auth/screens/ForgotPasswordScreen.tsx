/**
 * HINCH MART — Forgot & Reset Password Screens
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/Screen';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export function ForgotPasswordScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1000);
  };

  return (
    <Screen scrollable>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.navy }]}>Forgot Password</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Enter your registered email address and we'll send you instructions to reset your password.
        </Text>

        {isSent ? (
          <View style={[styles.successBox, { backgroundColor: theme.colors.successLight }]}>
            <Text style={[styles.successText, { color: theme.colors.success }]}>
              ✅ Password reset instructions sent to your email!
            </Text>
            <Button
              title="Back to Login"
              onPress={() => navigation.navigate('Login')}
              variant="outline"
              size="md"
              style={{ marginTop: 16 }}
            />
          </View>
        ) : (
          <>
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="name@company.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button
              title="Send Reset Instructions"
              onPress={handleSubmit}
              isLoading={isLoading}
              size="lg"
              variant="primary"
              style={{ marginTop: 16 }}
            />
          </>
        )}
      </View>
    </Screen>
  );
}

export function ResetPasswordScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.replace('Login');
    }, 1000);
  };

  return (
    <Screen scrollable>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.navy }]}>Create New Password</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Your new password must be different from previously used passwords.
        </Text>

        <Input
          label="New Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          isPassword
        />

        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="••••••••"
          isPassword
        />

        <Button
          title="Reset Password"
          onPress={handleReset}
          isLoading={isLoading}
          size="lg"
          variant="primary"
          style={{ marginTop: 16 }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 40,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 28,
  },
  successBox: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  successText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
  },
});
