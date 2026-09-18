import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/redux';
import AppNavigator from './src/navigation';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/query/queryClient';
import { StatusBar } from 'react-native';
import { COLORS } from './src/constants';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SafeAreaProvider>
          <SafeAreaView style={{flex:1, backgroundColor: COLORS.background}}>
             <StatusBar barStyle="dark-content" />
          <AppNavigator />
          </SafeAreaView>
        </SafeAreaProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
