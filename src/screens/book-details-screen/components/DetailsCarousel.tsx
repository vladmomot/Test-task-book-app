import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Book } from '../../../types';
import { images, colors, fonts } from '../../../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 200;
const CARD_HEIGHT = 250;
const CARD_WIDTH_SMALL = 160;
const CARD_HEIGHT_SMALL = 200;
const CARD_GAP = 16;

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const isInitializedRef = useRef(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current && reorderedBooks.length > 0 && !isInitializedRef.current) {
      setTimeout(() => {
        // Начальная позиция - 0, выбранная книга (теперь первая в списке) по центру
        scrollViewRef.current?.scrollTo({
          x: 0,
          animated: false,
        });
        setCurrentIndex(0);
        onBookChange(reorderedBooks[0]);
        isInitializedRef.current = true;
      }, 100);
    }
  }, [initialBookId]);
  
  const reorderedBooks = React.useMemo(() => {
    if (initialBookId === undefined || books.length === 0) {
      return books;
    }
    
    const initialIndex = books.findIndex((b) => b.id === initialBookId);
    if (initialIndex < 0) {
      return books;
    }
    
    return [
      ...books.slice(initialIndex),
      ...books.slice(0, initialIndex)
    ];
  }, [books, initialBookId]);
  

  // Расчет позиций для каждой карточки
  const calculateScrollPosition = (targetIndex: number, selectedIndex: number = targetIndex): number => {
    const paddingLeft = (SCREEN_WIDTH - CARD_WIDTH) / 2;
    
    // Первая книга (индекс 0) всегда на позиции 0
    if (targetIndex === 0) {
      return 0;
    }
    
    // Рассчитываем позицию от первой книги
    let position = paddingLeft;
    for (let i = 1; i <= targetIndex; i++) {
      const prevIsSmall = i - 1 !== selectedIndex;
      const prevCardWidth = prevIsSmall ? CARD_WIDTH_SMALL : CARD_WIDTH;
      position += prevCardWidth + CARD_GAP;
    }
    
    return position - paddingLeft;
  };

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    
    // Ограничиваем скролл - нельзя скроллить влево от начальной позиции
    if (offsetX < 0) {
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });
      return;
    }
    
    // Находим ближайшую карточку на основе текущего индекса
    setCurrentIndex((prevIndex) => {
      let closestIndex = prevIndex;
      let minDistance = Infinity;
      
      for (let i = 0; i < reorderedBooks.length; i++) {
        const position = calculateScrollPosition(i, prevIndex);
        const distance = Math.abs(offsetX - position);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      
      // Обновляем книгу в родителе при изменении индекса с плавной анимацией
      if (closestIndex !== prevIndex && closestIndex >= 0 && closestIndex < reorderedBooks.length) {
        // Плавная анимация изменения размера карточек
        LayoutAnimation.configureNext({
          duration: 250,
          create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.scaleXY,
          },
          update: {
            type: LayoutAnimation.Types.easeInEaseOut,
          },
        });
        
        onBookChange(reorderedBooks[closestIndex]);
      }
      
      return closestIndex;
    });
  }, [reorderedBooks, onBookChange]);

  const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    
    // Ограничиваем скролл - нельзя скроллить влево от начальной позиции
    if (offsetX < 0) {
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
      return;
    }
    
    // Находим ближайшую карточку для snap
    setCurrentIndex((prevIndex) => {
      let closestIndex = prevIndex;
      let minDistance = Infinity;
      
      for (let i = 0; i < reorderedBooks.length; i++) {
        const position = calculateScrollPosition(i, prevIndex);
        const distance = Math.abs(offsetX - position);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      
      // Если нашли другую карточку, переключаемся
      if (closestIndex !== prevIndex && closestIndex >= 0 && closestIndex < reorderedBooks.length) {
        // Плавная анимация изменения размера карточек
        LayoutAnimation.configureNext({
          duration: 300,
          create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.scaleXY,
          },
          update: {
            type: LayoutAnimation.Types.easeInEaseOut,
          },
        });
        
        // Обновляем книгу в родителе
        onBookChange(reorderedBooks[closestIndex]);
        
        // Плавно прокручиваем к правильной позиции с учетом нового индекса
        const scrollX = calculateScrollPosition(closestIndex, closestIndex);
        scrollViewRef.current?.scrollTo({
          x: scrollX,
          animated: true,
        });
        
        return closestIndex;
      }
      
      // Если индекс не изменился, все равно выравниваем позицию для точности
      const scrollX = calculateScrollPosition(prevIndex, prevIndex);
      const currentOffset = offsetX;
      if (Math.abs(currentOffset - scrollX) > 1) {
        scrollViewRef.current?.scrollTo({
          x: scrollX,
          animated: true,
        });
      }
      
      return prevIndex;
    });
  }, [reorderedBooks, onBookChange]);

  if (reorderedBooks.length === 0) {
    return null;
  }

  const currentBook = reorderedBooks[currentIndex];

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
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          decelerationRate={0.95}
          contentContainerStyle={styles.scrollContent}>
          {reorderedBooks.map((book, index) => {
            const isSelected = index === currentIndex;
            return (
              <Animated.View 
                key={book.id} 
                style={[
                  styles.cardContainer,
                  {
                    width: isSelected ? CARD_WIDTH : CARD_WIDTH_SMALL,
                    height: isSelected ? CARD_HEIGHT : CARD_HEIGHT_SMALL,
                  }
                ]}>
                <Image
                  source={{ uri: book.cover_url }}
                  style={[
                    styles.carouselImage,
                    {
                      width: isSelected ? CARD_WIDTH : CARD_WIDTH_SMALL,
                      height: isSelected ? CARD_HEIGHT : CARD_HEIGHT_SMALL,
                    }
                  ]}
                  resizeMode="cover"
                />
              </Animated.View>
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
    height: 470,
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
    marginRight: CARD_GAP,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  carouselImage: {
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

