/**
 * HINCH MART — Premium Delivery Location Picker Modal
 * Integrated with react-native-maps, expo-location, and project site presets
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface DeliverySite {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  type: 'project' | 'warehouse' | 'office';
  latitude: number;
  longitude: number;
}

export const PRESET_DELIVERY_SITES: DeliverySite[] = [
  {
    id: 'loc1',
    name: 'Business Bay Project Site #4',
    address: 'Marasi Drive, Business Bay',
    city: 'Dubai',
    country: 'UAE',
    type: 'project',
    latitude: 25.1857,
    longitude: 55.2778,
  },
  {
    id: 'loc2',
    name: 'Downtown Riyadh Commercial Hub',
    address: 'King Fahd Road, Olaya',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    type: 'project',
    latitude: 24.7136,
    longitude: 46.6753,
  },
  {
    id: 'loc3',
    name: 'Sharjah Industrial Yard 13',
    address: 'Industrial Area 13, Warehouse 42',
    city: 'Sharjah',
    country: 'UAE',
    type: 'warehouse',
    latitude: 25.3123,
    longitude: 55.4321,
  },
  {
    id: 'loc4',
    name: 'West Bay Infrastructure Zone',
    address: 'Diplomatic Area, West Bay',
    city: 'Doha',
    country: 'Qatar',
    type: 'project',
    latitude: 25.3223,
    longitude: 51.5312,
  },
  {
    id: 'loc5',
    name: 'BKC Metro Construction Site',
    address: 'G Block, Bandra Kurla Complex',
    city: 'Mumbai',
    country: 'India',
    type: 'project',
    latitude: 19.0657,
    longitude: 72.8686,
  },
];

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSite: DeliverySite;
  onSelectSite: (site: DeliverySite) => void;
}

export function LocationPickerModal({
  visible,
  onClose,
  selectedSite,
  onSelectSite,
}: LocationPickerModalProps) {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingGps, setLoadingGps] = useState(false);
  const [currentSelected, setCurrentSelected] = useState<DeliverySite>(selectedSite);

  const filteredSites = PRESET_DELIVERY_SITES.filter(
    (site) =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFetchGpsLocation = async () => {
    try {
      setLoadingGps(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to detect your current position.'
        );
        setLoadingGps(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [reverseGeocode] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const cityName = reverseGeocode?.city || reverseGeocode?.region || 'Current Location';
      const countryName = reverseGeocode?.country || '';

      const userGpsSite: DeliverySite = {
        id: `gps_${Date.now()}`,
        name: `Current Location (${cityName})`,
        address: reverseGeocode?.street || reverseGeocode?.name || 'GPS Coordinates',
        city: cityName,
        country: countryName,
        type: 'project',
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentSelected(userGpsSite);
    } catch (error) {
      Alert.alert('Location Error', 'Unable to fetch current GPS coordinates.');
    } finally {
      setLoadingGps(false);
    }
  };

  const handleConfirm = () => {
    onSelectSite(currentSelected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.colors.cardBackground },
          ]}
        >
          {/* Header */}
          <View style={[styles.headerRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.headerTitleWrap}>
              <Ionicons name="location" size={22} color={theme.colors.primary} />
              <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
                Select Delivery Site
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Interactive Map Preview */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={{
                latitude: currentSelected.latitude,
                longitude: currentSelected.longitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
              }}
              scrollEnabled={true}
              zoomEnabled={true}
            >
              <Marker
                coordinate={{
                  latitude: currentSelected.latitude,
                  longitude: currentSelected.longitude,
                }}
                title={currentSelected.name}
                description={`${currentSelected.city}, ${currentSelected.country}`}
              />
            </MapView>
            
            <View style={[styles.mapOverlayChip, { backgroundColor: theme.colors.navy }]}>
              <Ionicons name="pin" size={12} color={theme.colors.primary} />
              <Text style={styles.mapOverlayText}>
                {currentSelected.city}, {currentSelected.country}
              </Text>
            </View>
          </View>

          {/* Search & GPS Button */}
          <View style={styles.searchSection}>
            <View style={[styles.searchInputWrap, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
              <Ionicons name="search" size={16} color={theme.colors.textTertiary} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search city or construction site..."
                placeholderTextColor={theme.colors.textTertiary}
                style={[styles.searchInput, { color: theme.colors.textPrimary }]}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color={theme.colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={handleFetchGpsLocation}
              disabled={loadingGps}
              style={[styles.gpsBtn, { backgroundColor: `${theme.colors.primary}18`, borderColor: theme.colors.primary }]}
              activeOpacity={0.8}
            >
              {loadingGps ? (
                <ActivityIndicator size="small" color={theme.colors.navy} />
              ) : (
                <>
                  <Ionicons name="navigate-circle" size={18} color={theme.colors.navy} />
                  <Text style={[styles.gpsBtnText, { color: theme.colors.navy }]}>
                    Use Current GPS Location
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Saved Sites List */}
          <Text style={[styles.sectionHeading, { color: theme.colors.textTertiary }]}>
            REGISTERED B2B PROJECT SITES
          </Text>

          <FlatList
            data={filteredSites}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => {
              const isSelected = item.id === currentSelected.id;
              return (
                <TouchableOpacity
                  onPress={() => setCurrentSelected(item)}
                  activeOpacity={0.7}
                  style={[
                    styles.siteCard,
                    {
                      backgroundColor: isSelected
                        ? `${theme.colors.primary}14`
                        : theme.colors.surfaceVariant,
                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.siteIconWrap,
                      {
                        backgroundColor: isSelected
                          ? theme.colors.primary
                          : `${theme.colors.textTertiary}15`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.type === 'warehouse' ? 'cube' : 'business'}
                      size={18}
                      color={isSelected ? theme.colors.navy : theme.colors.textSecondary}
                    />
                  </View>

                  <View style={styles.siteMeta}>
                    <Text style={[styles.siteName, { color: theme.colors.textPrimary }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.siteAddr, { color: theme.colors.textSecondary }]}>
                      {item.address} · {item.city}, {item.country}
                    </Text>
                  </View>

                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              );
            }}
          />

          {/* Confirm Button */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleConfirm} activeOpacity={0.85} style={styles.confirmBtnWrap}>
              <LinearGradient
                colors={['#FDB913', '#F9A825']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmBtn}
              >
                <Text style={styles.confirmBtnText}>Confirm Delivery Location</Text>
                <Ionicons name="arrow-forward" size={16} color="#152238" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: 560,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    height: 140,
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlayChip: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  mapOverlayText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: 14,
    gap: 10,
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  gpsBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },
  sectionHeading: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.8,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  siteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  siteIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  siteMeta: {
    flex: 1,
  },
  siteName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },
  siteAddr: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  confirmBtnWrap: {
    width: '100%',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  confirmBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: '#152238',
  },
});
