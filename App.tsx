/**
 * HINCH MART — Main Application Entry Point
 * "EVERYTHING FOR EVERY CONSTRUCTION"
 */
import 'react-native-gesture-handler';
import './src/localization';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor } from './src/redux';
import { queryClient } from './src/services/api/queryClient';
import { ThemeProvider } from './src/theme';
import { RootNavigator } from './src/navigation/RootNavigator';
import { authStore } from './src/store/authStore';
import { locationStore } from './src/store/locationStore';

export default function App() {
  React.useEffect(() => {
    authStore.init();
    locationStore.init();
  }, []);

  return (
    <View style={styles.rootWrapper}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider>
                <NavigationContainer>
                  <RootNavigator />
                </NavigationContainer>
              </ThemeProvider>
            </QueryClientProvider>
          </PersistGate>
        </ReduxProvider>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  rootWrapper: {
    flex: 1,
    direction: 'ltr',
  },
});
