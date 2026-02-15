import React from 'react';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import SplashScreen from '@/screens/splash-screen';
import MainScreen from '@/screens/main-screen';
import BookDetailsScreen from '@/screens/book-details-screen';
import UsersScreen from '@/screens/users-screen';
import CameraScreen from '@/screens/camera-screen';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import * as Sentry from '@sentry/react-native';

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
});

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef();
const navigationIntegration = Sentry.reactNavigationIntegration();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        navigationIntegration.registerNavigationContainer(navigationRef);
      }}
    >
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
        <Stack.Screen name="Users" component={UsersScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
