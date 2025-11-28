import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Book } from '../../types';
import remoteConfigService from '../../services/remoteConfig';
import DetailsCarousel from './components/DetailsCarousel';
import YouWillLikeSection from './components/YouWillLikeSection';
import StatsContainer from './components/StatsContainer';
import Button from '../../components/Button';
import { colors, fonts, icons } from '../../theme';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'BookDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DetailsScreen: React.FC = () => {
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
      
      // Находим текущую книгу
      const book = allBooks.find((b: Book) => b.id === bookId);
      if (book) {
        setCurrentBook(book);
      }

      // Загружаем книги для карусели
      const carousel = remoteConfigService.getDetailsCarousel();
      setCarouselBooks(carousel.length > 0 ? carousel : allBooks);

      // Загружаем книги для секции "You will also like"
      const youWillLikeIds = jsonData.you_will_like_section || [];
      const youWillLike = youWillLikeIds
        .map((id: number) => allBooks.find((b: Book) => b.id === id))
        .filter((b: Book | undefined): b is Book => b !== undefined);
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
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <icons.ArrowDownIcon color={colors.white} />
        </TouchableOpacity>
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
          <StatsContainer
            stats={[
              { value: currentBook.views, label: 'Readers' },
              { value: currentBook.likes, label: 'Likes' },
              { value: currentBook.quotes, label: 'Quotes' },
              { value: currentBook.genre, label: 'Genre' },
            ]}
          />

          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>{currentBook.summary}</Text>
          </View>

          <YouWillLikeSection
            books={youWillLikeBooks}
            onBookPress={handleBookPress}
          />

          <Button text="Read Now" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    paddingTop: 64,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    marginTop: -48,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryTitle: {
    ...fonts.h1,
    color: colors.black,
    marginBottom: 12,
  },
  summaryText: {
    ...fonts.text,
    color: colors.black,
  },
});

export default DetailsScreen;

