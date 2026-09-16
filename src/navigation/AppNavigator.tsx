import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../screens/Splash';
import Onboarding from '../screens/Onboarding';
import Home from '../screens/Home';
import Wishlist from '../screens/Wishlist';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Wishlist" component={Wishlist} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;