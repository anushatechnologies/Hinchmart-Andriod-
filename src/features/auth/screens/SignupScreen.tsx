/**
 * HINCH MART — Direct Signup Screen (Mail & Password, No OTP)
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/Screen';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Chip } from '../../../components/ui/Badge';
import { translate } from '../../../localization';
import { AccountType } from '../../../types/auth.types';
import { ACCOUNT_TYPES } from '../../../constants/app';
import { useAppDispatch } from '../../../redux/hooks';
import { setCredentials } from '../../../redux/slices/authSlice';

export function SignupScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const [accountType, setAccountType] = useState<AccountType>('business');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = () => {
    if (!email || !password) {
      setError('Please enter email address and password');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      const userPayload = {
        user: {
          id: `u_${Date.now()}`,
          email: email.trim().toLowerCase(),
          phone: phone || '+91 98765 43210',
          firstName: firstName || 'New',
          lastName: lastName || 'User',
          fullName: `${firstName || 'New'} ${lastName || 'User'}`.trim(),
          avatar: null,
          accountType: accountType,
          isVerified: true,
          isPhoneVerified: true,
          isEmailVerified: true,
          businessProfile: {
            id: `b_${Date.now()}`,
            companyName: companyName || `${firstName || 'New'} Construction Ltd`,
            companyLogo: null,
            registrationNumber: 'REG-88392',
            taxId: 'TAX-0092',
            industry: 'Commercial Construction & Procurement',
            website: 'https://hinchmart.com',
            description: 'General contractor & procurement buyer',
            employeeCount: '10-50',
            annualRevenue: '$1M-$5M',
            foundedYear: 2022,
            certifications: ['Verified B2B Member'],
            isVerified: true,
          },
          language: 'en',
          currency: 'USD',
          timezone: 'UTC',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        tokens: {
          accessToken: 'direct_signup_access_token',
          refreshToken: 'direct_signup_refresh_token',
          expiresIn: 86400,
        },
      };

      dispatch(setCredentials(userPayload));
      navigation.replace('MainTabs');
    }, 600);
  };

  return (
    <Screen scrollable>
      <View style={styles.container}>
        <View style={styles.headerBox}>
          <Text style={[styles.title, { color: theme.colors.navy }]}>
            {translate('auth.signupTitle')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Create your account instantly using Email and Password
          </Text>
        </View>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: theme.colors.dangerLight }]}>
            <Text style={[styles.errorText, { color: theme.colors.danger }]}>{error}</Text>
          </View>
        ) : null}

        <Text style={[styles.sectionLabel, { color: theme.colors.textPrimary }]}>
          {translate('auth.selectAccountType')}
        </Text>

        <View style={styles.chipGrid}>
          {ACCOUNT_TYPES.map((type) => (
            <Chip
              key={type.value}
              label={type.label}
              selected={accountType === type.value}
              onPress={() => setAccountType(type.value as AccountType)}
              style={styles.chipItem}
            />
          ))}
        </View>

        <View style={styles.rowTwo}>
          <View style={styles.halfInput}>
            <Input label="First Name" value={firstName} onChangeText={setFirstName} placeholder="John" />
          </View>
          <View style={styles.halfInput}>
            <Input label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Doe" />
          </View>
        </View>

        <Input
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="name@company.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Mobile Phone (Optional)"
          value={phone}
          onChangeText={setPhone}
          placeholder="+1 234 567 8900"
          keyboardType="phone-pad"
        />

        {accountType !== 'individual' && (
          <Input
            label="Company Name"
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="Apex Construction Ltd"
          />
        )}

        <Input
          label={translate('auth.password')}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          isPassword
        />

        <Button
          title="Create Account"
          onPress={handleSignup}
          isLoading={isLoading}
          size="lg"
          variant="primary"
          style={styles.signupBtn}
        />

        <View style={styles.loginPrompt}>
          <Text style={[styles.signupText, { color: theme.colors.textSecondary }]}>
            {translate('auth.hasAccount')}{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.signupLink, { color: theme.colors.navy }]}>
              {translate('auth.loginBtn')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 20,
  },
  headerBox: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  errorBox: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginBottom: 12,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  chipItem: {
    marginBottom: 8,
  },
  rowTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  signupBtn: {
    marginTop: 12,
    marginBottom: 24,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  signupText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  signupLink: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
});
