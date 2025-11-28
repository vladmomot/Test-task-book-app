import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Book } from '../../types';
import remoteConfigService from '../../services/remoteConfig';
import TopBanner from './components/TopBanner';
import GenreSection from './components/GenreSection';
import { colors, fonts } from '../../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const MainScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [topBannerSlides, setTopBannerSlides] = useState<any[]>([]);
  const [booksByGenre, setBooksByGenre] = useState<Record<string, Book[]>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const jsonData = remoteConfigService.getJsonData();
      setTopBannerSlides(jsonData.top_banner_slides || []);

      // Группируем книги по жанрам
      const grouped: Record<string, Book[]> = {};
      (jsonData.books || []).forEach((book: Book) => {
        if (!grouped[book.genre]) {
          grouped[book.genre] = [];
        }
        grouped[book.genre].push(book);
      });
      setBooksByGenre(grouped);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleBookPress = (bookId: number) => {
    navigation.navigate('BookDetails', { bookId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Library</Text>
        </View>

        <TopBanner slides={topBannerSlides} />

        {Object.entries(booksByGenre).map(([genre, genreBooks]) => (
          <GenreSection
            key={genre}
            genre={genre}
            books={genreBooks}
            onBookPress={handleBookPress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingVertical: 28,
  },
  headerTitle: {
    ...fonts.h1,
    color: colors.primary,
  },
});

export default MainScreen;

