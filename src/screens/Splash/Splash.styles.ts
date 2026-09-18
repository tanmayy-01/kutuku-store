import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE } from '../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primarySplash,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.white,
    fontSize: FONT_SIZE.splash,
    fontWeight: '700',
    textAlign: 'center',
  },
  sub_title: {
    color: COLORS.white,
    fontSize: FONT_SIZE.body,
    marginTop: 7,
    textAlign: 'center',
  },
});