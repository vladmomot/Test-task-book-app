import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ImageBackground,
  Text,
} from 'react-native';
import { Book } from '../../../types';
import { images, colors, fonts } from '../../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 200;
const CARD_WIDTH_SMALL = 160;
const CARD_GAP = 16;
const CARD_HEIGHT = 250;
const CARD_HEIGHT_SMALL = 200;
const HEADER_HEIGHT = 440;

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

  // Расчет позиций для каждой карточки
  const calculateScrollPosition = (targetIndex: number, selectedIndex: number = targetIndex): number => {
    let position = 0;
    
    for (let i = 0; i < targetIndex; i++) {
      const isSmall = i !== selectedIndex;
      const cardWidth = isSmall ? CARD_WIDTH_SMALL : CARD_WIDTH;
      position += cardWidth + CARD_GAP;
    }
    
    return position;
  };

  useEffect(() => {
    if (initialBookId !== undefined && scrollViewRef.current && books.length > 0) {
      const index = books.findIndex((b) => b.id === initialBookId);
      if (index >= 0) {
        setTimeout(() => {
          const scrollX = calculateScrollPosition(index, index);
          scrollViewRef.current?.scrollTo({
            x: scrollX,
            animated: false,
          });
          setCurrentIndex(index);
          onBookChange(books[index]);
        }, 100);
      }
    }
  }, [initialBookId, books, onBookChange]);

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    
    // Находим ближайшую карточку
    let closestIndex = 0;
    let minDistance = Infinity;
    
    for (let i = 0; i < books.length; i++) {
      const scrollPos = calculateScrollPosition(i, currentIndex);
      const distance = Math.abs(offsetX - scrollPos);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    if (closestIndex >= 0 && closestIndex < books.length && closestIndex !== currentIndex) {
      setCurrentIndex(closestIndex);
      onBookChange(books[closestIndex]);
      
      // Прокручиваем к правильной позиции с учетом нового выбранного индекса
      setTimeout(() => {
        const scrollX = calculateScrollPosition(closestIndex, closestIndex);
        scrollViewRef.current?.scrollTo({
          x: scrollX,
          animated: true,
        });
      }, 50);
    }
  };

  if (books.length === 0) {
    return null;
  }

  const currentBook = books[currentIndex];

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
          contentContainerStyle={styles.scrollContent}>
          {books.map((book, index) => {
            const isSelected = index === currentIndex;
            return (
              <View 
                key={book.id} 
                style={[
                  styles.cardContainer,
                  !isSelected && styles.cardContainerSmall
                ]}>
                <Image
                  source={{ uri: book.cover_url }}
                  style={[
                    styles.carouselImage,
                    !isSelected && styles.carouselImageSmall
                  ]}
                  resizeMode="cover"
                />
              </View>
            );
          })}
        </ScrollView>
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
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: CARD_GAP,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainerSmall: {
    width: CARD_WIDTH_SMALL,
    height: CARD_HEIGHT_SMALL,
  },
  carouselImage: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
  },
  carouselImageSmall: {
    width: CARD_WIDTH_SMALL,
    height: CARD_HEIGHT_SMALL,
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
    color: colors.white,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default DetailsCarousel;

