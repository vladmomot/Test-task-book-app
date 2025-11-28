import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Book } from '../../types';
import remoteConfigService from '../../services/remoteConfig';
import DetailsCarousel from './components/DetailsCarousel';
import YouWillLikeSection from './components/YouWillLikeSection';
import StatsContainer from './components/StatsContainer';
import PrimaryButton from '../../components/Button';
import BackButton from '../../components/BackButton';
import { colors, fonts } from '../../theme';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'BookDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DetailsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { bookId } = route.params;

  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [carouselBooks, setCarouselBooks] = useState<Book[]>([]);
  const [youWillLikeBooks, setYouWillLikeBooks] = useState<Book[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const jsonData = remoteConfigService.getJsonData();
      const allBooks = jsonData.books || [];
      
      const foundBook = allBooks.find((book: Book) => book.id === bookId);
      if (foundBook) {
        setCurrentBook(foundBook);
      }
      const carousel = remoteConfigService.getDetailsCarousel();
      setCarouselBooks(carousel.books.length > 0 ? carousel.books : []);

      const youWillLikeIds = jsonData.you_will_like_section || [];
      const youWillLike = youWillLikeIds
        .map((id: number) => allBooks.find((book: Book) => book.id === id))
        .filter((book: Book | undefined): book is Book => book !== undefined);
      setYouWillLikeBooks(youWillLike);
    } catch (error) {
      console.error('Error loading details data:', error);
    }
  };

  const handleCarouselBookChange = (book: Book) => {
    setCurrentBook(book);
  };

  const handleBookPress = (pressedBookId: number) => {
    navigation.replace('BookDetails', { bookId: pressedBookId });
  };

  if (!currentBook) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text>Book not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
     <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={[styles.header, { top: insets.top + 20 }]}>
        <BackButton />
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <DetailsCarousel
          books={carouselBooks}
          onBookChange={handleCarouselBookChange}
          initialBookId={bookId} 
        />
        <View style={styles.content}>
          <View style={styles.sumaryContent}>
            <StatsContainer 
              stats={[
                { value: currentBook.views, label: 'Readers' }, 
                { value: currentBook.likes, label: 'Likes' },
                { value: currentBook.quotes, label: 'Quotes' },
                { value: currentBook.genre, label: 'Genre' }, 
              ]}
            /> 
            <View style={[styles.divider, { marginTop: 10 }]} />
            <View>
              <Text style={styles.summaryTitle}>Summary</Text>
              <Text style={styles.summaryText}>{currentBook.summary}</Text>
            </View>
            <View style={styles.divider} />
          </View>
          <YouWillLikeSection
            books={youWillLikeBooks}
            onBookPress={handleBookPress}
          />
          <PrimaryButton text="Read Nows" style={styles.readButton} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1,
  },
  readButton: {
    marginTop: 24
  },
  scrollView: {
    flex: 1,
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 24,
    marginTop: -56,
  },
  sumaryContent: {
    paddingHorizontal: 16,
  },
  summaryTitle: {
    ...fonts.h1,
    color: colors.black,
    marginBottom: 8,
  },
  summaryText: {
    ...fonts.text,
    color: colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: colors.disabled,
    marginVertical: 16,
  },
});

export default DetailsScreen;

