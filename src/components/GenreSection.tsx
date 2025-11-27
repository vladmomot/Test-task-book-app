import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Book } from '../types';
import BookCard from './BookCard';

interface GenreSectionProps {
  genre: string;
  books: Book[];
  onBookPress: (bookId: number) => void;
}

const GenreSection: React.FC<GenreSectionProps> = ({
  genre,
  books,
  onBookPress,
}) => {
  if (books.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.genreTitle}>{genre}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onPress={onBookPress}
            horizontal
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  genreTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});

export default GenreSection;

