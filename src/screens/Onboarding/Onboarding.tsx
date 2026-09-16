import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './Onboarding.styles';

type Props = {
  navigation: any;
};

const Onboarding = ({ navigation }: Props) => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  const handleGoToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Card Image */}
          <View style={styles.imageCardWrapper}>
            <Image
              source={require('../../assets/images/onboarding1.jpg')}
              style={styles.image}
            />
          </View>

          {/* Text Information */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Various Collections Of The{'\n'}Latest Products
            </Text>
            <Text style={styles.description}>
              Urna amet, suspendisse ullamcorper ac elit diam facilisis cursus vestibulum.
            </Text>
          </View>
        </View>

        {/* Go to Home Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={handleGoToHome}
          >
            <Text style={styles.primaryButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;