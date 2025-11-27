import { TextStyle } from 'react-native';

export const fonts = {
  h1: {
    fontFamily: 'NunitoSans',
    fontWeight: '700' as TextStyle['fontWeight'],
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 0,
  } as TextStyle,

  button: {
    fontFamily: 'NunitoSans',
    fontWeight: '800' as TextStyle['fontWeight'],
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'center' as TextStyle['textAlign'],
    textAlignVertical: 'center' as any,
  } as TextStyle,

  title: {
    fontFamily: 'NunitoSans',
    fontWeight: '600' as TextStyle['fontWeight'],
    fontSize: 16,
    lineHeight: 17.6,
    letterSpacing: -0.41,
  } as TextStyle,

  text: {
    fontFamily: 'NunitoSans',
    fontWeight: '600' as TextStyle['fontWeight'],
    fontSize: 14,
    lineHeight: 16.8,
    letterSpacing: 0.15,
  } as TextStyle,

  splashTitle: {
    fontFamily: 'Georgia',
    fontWeight: '700' as TextStyle['fontWeight'],
    fontSize: 52,
    lineHeight: 52,
    letterSpacing: 0,
    color: '#DD48A1',
    fontStyle: 'italic' as TextStyle['fontStyle'],
  } as TextStyle,

  splashSubtitle: {
    fontFamily: 'NunitoSans',
    fontWeight: '700' as TextStyle['fontWeight'],
    fontSize: 24,
    lineHeight: 26.4,
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.8)',
  } as TextStyle,
};

