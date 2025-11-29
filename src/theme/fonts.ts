import { TextStyle } from 'react-native';

const fonts = {
  h1: {
    fontFamily: 'NunitoSans-Bold',
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 0,
  } as TextStyle,

  button: {
    fontFamily: 'NunitoSans-Bold',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
  } as TextStyle,

  title: {
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    lineHeight: 17.6,
    letterSpacing: -0.41,
  } as TextStyle,

  text: {
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 14,
    lineHeight: 16.8,
    letterSpacing: 0.15,
  } as TextStyle,

  splashTitle: {
    fontFamily: 'Georgia',
    fontSize: 52,
    lineHeight: 52,
    letterSpacing: 0,
    color: '#DD48A1',
  } as TextStyle,

  splashSubtitle: {
    fontFamily: 'NunitoSans-Bold',
    fontSize: 24,
    lineHeight: 26.4,
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.8)',
  } as TextStyle,

  statValue: {
    fontFamily: 'NunitoSans-Bold',
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.41,
  } as TextStyle,

  statLabel: {
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 12,
    lineHeight: 13.2,
    letterSpacing: -0.41,
  } as TextStyle,

  authorName: {
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
    lineHeight: 15.4,
    letterSpacing: -0.41,
  } as TextStyle,
};

export default fonts;
