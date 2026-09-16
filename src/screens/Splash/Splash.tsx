import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { styles } from './Splash.styles';

type Props = {
  navigation: any;
};

const Splash = ({ navigation }: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kutuku</Text>
      <Text style={styles.sub_title}>Any Shopping just from home</Text>
    </View>
  );
};

export default Splash;
