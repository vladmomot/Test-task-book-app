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
import DetailsCarousel from '../../components/DetailsCarousel';
import YouWillLikeSection from '../../components/YouWillLikeSection';

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
          <Text style={styles.backButtonText}>← Back</Text>
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
          <Text style={styles.title}>{currentBook.name}</Text>
          <Text style={styles.author}>{currentBook.author}</Text>
          <Text style={styles.summary}>{currentBook.summary}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{currentBook.views}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{currentBook.likes}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{currentBook.quotes}</Text>
              <Text style={styles.statLabel}>Quotes</Text>
            </View>
          </View>

          <YouWillLikeSection
            books={youWillLikeBooks}
            onBookPress={handleBookPress}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 16,
  },
  summary: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
});

export default DetailsScreen;

