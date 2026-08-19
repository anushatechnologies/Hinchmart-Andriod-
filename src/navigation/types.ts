/**
 * HINCH MART — Navigation Types
 */

import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Authentication stack.
 */
export type AuthStackParamList = {
  Splash: undefined;

  Onboarding: undefined;

  Login: undefined;

  OTP: {
    phone: string;
    purpose: 'login' | 'register';
  };

  Register:
    | {
        phone?: string;
      }
    | undefined;

  RegistrationDetails:
    | {
        verificationToken?: string;
        phone?: string;
        directRegister?: boolean;
      }
    | undefined;
};

/**
 * Main application tabs.
 *
 * Keep the existing tab routes from your project
 * if they already exist.
 */
export type BottomTabParamList = {
  HomeTab: undefined;
  CategoriesTab: undefined;
  CartTab: undefined;
  RFQTab: undefined;
  ProfileTab: undefined;
};

/**
 * Root navigation.
 */
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;

  MainTabs: NavigatorScreenParams<BottomTabParamList>;
};