import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Book } from '../types';
import { colors, fonts } from '../theme';

interface BookCardProps {
  book: Book;
  onPress: (bookId: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(book.id)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: book.cover_url }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {book.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    width: 120,
  },
  cover: {
    width: '100%',
    height: 150,
    borderRadius: 16,
    backgroundColor: '#C4C4C4',
    resizeMode: 'cover',
  },
  info: {
    marginTop: 4,
  },
  title: {
    ...fonts.title,
    color: colors.white,
    opacity: 0.7,
  },
});

export default BookCard;

