import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import CustomToast from './src/components/toast/CustomToast';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

Sentry.init({
  dsn: 'https://9827a0d457abe75ac31c314c4b84507a@o4510809804177408.ingest.de.sentry.io/4510809814990928',
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  integrations: !__DEV__
    ? [
        Sentry.reactNativeTracingIntegration(),
        Sentry.hermesProfilingIntegration(),
        Sentry.reactNavigationIntegration(),
      ]
    : [
        Sentry.reactNativeTracingIntegration(),
        Sentry.reactNavigationIntegration(),
      ],
});

const toastConfig = {
  info: ({ text1 }: { text1?: string }) => <CustomToast text={text1} />,
};

const queryClient = new QueryClient();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          translucent={true}
          backgroundColor="transparent"
        />
        <QueryClientProvider client={queryClient}>
          <AppNavigator />
        </QueryClientProvider>
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
