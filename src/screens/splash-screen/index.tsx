import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text, ImageBackground, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { initRemoteConfig } from '@/services/remoteConfig';
import { fonts, images } from '@/theme';
import RNBootSplash from 'react-native-bootsplash';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PROGRESS_WIDTH = SCREEN_WIDTH - 64;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        RNBootSplash.hide({ fade: true });
      }, 200);
    });
  }, []);

  useEffect(() => {
    const initConfig = async () => {
      try {
        await initRemoteConfig();
      } catch (error) {
        if (__DEV__) {
          console.error('Failed to initialize Remote Config:', error);
        }
      }
    };

    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 10,
          useNativeDriver: false,
        }),
      ]),
    ).start();

    initConfig();

    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PROGRESS_WIDTH > 274 ? 274 : PROGRESS_WIDTH],
  });

  return (
    <ImageBackground source={images.bgSplash} style={styles.container} resizeMode="cover">
      <ImageBackground source={images.bgSplashHeart} style={styles.heartLayer} resizeMode="cover">
        <View style={styles.content}>
          <Text style={styles.splashTitle}>Book App</Text>
          <Text style={styles.splashSubtitle}>Welcome to Book App</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
            </View>
          </View>
        </View>
      </ImageBackground>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  heartLayer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashTitle: {
    ...fonts.splashTitle,
    fontSize: SCREEN_WIDTH < 338 ? 40 : 52,
    marginBottom: 12,
  },
  splashSubtitle: {
    ...fonts.splashSubtitle,
    fontSize: SCREEN_WIDTH < 338 ? 20 : 24,
    marginBottom: 48,
  },
  progressBarContainer: {
    alignItems: 'center',
  },
  progressBarBackground: {
    width: PROGRESS_WIDTH,
    maxWidth: 274,
    height: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 6,
  },
});

export default SplashScreen;
