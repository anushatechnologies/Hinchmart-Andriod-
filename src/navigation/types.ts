/**
 * HINCH MART — Comprehensive Navigation Types
 */
import type { NavigatorScreenParams } from '@react-navigation/native';
import { Address, Order } from '../types/order.types';

/**
 * Authentication stack routes
 */
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  OTP: {
    phone: string;
    purpose: 'login' | 'register';
  };
  Register: { phone?: string } | undefined;
  RegistrationDetails: {
    verificationToken?: string;
    phone?: string;
    directRegister?: boolean;
  } | undefined;
};

/**
 * Main application tabs
 */
export type BottomTabParamList = {
  HomeTab: undefined;
  CategoriesTab: undefined;
  RFQTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

/**
 * Root stack navigation routes
 */
export type RootStackParamList = {
  // Auth
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  OTP: { phone: string; purpose: 'login' | 'register' };
  OTPScreen: { phone: string; purpose: 'login' | 'register' };
  Register: { phone?: string } | undefined;
  RegistrationDetails: {
    verificationToken?: string;
    phone?: string;
    directRegister?: boolean;
  } | undefined;

  // Main Tabs
  MainTabs: NavigatorScreenParams<BottomTabParamList> | undefined;

  // Product & Search
  ProductList: {
    categoryId?: string;
    categoryName?: string;
    isFeatured?: boolean;
    isTrending?: boolean;
    brand?: string;
    search?: string;
  } | undefined;
  ProductDetail: { productId: string };
  Search: undefined;

  // Checkout Flow
  CheckoutAddress: undefined;
  CheckoutDelivery: { addressId: string };
  CheckoutPayment: {
    addressId: string;
    deliveryMethodId: string;
    deliveryCharge: number;
  };
  CheckoutReview: {
    addressId: string;
    deliveryMethodId: string;
    paymentMethod: string;
    deliveryCharge: number;
  };
  OrderSuccess: {
    orderId?: string;
    orderNumber: string;
    estimatedDelivery?: string;
  };

  // Orders & Tracking
  OrderHistory: { initialTab?: string } | undefined;
  OrderDetail: { orderId: string };
  OrderTracking: { orderId: string; orderNumber?: string };

  // RFQ
  RFQList: { initialTab?: string } | undefined;
  RFQDetail: { rfqId: string };
  RFQCreate: undefined;

  // Vendors & Rentals
  VendorList: undefined;
  VendorDetail: { vendorId: string };
  VendorDashboard: undefined;
  RentalList: undefined;

  // Profile & Settings
  Profile: undefined;
  EditProfile: undefined;
  BusinessProfile: { openEdit?: boolean } | undefined;
  Addresses: undefined;
  AddEditAddress: { address?: Address; onSaved?: () => void } | undefined;
  Wishlist: undefined;
  Wallet: undefined;
  Settings: undefined;
  Language: undefined;
  Notifications: undefined;

  // Legal & Support
  PrivacyPolicy: undefined;
  Terms: undefined;
  HelpSupport: undefined;
  About: undefined;
  FAQ: undefined;
  News: undefined;
  ChatList: undefined;
};