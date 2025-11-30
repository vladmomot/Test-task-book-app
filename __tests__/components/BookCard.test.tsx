import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import BookCard from '../../src/components/books/BookCard';
import { Book } from '../../src/types';
import { Text, TouchableOpacity } from 'react-native';

const mockBook: Book = {
  id: 1,
  name: 'Test Book',
  author: 'Test Author',
  summary: 'Test summary',
  genre: 'Fiction',
  cover_url: 'https://example.com/cover.jpg',
  views: '1000',
  likes: '500',
  quotes: '50',
};

describe('BookCard', () => {
  const mockOnPress = jest.fn();
  let renderer: ReactTestRenderer.ReactTestRenderer | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (renderer) {
      act(() => {
        renderer!.unmount();
      });
      renderer = null;
    }
  });

  it('renders correctly with book data', () => {
    act(() => {
      renderer = ReactTestRenderer.create(<BookCard book={mockBook} onPress={mockOnPress} />);
    });

    expect(renderer).toBeTruthy();
    expect(renderer!.toJSON()).toBeTruthy();
  });

  it('calls onPress with book id when pressed', () => {
    act(() => {
      renderer = ReactTestRenderer.create(<BookCard book={mockBook} onPress={mockOnPress} />);
    });

    const instance = renderer!.root;
    const touchables = instance.findAllByType(TouchableOpacity);
    expect(touchables.length).toBeGreaterThan(0);

    const touchable = touchables[0];
    act(() => {
      touchable.props.onPress();
    });

    expect(mockOnPress).toHaveBeenCalledWith(1);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders with black text when isTextBlack is true', () => {
    act(() => {
      renderer = ReactTestRenderer.create(
        <BookCard book={mockBook} onPress={mockOnPress} isTextBlack={true} />,
      );
    });

    expect(renderer).toBeTruthy();
  });

  it('displays book name', () => {
    act(() => {
      renderer = ReactTestRenderer.create(<BookCard book={mockBook} onPress={mockOnPress} />);
    });

    const instance = renderer!.root;
    const texts = instance.findAllByType(Text);
    expect(texts.length).toBeGreaterThan(0);

    const text = texts.find(t => t.props.children === 'Test Book');
    expect(text).toBeTruthy();
    expect(text?.props.children).toBe('Test Book');
  });
});
