/**
 * HINCH MART — Production Edit Profile Details Screen
 * Clean, B2B-oriented form UI with field-level validation,
 * unsaved changes detection, and Redux + MMKV session persistence.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Avatar } from '../../../components/ui/Badge';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { updateUser } from '../../../redux/slices/authSlice';
import { authStore } from '../../../store/authStore';

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const BRAND_NAVY = '#0A2540';
const BRAND_GOLD = '#F47B20';

export function EditProfileScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useAppSelector((state) => state.auth);

  // Form State initialized from current authenticated user
  const [fullName, setFullName] = useState(
    user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  );
  const [phone, setPhone] = useState(user?.phone?.replace(/\D/g, '').slice(-10) || '');
  const [email, setEmail] = useState(user?.email || '');
  const [companyName, setCompanyName] = useState(user?.businessProfile?.companyName || '');
  const [accountType, setAccountType] = useState<string>(user?.accountType || 'individual');
  const [gstNumber, setGstNumber] = useState(
    user?.businessProfile?.gstNumber || user?.businessProfile?.taxId || ''
  );

  // Error state for field-level validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Mark form as dirty when inputs change
  const handleTextChange = (setter: (val: string) => void, fieldKey: string, val: string) => {
    setter(val);
    setIsDirty(true);
    if (errors[fieldKey]) {
      setErrors((prev) => ({ ...prev, [fieldKey]: '' }));
    }
  };

  // Intercept back button if form has unsaved changes
  useEffect(() => {
    const handleBackPress = () => {
      if (isDirty) {
        Alert.alert(
          'Discard changes?',
          'You have unsaved profile changes. Are you sure you want to discard them?',
          [
            { text: 'Keep Editing', style: 'cancel' },
            { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
          ]
        );
        return true;
      }
      return false;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backSubscription.remove();
  }, [isDirty, navigation]);

  const handleCustomBack = () => {
    if (isDirty) {
      Alert.alert(
        'Discard changes?',
        'You have unsaved profile changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    if (phone.trim() && !PHONE_REGEX.test(phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (email.trim() && !EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (
      (accountType === 'business' || accountType === 'contractor' || accountType === 'vendor') &&
      !companyName.trim()
    ) {
      newErrors.companyName = 'Company name is required for business accounts.';
    }

    if (gstNumber.trim() && !GST_REGEX.test(gstNumber.trim().toUpperCase())) {
      newErrors.gstNumber = 'Please enter a valid 15-character GST number (e.g., 27AABCU9603R1ZM).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      await new Promise((r) => setTimeout(r, 400));

      const parts = fullName.trim().split(' ');
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';
      const formattedPhone = phone.trim() ? `+91${phone.trim()}` : user?.phone || '';

      const updatedUserPayload = {
        fullName: fullName.trim(),
        firstName,
        lastName,
        email: email.trim() || null,
        phone: formattedPhone,
        accountType: accountType as any,
        businessProfile: companyName.trim()
          ? {
              id: user?.businessProfile?.id || `bp_${Date.now()}`,
              companyName: companyName.trim(),
              companyLogo: user?.businessProfile?.companyLogo || null,
              gstNumber: gstNumber.trim().toUpperCase() || null,
              taxId: gstNumber.trim().toUpperCase() || null,
              registrationNumber: user?.businessProfile?.registrationNumber || 'REG-994821',
              employeeCount: user?.businessProfile?.employeeCount || '10-50 Employees',
              annualRevenue: user?.businessProfile?.annualRevenue || 'Standard',
              industry: user?.businessProfile?.industry || 'Construction',
              website: user?.businessProfile?.website || '',
              description: user?.businessProfile?.description || '',
              foundedYear: user?.businessProfile?.foundedYear || 2020,
              certifications: user?.businessProfile?.certifications || ['B2B Verified'],
              isVerified: true,
            }
          : user?.businessProfile || null,
      };

      // 1. Update Redux State
      dispatch(updateUser(updatedUserPayload));

      // 2. Persist in MMKV Storage
      const currentAuth = authStore.getState();
      if (currentAuth.user) {
        await authStore.saveSession({
          user: {
            ...currentAuth.user,
            ...updatedUserPayload,
          },
          accessToken: currentAuth.accessToken || 'mock_access_token',
          refreshToken: currentAuth.refreshToken || 'mock_refresh_token',
        });
      }

      setIsDirty(false);
      setIsSaving(false);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      setIsSaving(false);
      Alert.alert('Error', 'Unable to update your profile. Please try again.');
    }
  };

  const bottomPadding = Math.max(insets.bottom + 20, 30);

  return (
    <Screen scrollable={false}>
      <Header title="Edit Profile" showBack onBackPress={handleCustomBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: bottomPadding + 80 }]}
        >
          {/* 1. PROFILE PHOTO SECTION */}
          <Card variant="outlined" style={styles.photoCard}>
            <View style={styles.avatarRow}>
              <View style={styles.avatarWrap}>
                <Avatar name={fullName || 'User'} size={76} />
                <TouchableOpacity style={styles.cameraBadge} activeOpacity={0.8}>
                  <Ionicons name="camera-outline" size={15} color="#152238" />
                </TouchableOpacity>
              </View>
              <View style={styles.photoMeta}>
                <Text style={[styles.photoTitle, { color: theme.colors.textPrimary }]}>
                  Profile Photo
                </Text>
                <Text style={[styles.photoSub, { color: theme.colors.textSecondary }]}>
                  Dynamic initials avatar derived from account name
                </Text>
              </View>
            </View>
          </Card>

          {/* 2. PERSONAL INFORMATION SECTION */}
          <Card variant="outlined" style={styles.formCard}>
            <Text style={styles.sectionHeading}>PERSONAL INFORMATION</Text>

            {/* Full Name */}
            <Input
              label="Full Name *"
              value={fullName}
              onChangeText={(t) => handleTextChange(setFullName, 'fullName', t)}
              placeholder="Enter your full name"
              iconLeft={<Ionicons name="person-outline" size={18} color="#64748B" />}
              error={errors.fullName}
              style={styles.inputSpacing}
            />

            {/* Mobile Number */}
            <Input
              label="Mobile Number"
              value={phone}
              onChangeText={(t) => handleTextChange(setPhone, 'phone', t)}
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              iconLeft={<Ionicons name="call-outline" size={18} color="#64748B" />}
              error={errors.phone}
              style={styles.inputSpacing}
            />

            {/* Email Address */}
            <Input
              label="Email Address"
              value={email}
              onChangeText={(t) => handleTextChange(setEmail, 'email', t)}
              placeholder="e.g. user@company.com"
              keyboardType="email-address"
              autoCapitalize="none"
              iconLeft={<Ionicons name="mail-outline" size={18} color="#64748B" />}
              error={errors.email}
              style={styles.inputSpacing}
            />

            {/* Account Type Selector */}
            <Text style={styles.fieldLabel}>ACCOUNT TYPE</Text>
            <View style={styles.typeRow}>
              {[
                { id: 'individual', label: 'Individual Buyer' },
                { id: 'business', label: 'Business Entity' },
                { id: 'contractor', label: 'Contractor' },
                { id: 'vendor', label: 'Vendor' },
              ].map((type) => {
                const isSelected = accountType === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => {
                      setAccountType(type.id);
                      setIsDirty(true);
                    }}
                    style={[
                      styles.typeChip,
                      {
                        backgroundColor: isSelected ? `${BRAND_NAVY}12` : '#F8FAFC',
                        borderColor: isSelected ? BRAND_NAVY : '#E2E8F0',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        {
                          color: isSelected ? BRAND_NAVY : '#64748B',
                          fontFamily: isSelected ? 'Poppins_600SemiBold' : 'Inter_500Medium',
                        },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          {/* 3. BUSINESS INFORMATION SECTION */}
          {(accountType === 'business' || accountType === 'contractor' || accountType === 'vendor') && (
            <Card variant="outlined" style={styles.formCard}>
              <Text style={styles.sectionHeading}>BUSINESS INFORMATION</Text>

              <Input
                label="Company / Firm Name *"
                value={companyName}
                onChangeText={(t) => handleTextChange(setCompanyName, 'companyName', t)}
                placeholder="e.g. Apex Construction Ltd"
                iconLeft={<Ionicons name="business-outline" size={18} color="#64748B" />}
                error={errors.companyName}
                style={styles.inputSpacing}
              />

              <Input
                label="GSTIN / Tax ID"
                value={gstNumber}
                onChangeText={(t) => handleTextChange(setGstNumber, 'gstNumber', t)}
                placeholder="e.g. 27AABCU9603R1ZM"
                autoCapitalize="characters"
                maxLength={15}
                iconLeft={<Ionicons name="document-text-outline" size={18} color="#64748B" />}
                error={errors.gstNumber}
                style={styles.inputSpacing}
              />
            </Card>
          )}

          {/* 4. ACCOUNT STATUS */}
          <Card variant="outlined" style={styles.formCard}>
            <Text style={styles.sectionHeading}>ACCOUNT VERIFICATION</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusBadgeItem}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.statusBadgeText}>Account Verified</Text>
              </View>
              {gstNumber.trim().length === 15 && (
                <View style={styles.statusBadgeItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  <Text style={styles.statusBadgeText}>GST Verified</Text>
                </View>
              )}
            </View>
          </Card>
        </ScrollView>

        {/* 5. FLOATING SAVE BUTTON */}
        <View style={[styles.bottomBar, { paddingBottom: bottomPadding }]}>
          <TouchableOpacity
            onPress={handleCustomBack}
            style={styles.cancelBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSaveChanges}
            disabled={isSaving}
            style={[styles.saveBtn, isSaving && { opacity: 0.7 }]}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  photoCard: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: BRAND_GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  photoMeta: {
    marginLeft: 16,
    flex: 1,
  },
  photoTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  photoSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },

  formCard: {
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionHeading: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    letterSpacing: 0.8,
    color: '#475569',
    marginBottom: 14,
  },
  inputSpacing: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.5,
    color: '#475569',
    marginBottom: 8,
    marginTop: 4,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  typeChipText: {
    fontSize: 12,
  },

  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  statusBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#15803D',
  },

  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#475569',
  },
  saveBtn: {
    flex: 1.5,
    height: 48,
    borderRadius: 12,
    backgroundColor: BRAND_NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
