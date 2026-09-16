import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F7F7FA',
    shadowColor: '#000',
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
    fontSize: 24,
    fontWeight: '700',
    color: '#1E202B',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: '#9E9EA7',
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
    backgroundColor: '#5041BC',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5041BC',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});