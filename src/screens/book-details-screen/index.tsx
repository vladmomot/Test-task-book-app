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
import { colors, fonts } from '../../theme';

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
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerContent}>
          <Text style={styles.bookTitle}>{currentBook.name}</Text>
          <Text style={styles.bookAuthor}>{currentBook.author}</Text>
        </View>
        <DetailsCarousel
          books={carouselBooks}
          onBookChange={handleCarouselBookChange}
          initialBookId={bookId}
        />

        <View style={styles.content}>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{currentBook.views}</Text>
              <Text style={styles.statLabel}>Readers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{currentBook.likes}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{currentBook.quotes}</Text>
              <Text style={styles.statLabel}>Quotes</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{currentBook.genre}</Text>
              <Text style={styles.statLabel}>Genre</Text>
            </View>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>{currentBook.summary}</Text>
          </View>

          <YouWillLikeSection
            books={youWillLikeBooks}
            onBookPress={handleBookPress}
          />

          <TouchableOpacity style={styles.readNowButton}>
            <Text style={styles.readNowButtonText}>Read Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    paddingVertical: 8,
    width: 40,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.white,
  },
  headerContent: {
    paddingTop: 60,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  bookTitle: {
    ...fonts.title,
    fontSize: 24,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  bookAuthor: {
    ...fonts.text,
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
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
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...fonts.statValue,
    color: colors.black,
    marginBottom: 4,
  },
  statLabel: {
    ...fonts.statLabel,
    color: colors.disabled,
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
  readNowButton: {
    width: 278,
    height: 48,
    borderRadius: 30,
    backgroundColor: colors.button,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
  },
  readNowButtonText: {
    ...fonts.button,
    color: colors.white,
  },
});

export default DetailsScreen;

