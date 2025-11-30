import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import MainScreen from '../../src/screens/main-screen';
import { getJsonData, updateData } from '../../src/services/remoteConfig';
import { Book, TopBannerSlide } from '../../src/types';
import { Text } from 'react-native';

jest.mock('../../src/services/remoteConfig');
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

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
    genre: 'Non-Fiction',
    cover_url: 'https://example.com/cover2.jpg',
    views: '200',
    likes: '100',
    quotes: '20',
  },
];

const mockTopBannerSlides: TopBannerSlide[] = [
  {
    id: 1,
    book_id: 1,
    cover: 'https://example.com/banner1.jpg',
  },
];

describe('MainScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getJsonData as jest.Mock).mockReturnValue({
      books: mockBooks,
      top_banner_slides: mockTopBannerSlides,
      you_will_like_section: [],
    });
    (updateData as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders correctly', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer | null = null;
    await act(async () => {
      tree = ReactTestRenderer.create(<MainScreen />);
    });

    expect(tree).toBeTruthy();
    const instance = tree!.root;
    const texts = instance.findAllByType(Text);
    const libraryTitle = texts.some(t => t.props.children?.includes?.('Library'));
    expect(libraryTitle).toBeTruthy();
  });

  it('displays books grouped by genre', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer | null = null;
    await act(async () => {
      tree = ReactTestRenderer.create(<MainScreen />);
    });

    const instance = tree!.root;
    const texts = instance.findAllByType(Text);
    const fiction = texts.some(t => t.props.children?.includes?.('Fiction'));
    const nonFiction = texts.some(t => t.props.children?.includes?.('Non-Fiction'));
    const book1 = texts.some(t => t.props.children?.includes?.('Book 1'));
    const book2 = texts.some(t => t.props.children?.includes?.('Book 2'));

    expect(fiction).toBeTruthy();
    expect(nonFiction).toBeTruthy();
    expect(book1).toBeTruthy();
    expect(book2).toBeTruthy();
  });

  it('displays empty state when no books', async () => {
    (getJsonData as jest.Mock).mockReturnValue({
      books: [],
      top_banner_slides: [],
      you_will_like_section: [],
    });

    let tree: ReactTestRenderer.ReactTestRenderer | null = null;
    await act(async () => {
      tree = ReactTestRenderer.create(<MainScreen />);
    });

    const instance = tree!.root;
    const texts = instance.findAllByType(Text);
    const emptyText = texts.find(text => text.props.children === 'Books not found');
    expect(emptyText).toBeTruthy();
  });

  it('loads data on mount', async () => {
    await act(async () => {
      ReactTestRenderer.create(<MainScreen />);
    });

    await act(async () => {});

    expect(getJsonData).toHaveBeenCalled();
  });
});
