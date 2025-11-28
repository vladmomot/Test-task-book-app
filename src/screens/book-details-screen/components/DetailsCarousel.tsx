import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ImageBackground,
} from 'react-native';
import { Book } from '../../../types';
import { images } from '../../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 200;
const CARD_GAP = 16;
const CARD_HEIGHT = 250;
const HEADER_HEIGHT = 420;

interface DetailsCarouselProps {
  books: Book[];
  onBookChange: (book: Book) => void;
  initialBookId?: number;
}

const DetailsCarousel: React.FC<DetailsCarouselProps> = ({
  books,
  onBookChange,
  initialBookId,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialBookId !== undefined) {
      const index = books.findIndex((b) => b.id === initialBookId);
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  const cardWidthWithGap = CARD_WIDTH + CARD_GAP;
  const paddingLeft = (SCREEN_WIDTH - CARD_WIDTH) / 2;

  React.useEffect(() => {
    if (initialBookId !== undefined && scrollViewRef.current && books.length > 0) {
      const index = books.findIndex((b) => b.id === initialBookId);
      if (index >= 0) {
        setTimeout(() => {
          const scrollX = index * cardWidthWithGap;
          scrollViewRef.current?.scrollTo({
            x: scrollX,
            animated: false,
          });
          setCurrentIndex(index);
          onBookChange(books[index]);
        }, 100);
      }
    }
  }, [initialBookId, books, onBookChange, cardWidthWithGap]);

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    // Учитываем padding при расчете индекса
    const adjustedOffset = offsetX;
    const index = Math.round(adjustedOffset / cardWidthWithGap);
    
    if (index >= 0 && index < books.length) {
      setCurrentIndex(index);
      onBookChange(books[index]);
    }
  };

  if (books.length === 0) {
    return null;
  }

  return (
    <ImageBackground
      source={images.bgDetailItem}
      style={styles.headerBackground}
      resizeMode="cover">
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={cardWidthWithGap}
          snapToAlignment="start"
          contentContainerStyle={styles.scrollContent}>
          {books.map((book) => (
            <View key={book.id} style={styles.cardContainer}>
              <Image
                source={{ uri: book.cover_url }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    height: HEADER_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    width: '100%',
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingLeft: (SCREEN_WIDTH - CARD_WIDTH) / 2,
    paddingRight: (SCREEN_WIDTH - CARD_WIDTH) / 2,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: CARD_GAP,
  },
  carouselImage: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
  },
});

export default DetailsCarousel;

