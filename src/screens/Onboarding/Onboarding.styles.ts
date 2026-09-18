import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_SIZE } from '../../constants';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  content: {
    alignItems: 'center',
  },
  imageCardWrapper: {
    width: '100%',
    height: height * 0.48,
    borderRadius: 36,
    overflow: 'hidden',
    marginTop: 8,
    backgroundColor: COLORS.cardBackground,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 28,
  },
  title: {
    fontSize: FONT_SIZE.heading,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: FONT_SIZE.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  bottomSection: {
    width: '100%',
    paddingHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});