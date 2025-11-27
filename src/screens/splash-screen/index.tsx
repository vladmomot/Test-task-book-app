import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Text,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import remoteConfigService from '../../services/remoteConfig';
import { fonts, images } from '../../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Инициализация Remote Config
    const initRemoteConfig = async () => {
      try {
        await remoteConfigService.initialize();
        console.log('Remote Config initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Remote Config:', error);
      }
    };

    initRemoteConfig();

    // Анимация прогресс бара (бесконечная)
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Переход на Main screen через 2 секунды
    const timer = setTimeout(() => {
    // navigation.replace('Main');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 274],
  });

  return (
    <ImageBackground
      source={images.bgSplash}
      style={styles.container}
      resizeMode="cover"
    >
      <ImageBackground
        source={images.bgSplashHeart}
        style={styles.heartLayer}
        resizeMode="cover">
        <View style={styles.content}>
          <Text style={styles.splashTitle}>Book App</Text>
          <Text style={fonts.splashSubtitle}>Welcome to Book App</Text>
          <View style={styles.splashSubtitle} />
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[styles.progressBarFill, { width: progressWidth }]}
              />
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
    marginBottom: 12,
  },
  splashSubtitle: {
    ...fonts.splashSubtitle,
    marginBottom: 48,
  },
  progressBarContainer: {
    alignItems: 'center',
  },
  progressBarBackground: {
    width: 274,
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
