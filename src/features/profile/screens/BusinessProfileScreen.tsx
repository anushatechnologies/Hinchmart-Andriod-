/**
 * HINCH MART — Business Profile & Interactive Address Management Screens
 * Enhanced with full interactive Edit Profile modal and Redux integration
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
  isDefault: boolean;
}

const INITIAL_ADDRESSES: SiteAddress[] = [
  {
    id: 'addr-1',
    name: 'Headquarters & Main Yard (Site A)',
    address: 'Plot 405, Industrial Zone 3, Business Bay',
    city: 'Hyderabad, Telangana',
    zipCode: '500032',
    phone: '+91 8388899999',
    isDefault: true,
  },
  {
    id: 'addr-2',
    name: 'North Commercial Site Project B',
    address: 'Sector 14, Outer Ring Road, Cyberabad',
    city: 'Hyderabad, Telangana',
    zipCode: '500081',
    phone: '+91 9876543210',
    isDefault: false,
  },
];

export function BusinessProfileScreen({ navigation, route }: any) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Edit Modal Visibility
  const [editModalVisible, setEditModalVisible] = useState(
    route?.params?.openEdit ?? false
  );

  // Profile Form States
  const [fullName, setFullName] = useState(user?.fullName || 'Anusha Bazaar');
  const [companyName, setCompanyName] = useState(
    user?.businessProfile?.companyName || 'Anusha Global Construction Ltd'
  );
  const [email, setEmail] = useState(user?.email || 'anushabazaar4@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '+91 8388899999');
  const [regNumber, setRegNumber] = useState(
    user?.businessProfile?.registrationNumber || 'REG-994821'
  );
  const [taxId, setTaxId] = useState(user?.businessProfile?.taxId || 'TAX-0041920');
  const [industry, setIndustry] = useState(
    user?.businessProfile?.industry || 'Commercial Construction & Infrastructure'
  );
  const [website, setWebsite] = useState(
    user?.businessProfile?.website || 'https://hinchmart.com'
  );
  const [employeeCount, setEmployeeCount] = useState(
    user?.businessProfile?.employeeCount || '50 - 100 Employees'
  );
  const [annualRevenue, setAnnualRevenue] = useState(
    user?.businessProfile?.annualRevenue || '$10M - $50M USD'
  );
  const [foundedYear, setFoundedYear] = useState(
    String(user?.businessProfile?.foundedYear || 2018)
  );
  const [certifications, setCertifications] = useState(
    user?.businessProfile?.certifications?.join(', ') || 'ISO 9001, LEED Certified, B2B Verified'
  );
  const [description, setDescription] = useState(
    user?.businessProfile?.description || 'General contractors for high-rise infrastructure & commercial project procurement.'
  );

  // Sync state when user object changes
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || 'Anusha Bazaar');
      setCompanyName(user.businessProfile?.companyName || 'Anusha Global Construction Ltd');
      setEmail(user.email || 'anushabazaar4@gmail.com');
      setPhone(user.phone || '+91 8388899999');
      setRegNumber(user.businessProfile?.registrationNumber || 'REG-994821');
      setTaxId(user.businessProfile?.taxId || 'TAX-0041920');
      setIndustry(user.businessProfile?.industry || 'Commercial Construction & Infrastructure');
      setWebsite(user.businessProfile?.website || 'https://hinchmart.com');
      setEmployeeCount(user.businessProfile?.employeeCount || '50 - 100 Employees');
      setAnnualRevenue(user.businessProfile?.annualRevenue || '$10M - $50M USD');
      setFoundedYear(String(user.businessProfile?.foundedYear || 2018));
      setCertifications(user.businessProfile?.certifications?.join(', ') || 'ISO 9001, LEED Certified, B2B Verified');
      setDescription(user.businessProfile?.description || 'General contractors for high-rise infrastructure & commercial project procurement.');
    }
  }, [user]);

  // Open edit modal if openEdit param is passed
  useEffect(() => {
    if (route?.params?.openEdit) {
      setEditModalVisible(true);
    }
  }, [route?.params?.openEdit]);

  const handleSaveProfile = () => {
    if (!fullName.trim() || !companyName.trim() || !email.trim()) {
      Alert.alert('Required Fields', 'Please enter Full Name, Company Name and Email.');
      return;
    }

    // Split name into first and last name
    const parts = fullName.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    const certArray = certifications.split(',').map((c) => c.trim()).filter(Boolean);

    dispatch(
      updateUser({
        fullName: fullName.trim(),
        firstName,
        lastName,
        email: email.trim(),
        phone: phone.trim(),
        businessProfile: {
          id: user?.businessProfile?.id || 'bp-1',
          companyName: companyName.trim(),
          companyLogo: user?.businessProfile?.companyLogo || null,
          registrationNumber: regNumber.trim(),
          taxId: taxId.trim(),
          employeeCount: employeeCount.trim(),
          annualRevenue: annualRevenue.trim(),
          industry: industry.trim(),
          website: website.trim(),
          description: description.trim(),
          foundedYear: Number(foundedYear) || 2018,
          certifications: certArray.length > 0 ? certArray : ['ISO 9001'],
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
        {/* Main Company Card with Edit Action */}
        <Card variant="filled" style={{ backgroundColor: theme.colors.navy, padding: 20, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ color: theme.colors.primary, fontFamily: 'Poppins_700Bold', fontSize: 20 }}>
                {companyName}
              </Text>
              <Text style={{ color: '#E9ECEF', fontFamily: 'Inter_500Medium', fontSize: 14, marginTop: 4 }}>
                {fullName}
              </Text>
              <Text style={{ color: 'rgba(233, 236, 239, 0.7)', fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 2 }}>
                {email} • {phone}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setEditModalVisible(true)}
              style={styles.editCardBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="create" size={18} color="#152238" />
              <Text style={styles.editCardBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <Badge label="VERIFIED B2B ENTITY" variant="success" size="sm" style={{ marginTop: 14 }} />
        </Card>

        {/* Business Details Overview */}
        <Card variant="outlined" style={{ padding: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: theme.colors.textPrimary }}>
              Company & Tax Information
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
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Registration Number:</Text>
            <Text style={[styles.infoVal, { color: theme.colors.textPrimary }]}>{regNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>VAT / Tax ID:</Text>
            <Text style={[styles.infoVal, { color: theme.colors.textPrimary }]}>{taxId}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Company Website:</Text>
            <Text style={[styles.infoVal, { color: theme.colors.primary }]}>{website}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Employee Count:</Text>
            <Text style={[styles.infoVal, { color: theme.colors.textPrimary }]}>{employeeCount}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Annual Revenue:</Text>
            <Text style={[styles.infoVal, { color: theme.colors.textPrimary }]}>{annualRevenue}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Founded Year:</Text>
            <Text style={[styles.infoVal, { color: theme.colors.textPrimary }]}>{foundedYear}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Certifications:</Text>
            <Text style={[styles.infoVal, { color: theme.colors.textPrimary }]}>{certifications}</Text>
          </View>

          <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: theme.colors.border }}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary, marginBottom: 4 }]}>Business Overview:</Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.colors.textPrimary, lineHeight: 18 }}>{description}</Text>
          </View>
        </Card>

        {/* Quick Action Button to Edit Profile */}
        <Button
          title="Edit All Profile Information"
          onPress={() => setEditModalVisible(true)}
          variant="primary"
          size="md"
          iconLeft={<Ionicons name="create-outline" size={18} color="#152238" />}
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
                Edit All Business Profile Fields
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close-circle" size={24} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 480 }}>
              <Input
                label="Full Name / Representative"
                placeholder="e.g. Anusha Bazaar"
                value={fullName}
                onChangeText={setFullName}
                style={styles.inputMargin}
              />
              <Input
                label="Company Name"
                placeholder="e.g. Anusha Global Construction Ltd"
                value={companyName}
                onChangeText={setCompanyName}
                style={styles.inputMargin}
              />
              <Input
                label="Email Address"
                placeholder="e.g. anushabazaar4@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.inputMargin}
              />
              <Input
                label="Contact Phone"
                placeholder="e.g. +91 8388899999"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.inputMargin}
              />
              <Input
                label="Industry Sector"
                placeholder="e.g. Commercial Construction & Infrastructure"
                value={industry}
                onChangeText={setIndustry}
                style={styles.inputMargin}
              />
              <Input
                label="Company Website"
                placeholder="e.g. https://hinchmart.com"
                value={website}
                onChangeText={setWebsite}
                autoCapitalize="none"
                style={styles.inputMargin}
              />
              <Input
                label="Company Registration Number"
                placeholder="e.g. REG-994821"
                value={regNumber}
                onChangeText={setRegNumber}
                style={styles.inputMargin}
              />
              <Input
                label="VAT / Tax Identification ID"
                placeholder="e.g. TAX-0041920"
                value={taxId}
                onChangeText={setTaxId}
                style={styles.inputMargin}
              />
              <Input
                label="Employee Count"
                placeholder="e.g. 50 - 100 Employees"
                value={employeeCount}
                onChangeText={setEmployeeCount}
                style={styles.inputMargin}
              />
              <Input
                label="Annual Revenue"
                placeholder="e.g. $10M - $50M USD"
                value={annualRevenue}
                onChangeText={setAnnualRevenue}
                style={styles.inputMargin}
              />
              <Input
                label="Year Founded"
                placeholder="e.g. 2018"
                value={foundedYear}
                onChangeText={setFoundedYear}
                keyboardType="number-pad"
                style={styles.inputMargin}
              />
              <Input
                label="Certifications (Comma Separated)"
                placeholder="e.g. ISO 9001, LEED Certified, B2B Verified"
                value={certifications}
                onChangeText={setCertifications}
                style={styles.inputMargin}
              />
              <Input
                label="Business Description & Overview"
                placeholder="Describe your company services, specializations, and site capabilities..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
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

  // Form State
  const [siteName, setSiteName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const resetForm = () => {
    setSiteName('');
    setStreetAddress('');
    setCity('');
    setZipCode('');
    setPhone('');
    setIsDefault(false);
  };

  const handleAddAddress = () => {
    if (!siteName.trim() || !streetAddress.trim() || !city.trim() || !phone.trim()) {
      Alert.alert('Required Fields', 'Please fill in Site Name, Address, City and Contact Phone.');
      return;
    }

    const newAddr: SiteAddress = {
      id: `addr-${Date.now()}`,
      name: siteName.trim(),
      address: streetAddress.trim(),
      city: city.trim(),
      zipCode: zipCode.trim() || '500001',
      phone: phone.trim(),
      isDefault: isDefault || addresses.length === 0,
    };

    setAddresses((prev) => {
      if (newAddr.isDefault) {
        return [newAddr, ...prev.map((a) => ({ ...a, isDefault: false }))];
      }
      return [newAddr, ...prev];
    });

    resetForm();
    setModalVisible(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
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
        {/* Add Address Button */}
        <Button
          title="+ Add New Site Address"
          onPress={() => setModalVisible(true)}
          size="md"
          variant="primary"
          style={{ marginBottom: 16 }}
        />

        {/* Addresses List */}
        {addresses.map((item) => (
          <Card key={item.id} variant="outlined" style={styles.addressCard}>
            <View style={styles.addressHeaderRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.titleBadgeRow}>
                  <Text style={[styles.addressTitle, { color: theme.colors.navy }]}>{item.name}</Text>
                  {item.isDefault && (
                    <Badge label="DEFAULT" variant="primary" size="sm" style={{ marginLeft: 8 }} />
                  )}
                </View>
                <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
                  {item.address}, {item.city} - {item.zipCode}
                </Text>
                <Text style={[styles.addressPhone, { color: theme.colors.textTertiary }]}>
                  Contact: {item.phone}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleDeleteAddress(item.id)}
                style={styles.deleteBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
              </TouchableOpacity>
            </View>

            {!item.isDefault && (
              <TouchableOpacity
                onPress={() => handleSetDefault(item.id)}
                style={styles.setDefaultBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.primary} />
                <Text style={[styles.setDefaultText, { color: theme.colors.primary }]}>Set as Default Site</Text>
              </TouchableOpacity>
            )}
          </Card>
        ))}
      </View>

      {/* Add New Site Address Modal */}
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
                Add New Site Address
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close-circle" size={24} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <Input
                label="Site / Project Name"
                placeholder="e.g. Site B - Highrise Project"
                value={siteName}
                onChangeText={setSiteName}
                style={styles.inputMargin}
              />
              <Input
                label="Full Street Address"
                placeholder="e.g. Plot 102, Phase 4, Financial District"
                value={streetAddress}
                onChangeText={setStreetAddress}
                style={styles.inputMargin}
              />
              <Input
                label="City / Region"
                placeholder="e.g. Hyderabad, Telangana"
                value={city}
                onChangeText={setCity}
                style={styles.inputMargin}
              />
              <Input
                label="Pin Code / Postal Code"
                placeholder="e.g. 500032"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
                style={styles.inputMargin}
              />
              <Input
                label="Site Manager Phone"
                placeholder="e.g. +91 9876543210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.inputMargin}
              />

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
                title="Save Address"
                onPress={handleAddAddress}
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
  },
  addressTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
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
  deleteBtn: {
    padding: 6,
    marginLeft: 8,
  },
  setDefaultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
    gap: 6,
  },
  setDefaultText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  // Modal Styles
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
    marginBottom: 16,
    paddingBottom: 12,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 10,
  },
  checkboxLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  modalActionRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
});
