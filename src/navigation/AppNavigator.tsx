import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../screens/Splash';
import Onboarding from '../screens/Onboarding';
import Home from '../screens/Home';
import Wishlist from '../screens/Wishlist';
import ProductDetails from '../screens/ProductDetails';
import Cart from '../screens/Cart';
import { SCREEN_NAME } from '../constants/screenNames';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={SCREEN_NAME.SPLASH}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name={SCREEN_NAME.SPLASH} component={Splash} />
        <Stack.Screen name={SCREEN_NAME.ONBOARDING} component={Onboarding} />
        <Stack.Screen name={SCREEN_NAME.HOME} component={Home} />
        <Stack.Screen name={SCREEN_NAME.WISHLIST} component={Wishlist} />
        <Stack.Screen name={SCREEN_NAME.PRODUCT_DETAILS} component={ProductDetails} />
        <Stack.Screen name={SCREEN_NAME.CART} component={Cart} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;