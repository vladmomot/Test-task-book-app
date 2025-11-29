import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../../theme';
import { RootStackParamList, TopBannerSlide } from '../../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
interface TopBannerProps {
  slides: TopBannerSlide[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDE_WIDTH = SCREEN_WIDTH - 32;
const AUTOSCROLL_DELAY = 3000;

const TopBanner: React.FC<TopBannerProps> = ({ slides }) => {
  const navigation = useNavigation<NavigationProp>();
  const scrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [index, setIndex] = useState(0);

  const hasSlides = slides.length > 0;
  const infiniteSlides = useMemo(() => {
    if (!hasSlides) return [];
    return [slides[slides.length - 1], ...slides, slides[0]];
  }, [slides, hasSlides]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAutoscroll = useCallback(() => {
    clearTimer();

    if (!hasSlides) return;

    timerRef.current = setInterval(() => {
      setIndex(prev => {
        const next = prev + 1;
        const reachedEnd = next >= slides.length;
        const scrollTo = reachedEnd
          ? SLIDE_WIDTH * (slides.length + 1)
          : SLIDE_WIDTH * (next + 1);
        scrollRef.current?.scrollTo({ x: scrollTo, animated: true });
        return reachedEnd ? 0 : next;
      });
    }, AUTOSCROLL_DELAY);
  }, [clearTimer, hasSlides, slides.length]);

  useEffect(() => {
    if (!hasSlides) return;

    const timeout = setTimeout(() => {
      scrollRef.current?.scrollTo({ x: SLIDE_WIDTH, animated: false });
    }, 100);

    startAutoscroll();

    return () => {
      clearTimeout(timeout);
      clearTimer();
    };
  }, [hasSlides, startAutoscroll, clearTimer]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const position = e.nativeEvent.contentOffset.x;
      const slide = Math.round(position / SLIDE_WIDTH);

      if (!hasSlides) return;

      if (slide === 0) {
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            x: SLIDE_WIDTH * slides.length,
            animated: false,
          });
        }, 20);
      }

      if (slide === infiniteSlides.length - 1) {
        setTimeout(() => {
          scrollRef.current?.scrollTo({ x: SLIDE_WIDTH, animated: false });
        }, 20);
      }
    },
    [hasSlides, infiniteSlides.length, slides.length],
  );

  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const position = e.nativeEvent.contentOffset.x;
      const slide = Math.round(position / SLIDE_WIDTH);

      if (slide > 0 && slide < infiniteSlides.length - 1) {
        setIndex(slide - 1);
      }
    },
    [infiniteSlides.length],
  );

  const handlePress = (bookId: number) => {
    navigation.navigate('BookDetails', { bookId: bookId });
  };

  const onDragStart = useCallback(() => clearTimer(), [clearTimer]);
  const onDragEnd = useCallback(() => startAutoscroll(), [startAutoscroll]);

  if (!hasSlides) return null;

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.content}
          snapToInterval={SLIDE_WIDTH}
          snapToAlignment="start"
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumEnd}
          onScrollBeginDrag={onDragStart}
          onScrollEndDrag={onDragEnd}
        >
          {infiniteSlides.map((slide, i) => (
            <TouchableOpacity
              key={`${slide.id}-${i}`}
              activeOpacity={0.9}
              onPress={() => handlePress(slide.book_id)}
            >
              <Image
                source={{ uri: slide.cover }}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.indicators}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  banner: {
    height: 160,
    borderRadius: 16,
    backgroundColor: colors.imageBackground,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: 0,
  },
  image: {
    width: SLIDE_WIDTH,
    height: 160,
  },
  indicators: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#C1C2CA',
  },
  dotActive: {
    backgroundColor: '#D0006E',
  },
});

export default TopBanner;
