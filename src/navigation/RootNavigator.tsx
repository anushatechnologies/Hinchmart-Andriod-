/**
 * HINCH MART — Root Stack Navigator
 * Unified navigation structure for all screens and tabs + Global Cart Toast Popup
 */
import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { BottomTabNavigator } from './BottomTabNavigator';
import { CartToastPopup } from '../components/ui/CartToastPopup';

import { SplashScreen } from '../features/auth/screens/SplashScreen';
import { OnboardingScreen } from '../features/auth/screens/OnboardingScreen';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { SignupScreen } from '../features/auth/screens/SignupScreen';
import { OTPScreen } from '../features/auth/screens/OTPScreen';
import { RegistrationDetailsScreen } from '../features/auth/screens/RegistrationDetailsScreen';
import { ForgotPasswordScreen } from '../features/auth/screens/ForgotPasswordScreen';

import { ProductListScreen } from '../features/products/screens/ProductListScreen';
import { ProductDetailScreen } from '../features/products/screens/ProductDetailScreen';
import { SearchScreen } from '../features/search/screens/SearchScreen';
import { CheckoutAddressScreen, CheckoutPaymentScreen, OrderSuccessScreen } from '../features/checkout/screens/CheckoutAddressScreen';
import { OrderHistoryScreen, OrderDetailScreen, WalletScreen, RFQListScreen, RFQDetailScreen, RFQCreateScreen } from '../features/rfq/screens/RFQListScreen';
import { SettingsScreen } from '../features/profile/screens/ProfileScreen';
import { BusinessProfileScreen, AddressesScreen } from '../features/profile/screens/BusinessProfileScreen';
import { LanguageCurrencyScreen } from '../features/profile/screens/LanguageCurrencyScreen';
import { VendorDashboardScreen, VendorDetailScreen, RentalListScreen } from '../features/vendors/screens/VendorDashboardScreen';
import { NotificationsScreen, ChatListScreen, FAQScreen, NewsScreen } from '../features/notifications/screens/NotificationsScreen';
import { PrivacyPolicyScreen, HelpSupportScreen, AboutScreen, TermsScreen } from '../features/profile/screens/LegalScreens';

const Stack = createStackNavigator();

export function RootNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        {/* Splash & Auth Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="OTPVerification" component={OTPScreen} />
        <Stack.Screen name="RegistrationDetails" component={RegistrationDetailsScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ForgotPasswordScreen} />

        {/* Main App & Bottom Tabs */}
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="ProductList" component={ProductListScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="CheckoutAddress" component={CheckoutAddressScreen} />
        <Stack.Screen name="CheckoutPayment" component={CheckoutPaymentScreen} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        <Stack.Screen name="RFQDetail" component={RFQDetailScreen} />
        <Stack.Screen name="VendorDetail" component={VendorDetailScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="RFQCreate" component={RFQCreateScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="BusinessProfile" component={BusinessProfileScreen} />
        <Stack.Screen name="Addresses" component={AddressesScreen} />
        <Stack.Screen name="Language" component={LanguageCurrencyScreen} />
        <Stack.Screen name="VendorDashboard" component={VendorDashboardScreen} />
        <Stack.Screen name="RentalList" component={RentalListScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="ChatList" component={ChatListScreen} />
        <Stack.Screen name="FAQ" component={FAQScreen} />
        <Stack.Screen name="News" component={NewsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
      </Stack.Navigator>
      <CartToastPopup />
    </View>
  );
}
