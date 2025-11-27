import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { TopBannerSlide } from '../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TopBannerProps {
  slides: TopBannerSlide[];
}

const TopBanner: React.FC<TopBannerProps> = ({ slides }) => {
  const navigation = useNavigation<NavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Создаем бесконечный список слайдов
  const infiniteSlides = slides.length > 0 
    ? [slides[slides.length - 1], ...slides, slides[0]]
    : [];

  useEffect(() => {
    if (slides.length === 0) return;

    // Устанавливаем начальную позицию на первый реальный слайд
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: SCREEN_WIDTH,
        animated: false,
      });
    }, 100);

    // Автоскролл каждые 3 секунды
    const startAutoScroll = () => {
      autoScrollTimer.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= slides.length) {
            // Переход к первому слайду через последний
            scrollViewRef.current?.scrollTo({
              x: SCREEN_WIDTH * (slides.length + 1),
              animated: true,
            });
            return 0;
          } else {
            scrollViewRef.current?.scrollTo({
              x: SCREEN_WIDTH * (nextIndex + 1),
              animated: true,
            });
            return nextIndex;
          }
        });
      }, 3000);
    };

    startAutoScroll();

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [slides.length]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);

    // Обработка бесконечного скролла
    if (index === 0) {
      // Прокрутили к последнему слайду (клонированному)
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: SCREEN_WIDTH * slides.length,
          animated: false,
        });
        setCurrentIndex(slides.length - 1);
      }, 50);
    } else if (index === infiniteSlides.length - 1) {
      // Прокрутили к первому слайду (клонированному)
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: SCREEN_WIDTH,
          animated: false,
        });
        setCurrentIndex(0);
      }, 50);
    } else {
      setCurrentIndex(index - 1);
    }
  };

  const handleSlidePress = (slide: TopBannerSlide) => {
    navigation.navigate('Details', { bookId: slide.book_id });
  };

  const handleScrollBeginDrag = () => {
    // Останавливаем автоскролл при ручном свайпе
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  };

  const handleScrollEndDrag = () => {
    // Возобновляем автоскролл после окончания свайпа
    if (autoScrollTimer.current === null) {
      autoScrollTimer.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= slides.length) {
            scrollViewRef.current?.scrollTo({
              x: SCREEN_WIDTH * (slides.length + 1),
              animated: true,
            });
            return 0;
          } else {
            scrollViewRef.current?.scrollTo({
              x: SCREEN_WIDTH * (nextIndex + 1),
              animated: true,
            });
            return nextIndex;
          }
        });
      }, 3000);
    }
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="start">
        {infiniteSlides.map((slide, index) => (
          <TouchableOpacity
            key={`${slide.id}-${index}`}
            onPress={() => handleSlidePress(slide)}
            activeOpacity={0.9}>
            <Image
              source={{ uri: slide.cover }}
              style={styles.slideImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  slideImage: {
    width: SCREEN_WIDTH,
    height: 200,
    backgroundColor: '#E0E0E0',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
    width: 24,
  },
});

export default TopBanner;

