/**
 * HINCH MART — Business Profile & Complete Address CRUD Management Screens
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { updateUser } from '../../../redux/slices/authSlice';

export interface SiteAddress {
  id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  type: 'Home' | 'Work' | 'Site';
  isDefault: boolean;
}

const INITIAL_ADDRESSES: SiteAddress[] = [
  {
    id: 'addr-1',
    name: 'Headquarters & Main Yard (Site A)',
    address: 'Plot 405, Industrial Zone 3, Business Bay',
    city: 'Hyderabad, Telangana',
    zipCode: '500032',
    phone: '+91 98765 43210',
    type: 'Site',
    isDefault: true,
  },
  {
    id: 'addr-2',
    name: 'North Commercial Site Project B',
    address: 'Sector 14, Outer Ring Road, Cyberabad',
    city: 'Hyderabad, Telangana',
    zipCode: '500081',
    phone: '+91 98765 43211',
    type: 'Work',
    isDefault: false,
  },
];

export function BusinessProfileScreen({ navigation, route }: any) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [editModalVisible, setEditModalVisible] = useState(
    route?.params?.openEdit ?? false
  );

  const [fullName, setFullName] = useState(user?.fullName || 'User');
  const [companyName, setCompanyName] = useState(
    user?.businessProfile?.companyName || 'Apex Construction Ltd'
  );
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gstNumber, setGstNumber] = useState(
    user?.businessProfile?.gstNumber || user?.businessProfile?.taxId || ''
  );
  const [industry, setIndustry] = useState(
    user?.businessProfile?.industry || 'Commercial Construction & Infrastructure'
  );
  const [website, setWebsite] = useState(user?.businessProfile?.website || '');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || 'User');
      setCompanyName(user.businessProfile?.companyName || 'Apex Construction Ltd');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setGstNumber(user.businessProfile?.gstNumber || user.businessProfile?.taxId || '');
      setIndustry(user.businessProfile?.industry || 'Commercial Construction & Infrastructure');
      setWebsite(user.businessProfile?.website || '');
    }
  }, [user]);

  const handleSaveProfile = () => {
    if (!fullName.trim()) {
      Alert.alert('Required Field', 'Please enter Full Name.');
      return;
    }

    const parts = fullName.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';

    dispatch(
      updateUser({
        fullName: fullName.trim(),
        firstName,
        lastName,
        email: email.trim() || null,
        phone: phone.trim() || user?.phone || '',
        businessProfile: {
          id: user?.businessProfile?.id || 'bp-1',
          companyName: companyName.trim() || 'Apex Construction Ltd',
          companyLogo: user?.businessProfile?.companyLogo || null,
          registrationNumber: user?.businessProfile?.registrationNumber || 'REG-994821',
          gstNumber: gstNumber.trim() || undefined,
          taxId: gstNumber.trim() || undefined,
          employeeCount: user?.businessProfile?.employeeCount || '50 - 100 Employees',
          annualRevenue: user?.businessProfile?.annualRevenue || 'Standard',
          industry: industry.trim(),
          website: website.trim(),
          description: user?.businessProfile?.description || '',
          foundedYear: user?.businessProfile?.foundedYear || 2018,
          certifications: user?.businessProfile?.certifications || ['B2B Verified'],
          isVerified: true,
        },
      })
    );

    setEditModalVisible(false);
    Alert.alert('Success', 'Business Profile updated successfully!');
  };

  return (
    <Screen scrollable>
      <Header title="Business Profile" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        <Card variant="filled" style={{ backgroundColor: theme.colors.navy, padding: 20, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ color: theme.colors.primary, fontFamily: 'Poppins_700Bold', fontSize: 20 }}>
                {companyName || 'Business Profile'}
              </Text>
              <Text style={{ color: '#E9ECEF', fontFamily: 'Inter_500Medium', fontSize: 14, marginTop: 4 }}>
                {fullName}
              </Text>
              <Text style={{ color: 'rgba(233, 236, 239, 0.7)', fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 2 }}>
                {email || 'No Email'} • {phone || 'No Phone'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setEditModalVisible(true)}
              style={styles.editCardBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="create" size={16} color="#152238" />
              <Text style={styles.editCardBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {gstNumber ? (
            <Badge label={`GST: ${gstNumber}`} variant="success" size="sm" style={{ marginTop: 14 }} />
          ) : null}
        </Card>

        {/* Business Overview */}
        <Card variant="outlined" style={{ padding: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: theme.colors.textPrimary }}>
              Company Details
            </Text>
            <TouchableOpacity onPress={() => setEditModalVisible(true)}>
              <Ionicons name="create-outline" size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Industry Sector:</Text>
            <Text style={[styles.infoVal, { color: theme.colors.textPrimary }]}>{industry}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>GSTIN / Tax ID:</Text>
            <Text style={[styles.infoVal, { color: theme.colors.textPrimary }]}>{gstNumber || 'Not Specified'}</Text>
          </View>

          {website ? (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Website:</Text>
              <Text style={[styles.infoVal, { color: theme.colors.primary }]}>{website}</Text>
            </View>
          ) : null}
        </Card>

        <Button
          title="Edit Profile Details"
          onPress={() => navigation.navigate('EditProfile')}
          variant="primary"
          size="md"
        />
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
                Edit Business Information
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <Input
                label="Full Name *"
                value={fullName}
                onChangeText={setFullName}
                style={styles.inputMargin}
              />
              <Input
                label="Company Name"
                value={companyName}
                onChangeText={setCompanyName}
                style={styles.inputMargin}
              />
              <Input
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.inputMargin}
              />
              <Input
                label="Contact Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.inputMargin}
              />
              <Input
                label="GSTIN / Tax ID"
                value={gstNumber}
                onChangeText={setGstNumber}
                autoCapitalize="characters"
                style={styles.inputMargin}
              />
            </ScrollView>

            <View style={styles.modalActionRow}>
              <Button
                title="Cancel"
                onPress={() => setEditModalVisible(false)}
                variant="outline"
                size="md"
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="Save Changes"
                onPress={handleSaveProfile}
                variant="primary"
                size="md"
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

