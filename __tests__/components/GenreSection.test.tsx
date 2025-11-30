import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import GenreSection from '../../src/screens/main-screen/components/GenreSection';
import { Book } from '../../src/types';
import { ScrollView, Text } from 'react-native';

const mockBooks: Book[] = [
  {
    id: 1,
    name: 'Book 1',
    author: 'Author 1',
    summary: 'Summary 1',
    genre: 'Fiction',
    cover_url: 'https://example.com/cover1.jpg',
    views: '100',
    likes: '50',
    quotes: '10',
  },
  {
    id: 2,
    name: 'Book 2',
    author: 'Author 2',
    summary: 'Summary 2',
    genre: 'Fiction',
    cover_url: 'https://example.com/cover2.jpg',
    views: '200',
    likes: '100',
    quotes: '20',
  },
];

describe('GenreSection', () => {
  const mockOnBookPress = jest.fn();
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

  it('renders genre title', () => {
    act(() => {
      renderer = ReactTestRenderer.create(
        <GenreSection genre="Fiction" books={mockBooks} onBookPress={mockOnBookPress} />,
      );
    });

    const instance = renderer!.root;
    const texts = instance.findAllByType(Text);
    const genreTitle = texts.find(text => text.props.children === 'Fiction');
    expect(genreTitle).toBeTruthy();
  });

  it('renders all books in the genre', () => {
    act(() => {
      renderer = ReactTestRenderer.create(
        <GenreSection genre="Fiction" books={mockBooks} onBookPress={mockOnBookPress} />,
      );
    });

    const instance = renderer!.root;
    const texts = instance.findAllByType(Text);
    const book1 = texts.some(t => String(t.props.children).includes('Book 1'));
    const book2 = texts.some(t => String(t.props.children).includes('Book 2'));
    expect(book1).toBeTruthy();
    expect(book2).toBeTruthy();
  });

  it('returns null when books array is empty', () => {
    let tree: any = null;
    act(() => {
      renderer = ReactTestRenderer.create(
        <GenreSection genre="Fiction" books={[]} onBookPress={mockOnBookPress} />,
      );
      tree = renderer!.toJSON();
    });

    expect(tree).toBeNull();
  });

  it('renders correct number of books', () => {
    act(() => {
      renderer = ReactTestRenderer.create(
        <GenreSection genre="Fiction" books={mockBooks} onBookPress={mockOnBookPress} />,
      );
    });

    const instance = renderer!.root;

    const texts = instance.findAllByType(Text);
    const book1Text = texts.find(t => t.props.children === 'Book 1');
    const book2Text = texts.find(t => t.props.children === 'Book 2');
    expect(book1Text).toBeTruthy();
    expect(book2Text).toBeTruthy();

    const scrollView = instance.findByType(ScrollView);
    const bookTexts = scrollView.findAllByType(Text);

    expect(bookTexts.length).toBe(2);
    expect(scrollView.props.horizontal).toBe(true);
  });
});
