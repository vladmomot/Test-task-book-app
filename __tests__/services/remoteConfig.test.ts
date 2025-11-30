jest.mock('@react-native-firebase/app', () => ({
  getApp: () => ({}),
}));

jest.mock('@react-native-firebase/remote-config', () => {
  const fetchAndActivate = jest.fn().mockResolvedValue(true);
  const setDefaults = jest.fn();
  const setConfigSettings = jest.fn();
  const getValue = jest.fn((key: string) => ({
    asString: () => {
      if (key === 'json_data') {
        return JSON.stringify({
          books: [],
          top_banner_slides: [],
          you_will_like_section: [],
        });
      }
      if (key === 'details_carousel') {
        return JSON.stringify({ books: [] });
      }
      return '{}';
    },
  }));

  return {
    getRemoteConfig: () => ({
      fetchAndActivate,
      setDefaults,
      setConfigSettings,
      getValue,
    }),

    fetchAndActivate,
    setDefaults,
    setConfigSettings,
    getValue,
  };
});

import {
  initRemoteConfig,
  updateData,
  getJsonData,
  getDetailsCarousel,
} from '../../src/services/remoteConfig';

import {
  fetchAndActivate,
  setDefaults,
  setConfigSettings,
  getValue,
} from '@react-native-firebase/remote-config';

describe('remoteConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initRemoteConfig', () => {
    it('initializes remote config with defaults', async () => {
      await initRemoteConfig();

      expect(setDefaults).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          json_data: expect.any(String),
          details_carousel: expect.any(String),
        }),
      );

      expect(setConfigSettings).toHaveBeenCalled();
      expect(fetchAndActivate).toHaveBeenCalled();
    });

    it('handles errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (fetchAndActivate as jest.Mock).mockRejectedValue(new Error('Test error'));

      await initRemoteConfig();

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('updateData', () => {
    it('fetches and activates remote config', async () => {
      await updateData();

      expect(fetchAndActivate).toHaveBeenCalled();
    });

    it('handles errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (fetchAndActivate as jest.Mock).mockRejectedValue(new Error('Test error'));

      await updateData();

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getJsonData', () => {
    it('returns parsed JSON data', () => {
      const mockData = {
        books: [
          {
            id: 1,
            name: 'Test Book',
            author: 'Test Author',
            summary: 'Test summary',
            genre: 'Fiction',
            cover_url: 'https://example.com/cover.jpg',
            views: '100',
            likes: '50',
            quotes: '10',
          },
        ],
        top_banner_slides: [],
        you_will_like_section: [],
      };

      (getValue as jest.Mock).mockReturnValue({
        asString: () => JSON.stringify(mockData),
      });

      expect(getJsonData()).toEqual(mockData);
    });

    it('returns fallback on parse error', () => {
      (getValue as jest.Mock).mockReturnValue({
        asString: () => {
          throw new Error('bad json');
        },
      });

      expect(getJsonData()).toEqual({
        books: [],
        top_banner_slides: [],
        you_will_like_section: [],
      });
    });

    it('returns fallback on validation error', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidData = {
        books: [{ id: 1 }], // Missing required fields
        top_banner_slides: [],
        you_will_like_section: [],
      };

      (getValue as jest.Mock).mockReturnValue({
        asString: () => JSON.stringify(invalidData),
      });

      const result = getJsonData();

      expect(result).toEqual({
        books: [],
        top_banner_slides: [],
        you_will_like_section: [],
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getDetailsCarousel', () => {
    it('returns correct data', () => {
      const mockData = {
        books: [
          {
            id: 1,
            name: 'Test Book',
            author: 'Test Author',
            summary: 'Test summary',
            genre: 'Fiction',
            cover_url: 'https://example.com/cover.jpg',
            views: '100',
            likes: '50',
            quotes: '10',
          },
        ],
      };

      (getValue as jest.Mock).mockReturnValue({
        asString: () => JSON.stringify(mockData),
      });

      expect(getDetailsCarousel()).toEqual(mockData);
    });

    it('returns fallback on error', () => {
      (getValue as jest.Mock).mockReturnValue({
        asString: () => {
          throw new Error('bad json');
        },
      });

      expect(getDetailsCarousel()).toEqual({ books: [] });
    });

    it('returns fallback on validation error', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidData = {
        books: [{ id: 1 }], // Missing required fields
      };

      (getValue as jest.Mock).mockReturnValue({
        asString: () => JSON.stringify(invalidData),
      });

      const result = getDetailsCarousel();

      expect(result).toEqual({ books: [] });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