export function AddressesScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [addresses, setAddresses] = useState<SiteAddress[]>(INITIAL_ADDRESSES);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SiteAddress | null>(null);

  // Form State
  const [siteName, setSiteName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<'Home' | 'Work' | 'Site'>('Site');
  const [isDefault, setIsDefault] = useState(false);

  const resetForm = () => {
    setSiteName('');
    setStreetAddress('');
    setCity('');
    setZipCode('');
    setPhone('');
    setType('Site');
    setIsDefault(false);
    setEditingAddress(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleOpenEditModal = (addr: SiteAddress) => {
    setEditingAddress(addr);
    setSiteName(addr.name);
    setStreetAddress(addr.address);
    setCity(addr.city);
    setZipCode(addr.zipCode);
    setPhone(addr.phone);
    setType(addr.type || 'Site');
    setIsDefault(addr.isDefault);
    setModalVisible(true);
  };

  const handleSaveAddress = () => {
    if (!siteName.trim() || !streetAddress.trim() || !city.trim() || !phone.trim()) {
      Alert.alert('Required Fields', 'Please fill in Site Name, Address, City and Contact Phone.');
      return;
    }

    if (editingAddress) {
      // Edit existing
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === editingAddress.id) {
            return {
              ...a,
              name: siteName.trim(),
              address: streetAddress.trim(),
              city: city.trim(),
              zipCode: zipCode.trim() || '500001',
              phone: phone.trim(),
              type,
              isDefault,
            };
          }
          // If editing item set to default, unset others
          if (isDefault) {
            return { ...a, isDefault: false };
          }
          return a;
        })
      );
    } else {
      // Add new
      const newAddr: SiteAddress = {
        id: `addr-${Date.now()}`,
        name: siteName.trim(),
        address: streetAddress.trim(),
        city: city.trim(),
        zipCode: zipCode.trim() || '500001',
        phone: phone.trim(),
        type,
        isDefault: isDefault || addresses.length === 0,
      };

      setAddresses((prev) => {
        if (newAddr.isDefault) {
          return [newAddr, ...prev.map((a) => ({ ...a, isDefault: false }))];
        }
        return [newAddr, ...prev];
      });
    }

    resetForm();
    setModalVisible(false);
  };

  const handleDeleteAddressPrompt = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this saved delivery site address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses((prev) => prev.filter((a) => a.id !== id));
          },
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  return (
    <Screen scrollable>
      <Header title="Saved Addresses" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        <Button
          title="+ Add New Delivery Address"
          onPress={handleOpenAddModal}
          size="md"
          variant="primary"
          style={{ marginBottom: 16 }}
        />

        {addresses.map((item) => (
          <Card key={item.id} variant="outlined" style={styles.addressCard}>
            <View style={styles.addressHeaderRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.titleBadgeRow}>
                  <Text style={[styles.addressTitle, { color: theme.colors.navy }]}>{item.name}</Text>
                  <View style={styles.tagChip}>
                    <Text style={styles.tagChipText}>{item.type || 'Site'}</Text>
                  </View>
                  {item.isDefault && (
                    <Badge label="DEFAULT" variant="primary" size="sm" style={{ marginLeft: 6 }} />
                  )}
                </View>
                <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
                  {item.address}, {item.city} - {item.zipCode}
                </Text>
                <Text style={[styles.addressPhone, { color: theme.colors.textTertiary }]}>
                  📞 Contact: {item.phone}
                </Text>
              </View>

              <View style={styles.addressActionIcons}>
                <TouchableOpacity
                  onPress={() => handleOpenEditModal(item)}
                  style={styles.actionIconBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pencil" size={16} color={theme.colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteAddressPrompt(item.id)}
                  style={styles.actionIconBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
                </TouchableOpacity>
              </View>
            </View>

            {!item.isDefault && (
              <TouchableOpacity
                onPress={() => handleSetDefault(item.id)}
                style={styles.setDefaultBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark-circle-outline" size={15} color={theme.colors.primary} />
                <Text style={[styles.setDefaultText, { color: theme.colors.primary }]}>Set as Default Site</Text>
              </TouchableOpacity>
            )}
          </Card>
        ))}
      </View>

      {/* Add / Edit Address Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
                {editingAddress ? 'Edit Delivery Address' : 'Add New Site Address'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 440 }}>
              <Input
                label="Location / Site Label *"
                placeholder="e.g. Site B - Highrise Project / Home"
                value={siteName}
                onChangeText={setSiteName}
                style={styles.inputMargin}
              />
              <Input
                label="Full Street Address *"
                placeholder="e.g. Plot 102, Phase 4, Financial District"
                value={streetAddress}
                onChangeText={setStreetAddress}
                style={styles.inputMargin}
              />
              <Input
                label="City & State *"
                placeholder="e.g. Hyderabad, Telangana"
                value={city}
                onChangeText={setCity}
                style={styles.inputMargin}
              />
              <Input
                label="Pincode / Postal Code"
                placeholder="e.g. 500032"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
                style={styles.inputMargin}
              />
              <Input
                label="Contact Mobile Number *"
                placeholder="e.g. +91 9876543210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.inputMargin}
              />

              <Text style={[styles.fieldLabel, { color: theme.colors.textPrimary }]}>Address Tag</Text>
              <View style={styles.tagSelectorRow}>
                {(['Site', 'Work', 'Home'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setType(t)}
                    style={[
                      styles.typeChip,
                      {
                        backgroundColor: type === t ? `${theme.colors.primary}20` : theme.colors.surfaceVariant,
                        borderColor: type === t ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontFamily: type === t ? 'Poppins_600SemiBold' : 'Inter_500Medium',
                        fontSize: 12,
                        color: type === t ? theme.colors.navy : theme.colors.textSecondary,
                      }}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => setIsDefault(!isDefault)}
                style={styles.checkboxRow}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isDefault ? 'checkbox' : 'square-outline'}
                  size={22}
                  color={isDefault ? theme.colors.primary : theme.colors.textTertiary}
                />
                <Text style={[styles.checkboxLabel, { color: theme.colors.textPrimary }]}>
                  Set as Default Delivery Address
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalActionRow}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                variant="outline"
                size="md"
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title={editingAddress ? 'Update Address' : 'Save Address'}
                onPress={handleSaveAddress}
                variant="primary"
                size="md"
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  editCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDB913',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  editCardBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
    color: '#152238',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  infoLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  infoVal: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  addressCard: {
    padding: 16,
    marginBottom: 14,
    borderRadius: 16,
  },
  addressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
    gap: 6,
  },
  addressTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },
  tagChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: '#64748B',
  },
  addressText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  addressPhone: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 4,
  },
  addressActionIcons: {
    flexDirection: 'row',
    gap: 6,
  },
  actionIconBtn: {
    padding: 6,
  },
  setDefaultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
    gap: 6,
  },
  setDefaultText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
  },
  inputMargin: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12.5,
    marginBottom: 6,
  },
  tagSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
  },
  checkboxLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  modalActionRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
});
