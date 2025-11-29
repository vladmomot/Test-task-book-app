import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

interface CustomToastProps {
  text?: string;
}

const CustomToast: React.FC<CustomToastProps> = ({ text }) => {
  return (
    <View style={styles.toastContainer}>
      <Text style={styles.toastText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastText: {
    ...fonts.button,
    color: colors.white,
  },
});

export default CustomToast;

