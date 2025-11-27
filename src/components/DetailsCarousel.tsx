import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Book } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

  React.useEffect(() => {
    if (initialBookId !== undefined && scrollViewRef.current) {
      const index = books.findIndex((b) => b.id === initialBookId);
      if (index >= 0) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: index * SCREEN_WIDTH,
            animated: false,
          });
          setCurrentIndex(index);
          onBookChange(books[index]);
        }, 100);
      }
    }
  }, [initialBookId, books, onBookChange]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    
    if (index !== currentIndex && index >= 0 && index < books.length) {
      setCurrentIndex(index);
      onBookChange(books[index]);
    }
  };

  if (books.length === 0) {
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
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="start">
        {books.map((book) => (
          <Image
            key={book.id}
            source={{ uri: book.cover_url }}
            style={styles.carouselImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: 300,
    backgroundColor: '#E0E0E0',
  },
});

export default DetailsCarousel;

