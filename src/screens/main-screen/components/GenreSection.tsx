import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Book } from '../../../types';
import BookCard from '../../../components/BookCard';
import { colors, fonts } from '../../../theme';

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
        contentContainerStyle={styles.scrollContent}
      >
        {books.map(book => (
          <BookCard key={book.id} book={book} onPress={onBookPress} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  genreTitle: {
    ...fonts.h1,
    color: colors.white,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
});

export default GenreSection;
