import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { styles } from './Splash.styles';
import { SCREEN_NAME } from '../../constants/screenNames';

type Props = {
  navigation: any;
};

const Splash = ({ navigation }: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(SCREEN_NAME.ONBOARDING);
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
