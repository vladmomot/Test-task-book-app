import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Book } from '@/types';
import { colors, fonts } from '@/theme';

interface BookCardProps {
  book: Book;
  onPress: (bookId: number) => void;
  isTextBlack?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress, isTextBlack }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(book.id)} activeOpacity={0.9}>
      <Image source={{ uri: book.cover_url }} style={styles.cover} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={[styles.title, isTextBlack && { color: colors.text }]} numberOfLines={2}>
          {book.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
  },
  cover: {
    width: '100%',
    height: 150,
    borderRadius: 16,
    backgroundColor: colors.imageBackground,
  },
  info: {
    marginTop: 4,
  },
  title: {
    ...fonts.title,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default BookCard;
