export interface Book {
  id: number;
  name: string;
  author: string;
  summary: string;
  genre: string;
  cover_url: string;
  views: string;
  likes: string;
  quotes: string;
}

export interface TopBannerSlide {
  id: number;
  book_id: number;
  cover: string;
}

export interface JsonData {
  books: Book[];
  top_banner_slides: TopBannerSlide[];
  you_will_like_section: number[];
}

export interface CarouselData {
  books: Book[];
}
