import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Book } from '../../../types';
import BookCard from '../../../components/BookCard';
import { fonts, colors } from '../../../theme';

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
    <View>
      <Text style={styles.sectionTitle}>You will also like</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onPress={onBookPress}
            isTextBlack
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    ...fonts.h1,
    color: colors.black,
    marginBottom: 16,
  },
  scrollContent: {
    gap: 8,
  },
});

export default YouWillLikeSection;

