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
import { TopBannerSlide } from '../../../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const slideWidth = SCREEN_WIDTH - 32;

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
    
    // Автоскролл каждые 3 секунды
  const startAutoScroll = () => {
    autoScrollTimer.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= slides.length) {
          scrollViewRef.current?.scrollTo({
            x: slideWidth * (slides.length + 1),
            animated: true,
          });
          return 0;
        } else {
          scrollViewRef.current?.scrollTo({
            x: slideWidth * (nextIndex + 1),
            animated: true,
          });
          return nextIndex;
        }
      });
    }, 3000);
  };

  useEffect(() => {
    if (slides.length === 0) return;
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: slideWidth,
        animated: false,
      });
    }, 100);

    startAutoScroll();

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [slides.length]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / slideWidth);

    // Обработка бесконечного скролла
    if (index === 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: slideWidth * slides.length,
          animated: false,
        });
      }, 50);
    } else if (index === infiniteSlides.length - 1) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: slideWidth,
          animated: false,
        });
      }, 50);
    }
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Обновляем индекс только после завершения скролла
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / slideWidth);
    
    if (index > 0 && index < infiniteSlides.length - 1) {
      setCurrentIndex(index - 1);
    }
  };

  const handleSlidePress = (slide: TopBannerSlide) => {
    navigation.navigate('BookDetails', { bookId: slide.book_id });
  };

  const handleScrollBeginDrag = () => {
    // Останавливаем автоскролл при ручном свайпе
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  };

  const handleScrollEndDrag = () => {
    startAutoScroll();
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={slideWidth}
          snapToAlignment="start"
          contentContainerStyle={styles.scrollContent}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  bannerContainer: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  slideImage: {
    width: slideWidth,
    height: 160,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  indicator: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#C1C2CA',
  },
  activeIndicator: {
    backgroundColor: '#D0006E',
  },
});

export default TopBanner;

