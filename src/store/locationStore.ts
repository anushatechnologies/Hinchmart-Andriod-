/**
 * HINCH MART — Location Store
 * Manages construction site delivery addresses, GPS coordinates, and default project locations
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mmkvStorage } from '../services/storage/mmkv';

export interface DeliveryLocation {
  id: string;
  siteName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  contactPerson?: string;
  contactPhone?: string;
  isDefault?: boolean;
}

const STORAGE_KEY_LOCATION = '@hinchmart_active_location';
const STORAGE_KEY_SAVED_LOCATIONS = '@hinchmart_saved_locations';

const DEFAULT_LOCATION: DeliveryLocation = {
  id: 'loc_default',
  siteName: 'Main Construction Site #4',
  addressLine1: 'Business Bay Tower Project, Plot 42',
  city: 'Dubai',
  state: 'Dubai',
  postalCode: '00000',
  country: 'United Arab Emirates',
  contactPerson: 'Project Site Supervisor',
  contactPhone: '+971 50 123 4567',
  isDefault: true,
};

let activeLocation: DeliveryLocation = DEFAULT_LOCATION;
let savedLocations: DeliveryLocation[] = [DEFAULT_LOCATION];

export const locationStore = {
  /**
   * Initialize saved locations from storage
   */
  init: async () => {
    try {
      const activeJson = mmkvStorage.getString(STORAGE_KEY_LOCATION);
      if (activeJson) {
        activeLocation = JSON.parse(activeJson);
      } else {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_LOCATION);
        if (raw) activeLocation = JSON.parse(raw);
      }

      const savedJson = mmkvStorage.getString(STORAGE_KEY_SAVED_LOCATIONS);
      if (savedJson) {
        savedLocations = JSON.parse(savedJson);
      } else {
        const rawSaved = await AsyncStorage.getItem(STORAGE_KEY_SAVED_LOCATIONS);
        if (rawSaved) savedLocations = JSON.parse(rawSaved);
      }
    } catch (e) {
      console.warn('[LocationStore] Init error:', e);
    }
  },

  /**
   * Get active delivery location
   */
  getActiveLocation: (): DeliveryLocation => {
    return activeLocation;
  },

  /**
   * Get formatted single-line address string
   */
  getFormattedAddress: (): string => {
    const loc = activeLocation;
    return `${loc.siteName ? loc.siteName + ', ' : ''}${loc.addressLine1}, ${loc.city}, ${loc.country}`;
  },

  /**
   * Set active delivery location
   */
  setActiveLocation: async (location: DeliveryLocation): Promise<void> => {
    activeLocation = location;
    try {
      mmkvStorage.setString(STORAGE_KEY_LOCATION, JSON.stringify(location));
      await AsyncStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(location));
    } catch (e) {
      console.warn('[LocationStore] Save active error:', e);
    }
  },

  /**
   * Get all saved site delivery addresses
   */
  getSavedLocations: (): DeliveryLocation[] => {
    return savedLocations;
  },

  /**
   * Add new saved delivery address
   */
  addSavedLocation: async (location: Omit<DeliveryLocation, 'id'>): Promise<DeliveryLocation> => {
    const newLoc: DeliveryLocation = {
      ...location,
      id: `loc_${Date.now()}`,
    };
    savedLocations.push(newLoc);
    try {
      mmkvStorage.setString(STORAGE_KEY_SAVED_LOCATIONS, JSON.stringify(savedLocations));
      await AsyncStorage.setItem(STORAGE_KEY_SAVED_LOCATIONS, JSON.stringify(savedLocations));
    } catch (e) {
      console.warn('[LocationStore] Save error:', e);
    }
    return newLoc;
  },

  /**
   * Delete a saved location
   */
  deleteSavedLocation: async (id: string): Promise<void> => {
    savedLocations = savedLocations.filter((l) => l.id !== id);
    try {
      mmkvStorage.setString(STORAGE_KEY_SAVED_LOCATIONS, JSON.stringify(savedLocations));
      await AsyncStorage.setItem(STORAGE_KEY_SAVED_LOCATIONS, JSON.stringify(savedLocations));
    } catch (e) {
      console.warn('[LocationStore] Delete error:', e);
    }
  },
};

export default locationStore;
