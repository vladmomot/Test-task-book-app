import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Book } from '../types';
import BookCard from './BookCard';

interface YouWillLikeSectionProps {
  books: Book[];
  onBookPress: (bookId: number) => void;
}

const YouWillLikeSection: React.FC<YouWillLikeSectionProps> = ({
  books,
  onBookPress,
}) => {
  if (books.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>You will also like</Text>
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
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
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

export default YouWillLikeSection;

