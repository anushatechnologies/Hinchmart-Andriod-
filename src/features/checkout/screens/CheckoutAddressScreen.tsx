/**
 * HINCH MART — Checkout Address Selection Screen (Step 1 of 4)
 * Supports selecting site delivery address, adding a new project site address,
 * and seamless continuation to Delivery options.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { AddressCard } from '../../../components/cards/AddressCard';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Address } from '../../../types/order.types';

export const INITIAL_SAVED_ADDRESSES: Address[] = [
  {
    id: 'addr_1',
    label: 'Main Construction Site A',
    fullName: 'Rajesh Sharma (Project Head)',
    phone: '+91 98765 43210',
    addressLine1: 'Plot 405, Industrial Area, Sector 58',
    addressLine2: 'Near Metro Pillar 124',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    postalCode: '500001',
    isDefault: true,
  },
  {
    id: 'addr_2',
    label: 'Commercial Tower Project',
    fullName: 'Amit Verma (Site Engineer)',
    phone: '+91 98765 43211',
    addressLine1: 'Gate 3, Financial District, Nanakramguda',
    addressLine2: 'Tower B Construction Block',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    postalCode: '500032',
    isDefault: false,
  },
];

export function CheckoutAddressScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_SAVED_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    INITIAL_SAVED_ADDRESSES[0].id
  );

  // New Address Modal
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLine1, setNewLine1] = useState('');
  const [newCity, setNewCity] = useState('Hyderabad');
  const [newState, setNewState] = useState('Telangana');
  const [newPincode, setNewPincode] = useState('');
  const [formError, setFormError] = useState('');

  const handleAddNewAddress = () => {
    if (!newName.trim() || !newPhone.trim() || !newLine1.trim() || !newPincode.trim()) {
      setFormError('Please fill in all mandatory address fields.');
      return;
    }

    const createdAddress: Address = {
      id: `addr_${Date.now()}`,
      label: newLabel.trim() || 'Project Site',
      fullName: newName.trim(),
      phone: newPhone.trim(),
      addressLine1: newLine1.trim(),
      addressLine2: '',
      city: newCity.trim(),
      state: newState.trim(),
      country: 'India',
      postalCode: newPincode.trim(),
      isDefault: false,
    };

    setAddresses([createdAddress, ...addresses]);
    setSelectedAddressId(createdAddress.id);
    setIsAddModalVisible(false);
    // Reset fields
    setNewLabel('');
    setNewName('');
    setNewPhone('');
    setNewLine1('');
    setNewPincode('');
    setFormError('');
  };

  const handleContinue = () => {
    navigation.navigate('CheckoutDelivery', { addressId: selectedAddressId });
  };

  return (
    <Screen scrollable>
      <Header
        title="Select Delivery Address"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Step Indicator */}
      <View style={[styles.stepBar, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={styles.stepItem}>
          <View style={[styles.stepDot, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.stepNum}>1</Text>
          </View>
          <Text style={[styles.stepLabel, { color: theme.colors.navy, fontFamily: 'Poppins_600SemiBold' }]}>
            Address
          </Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: theme.colors.border }]} />
        <View style={styles.stepItem}>
          <View style={[styles.stepDot, { backgroundColor: theme.colors.border }]}>
            <Text style={[styles.stepNum, { color: theme.colors.textSecondary }]}>2</Text>
          </View>
          <Text style={[styles.stepLabel, { color: theme.colors.textSecondary }]}>Logistics</Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: theme.colors.border }]} />
        <View style={styles.stepItem}>
          <View style={[styles.stepDot, { backgroundColor: theme.colors.border }]}>
            <Text style={[styles.stepNum, { color: theme.colors.textSecondary }]}>3</Text>
          </View>
          <Text style={[styles.stepLabel, { color: theme.colors.textSecondary }]}>Payment</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Add New Address Action */}
        <TouchableOpacity
          onPress={() => setIsAddModalVisible(true)}
          style={[styles.addAddressBtn, { borderColor: theme.colors.primary, backgroundColor: `${theme.colors.primary}12` }]}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={20} color={theme.colors.navy} />
          <Text style={[styles.addAddressText, { color: theme.colors.navy }]}>
            + Add New Project Site Address
          </Text>
        </TouchableOpacity>

        {/* Address Cards List */}
        <Text style={[styles.sectionTitle, { color: theme.colors.navy }]}>
          Saved Delivery Sites ({addresses.length})
        </Text>

        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            selected={selectedAddressId === addr.id}
            onSelect={() => setSelectedAddressId(addr.id)}
          />
        ))}

        <Button
          title="Continue to Logistics & Freight"
          onPress={handleContinue}
          size="lg"
          variant="primary"
          style={styles.continueBtn}
        />
      </View>

      {/* ADD ADDRESS MODAL */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.navy }]}>
                Add Project Site Address
              </Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              {formError ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{formError}</Text>
                </View>
              ) : null}

              <Text style={styles.inputLabel}>Site / Location Label *</Text>
              <TextInput
                value={newLabel}
                onChangeText={setNewLabel}
                placeholder="e.g. Project Site B / Main Warehouse"
                style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              />

              <Text style={styles.inputLabel}>Recipient / Site Manager Name *</Text>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="Full Name"
                style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              />

              <Text style={styles.inputLabel}>Contact Phone Number *</Text>
              <TextInput
                value={newPhone}
                onChangeText={setNewPhone}
                placeholder="+91 98765 43210"
                keyboardType="phone-pad"
                style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              />

              <Text style={styles.inputLabel}>Address Line 1 (Plot, Street, Area) *</Text>
              <TextInput
                value={newLine1}
                onChangeText={setNewLine1}
                placeholder="Plot / House / Street"
                style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>City *</Text>
                  <TextInput
                    value={newCity}
                    onChangeText={setNewCity}
                    style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Pincode *</Text>
                  <TextInput
                    value={newPincode}
                    onChangeText={setNewPincode}
                    placeholder="500001"
                    keyboardType="numeric"
                    maxLength={6}
                    style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
                  />
                </View>
              </View>

              <Button
                title="Save & Select Address"
                onPress={handleAddNewAddress}
                size="lg"
                variant="primary"
                style={{ marginTop: 18 }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stepBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNum: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: '#152238',
  },
  stepLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  stepLine: {
    flex: 1,
    height: 1.5,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    gap: 8,
    marginBottom: 16,
  },
  addAddressText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  sectionTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    marginBottom: 12,
  },
  continueBtn: {
    marginTop: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  modalScroll: {
    padding: 16,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    gap: 6,
    marginBottom: 12,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#EF4444',
  },
  inputLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12.5,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
});
