import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ImageBackground,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Book } from '../../../types';
import { images, colors, fonts } from '../../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LARGE_W = 200;
const LARGE_H = 250;
const SCALE = 0.8;
const ITEM_SIZE = LARGE_W;
const INITIAL_PADDING = (SCREEN_WIDTH - LARGE_W) / 2;

const CarouselCard = ({ book, index, scrollX }: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    const diff = scrollX.value - ITEM_SIZE * index;
    const distance = Math.abs(diff);
    const scale = interpolate(distance, [0, ITEM_SIZE], [1, SCALE], 'clamp');
    const opacity = interpolate(distance, [0, ITEM_SIZE * 0.8], [1, 0.7], 'clamp');

    return {
      transform: [
        { scaleX: scale },
        { scaleY: scale },
      ],
      opacity,
    };
  });

  return (
    <View style={styles.cardWrapper}>
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <Animated.Image
          source={{ uri: book.cover_url }}
          style={styles.carouselImage}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
};

const DetailsCarousel = ({ books, onBookChange, initialBookId }: any) => {
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const reorderedBooks = useMemo(() => {
    if (!initialBookId || books.length === 0) return books;

    const idx = books.findIndex((b: Book) => b.id === initialBookId);
    if (idx < 0) return books;

    return [...books.slice(idx), ...books.slice(0, idx)];
  }, [books, initialBookId]);

  useEffect(() => {
    if (reorderedBooks.length > 0) {
      setCurrentIndex(0);
      onBookChange(reorderedBooks[0]);
    }
  }, [reorderedBooks.length, initialBookId]);

  const updateCurrentIndex = useCallback(
    (offsetX: number) => {
      const newIndex = Math.round(offsetX / ITEM_SIZE);

      setCurrentIndex((prev) => {
        const safeIndex = Math.max(0, Math.min(newIndex, reorderedBooks.length - 1));
        if (safeIndex !== prev) {
          requestAnimationFrame(() => onBookChange(reorderedBooks[safeIndex]));
        }
        return safeIndex;
      });
    },
    [reorderedBooks, onBookChange]
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      runOnJS(updateCurrentIndex)(event.contentOffset.x);
    },
  });

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    if (offsetX < 0) {
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });
    }
  };

  if (reorderedBooks.length === 0) return null;
  
  const currentBook = reorderedBooks[currentIndex];

  return (
    <ImageBackground
      source={images.bgDetailItem}
      style={styles.headerBackground}
      resizeMode="cover"
    >
      <View style={styles.carouselContainer}>
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onScrollEndDrag={handleScroll}
          onMomentumScrollEnd={handleScroll}
          snapToInterval={ITEM_SIZE}
          decelerationRate="fast"
          contentContainerStyle={styles.scrollContent}
        >
          {reorderedBooks.map((book: Book, index: number) => (
            <CarouselCard
              key={book.id}
              book={book}
              index={index}
              scrollX={scrollX}
            />
          ))}
        </Animated.ScrollView>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.bookTitle}>{currentBook.name}</Text>
        <Text style={styles.bookAuthor}>{currentBook.author}</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    height: 480,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    width: '100%',
    height: LARGE_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingLeft: INITIAL_PADDING,
    paddingRight: INITIAL_PADDING,
    alignItems: 'center',
  },
  cardWrapper: {
    width: LARGE_W,
    height: LARGE_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: LARGE_W,
    height: LARGE_H,
    borderRadius: 16,
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: colors.imageBackground,
  },
  textContainer: {
    paddingTop: 16,
    alignItems: 'center',
  },
  bookTitle: {
    ...fonts.h1,
    color: colors.white,
    textAlign: 'center',
  },
  bookAuthor: {
    ...fonts.authorName,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default DetailsCarousel;