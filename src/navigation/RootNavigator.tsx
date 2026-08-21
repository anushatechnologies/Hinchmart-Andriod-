/**
 * HINCH MART — Root Stack Navigator
 * Unified navigation structure for all screens and tabs + Global Cart Toast Popup
 */
import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { BottomTabNavigator } from './BottomTabNavigator';
import { CartToastPopup } from '../components/ui/CartToastPopup';

// Auth screens
import { SplashScreen } from '../features/auth/screens/SplashScreen';
import { OnboardingScreen } from '../features/auth/screens/OnboardingScreen';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { OTPScreen } from '../features/auth/screens/OTPScreen';
import { RegistrationDetailsScreen } from '../features/auth/screens/RegistrationDetailsScreen';

// Product & Search screens
import { ProductListScreen } from '../features/products/screens/ProductListScreen';
import { ProductDetailScreen } from '../features/products/screens/ProductDetailScreen';
import { SearchScreen } from '../features/search/screens/SearchScreen';

// Checkout Flow
import { CheckoutAddressScreen } from '../features/checkout/screens/CheckoutAddressScreen';
import { CheckoutDeliveryScreen } from '../features/checkout/screens/CheckoutDeliveryScreen';
import { CheckoutPaymentScreen } from '../features/checkout/screens/CheckoutPaymentScreen';
import { CheckoutReviewScreen } from '../features/checkout/screens/CheckoutReviewScreen';
import { OrderSuccessScreen } from '../features/checkout/screens/OrderSuccessScreen';

// Orders & Live Tracking
import { OrderHistoryScreen } from '../features/orders/screens/OrderHistoryScreen';
import { OrderDetailScreen } from '../features/orders/screens/OrderDetailScreen';
import { OrderTrackingScreen } from '../features/orders/screens/OrderTrackingScreen';

// RFQ & Finance
import { WalletScreen, RFQListScreen, RFQDetailScreen, RFQCreateScreen } from '../features/rfq/screens/RFQListScreen';

// Profile & Saved
import { SettingsScreen } from '../features/profile/screens/ProfileScreen';
import { EditProfileScreen } from '../features/profile/screens/EditProfileScreen';
import { BusinessProfileScreen, AddressesScreen } from '../features/profile/screens/BusinessProfileScreen';
import { WishlistScreen } from '../features/profile/screens/WishlistScreen';
import { LanguageCurrencyScreen } from '../features/profile/screens/LanguageCurrencyScreen';

// Vendors & Rentals
import { VendorListScreen } from '../features/vendors/screens/VendorListScreen';
import { VendorDashboardScreen, VendorDetailScreen, RentalListScreen } from '../features/vendors/screens/VendorDashboardScreen';

// Notifications & Content
import { NotificationsScreen, ChatListScreen, FAQScreen, NewsScreen } from '../features/notifications/screens/NotificationsScreen';

// Legal
import { PrivacyPolicyScreen, HelpSupportScreen, AboutScreen, TermsScreen } from '../features/profile/screens/LegalScreens';

const Stack = createStackNavigator();

export function RootNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">

        {/* ── Auth Flow ─────────────────────────────────────────── */}
        <Stack.Screen name="Splash"               component={SplashScreen} />
        <Stack.Screen name="Onboarding"           component={OnboardingScreen} />
        <Stack.Screen name="Login"                component={LoginScreen} />
        <Stack.Screen name="OTP"                  component={OTPScreen} />
        <Stack.Screen name="OTPScreen"            component={OTPScreen} />
        <Stack.Screen name="Register"             component={RegistrationDetailsScreen} />
        <Stack.Screen name="RegistrationDetails"  component={RegistrationDetailsScreen} />

        {/* ── Main App ──────────────────────────────────────────── */}
        <Stack.Screen name="MainTabs"      component={BottomTabNavigator} />
        <Stack.Screen name="ProductList"   component={ProductListScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Search"        component={SearchScreen} />

        {/* Checkout Flow (4-Step) */}
        <Stack.Screen name="CheckoutAddress"  component={CheckoutAddressScreen} />
        <Stack.Screen name="CheckoutDelivery" component={CheckoutDeliveryScreen} />
        <Stack.Screen name="CheckoutPayment"  component={CheckoutPaymentScreen} />
        <Stack.Screen name="CheckoutReview"   component={CheckoutReviewScreen} />
        <Stack.Screen name="OrderSuccess"     component={OrderSuccessScreen} />

        {/* Orders & Tracking */}
        <Stack.Screen name="OrderHistory"  component={OrderHistoryScreen} />
        <Stack.Screen name="OrderDetail"   component={OrderDetailScreen} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        <Stack.Screen name="Wallet"        component={WalletScreen} />

        {/* RFQ */}
        <Stack.Screen name="RFQList"   component={RFQListScreen} />
        <Stack.Screen name="RFQDetail" component={RFQDetailScreen} />
        <Stack.Screen name="RFQCreate" component={RFQCreateScreen} />

        {/* Profile & Saved */}
        <Stack.Screen name="EditProfile"     component={EditProfileScreen} />
        <Stack.Screen name="Wishlist"        component={WishlistScreen} />
        <Stack.Screen name="Settings"        component={SettingsScreen} />
        <Stack.Screen name="BusinessProfile" component={BusinessProfileScreen} />
        <Stack.Screen name="Addresses"       component={AddressesScreen} />
        <Stack.Screen name="Language"        component={LanguageCurrencyScreen} />

        {/* Vendors & Rentals */}
        <Stack.Screen name="VendorList"      component={VendorListScreen} />
        <Stack.Screen name="VendorDashboard" component={VendorDashboardScreen} />
        <Stack.Screen name="VendorDetail"    component={VendorDetailScreen} />
        <Stack.Screen name="RentalList"      component={RentalListScreen} />

        {/* Notifications & Content */}
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="ChatList"      component={ChatListScreen} />
        <Stack.Screen name="FAQ"           component={FAQScreen} />
        <Stack.Screen name="News"          component={NewsScreen} />

        {/* Legal */}
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="HelpSupport"   component={HelpSupportScreen} />
        <Stack.Screen name="About"         component={AboutScreen} />
        <Stack.Screen name="Terms"         component={TermsScreen} />

      </Stack.Navigator>
      <CartToastPopup />
    </View>
  );
}
