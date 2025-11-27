import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onPress: (bookId: number) => void;
  horizontal?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
  horizontal = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, horizontal && styles.horizontalContainer]}
      onPress={() => onPress(book.id)}
      activeOpacity={0.7}>
      <Image source={{ uri: book.cover_url }} style={styles.cover} />
      {!horizontal && (
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {book.name}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    marginBottom: 16,
    width: 120,
  },
  horizontalContainer: {
    width: 120,
  },
  cover: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    resizeMode: 'cover',
  },
  info: {
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  author: {
    fontSize: 12,
    color: '#666666',
  },
});

export default BookCard;

