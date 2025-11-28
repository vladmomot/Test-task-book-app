import remoteConfig from '@react-native-firebase/remote-config';
import { JsonData, CarouselData } from '../types';

class RemoteConfigService {
  private static instance: RemoteConfigService;
  private config: ReturnType<typeof remoteConfig>;
  private isInitialized: boolean = false;

  private constructor() {
    this.config = remoteConfig();
  }

  public static getInstance(): RemoteConfigService {
    if (!RemoteConfigService.instance) {
      RemoteConfigService.instance = new RemoteConfigService();
    }
    return RemoteConfigService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await this.config.setDefaults({
        json_data: JSON.stringify({
          books: [],
          top_banner_slides: [],
          you_will_like_section: [],
        }),
        details_carousel: JSON.stringify([]),
      });

      await this.config.setConfigSettings({
        minimumFetchIntervalMillis: __DEV__ ? 0 : 3600000,
      });

      await this.config.fetchAndActivate();

      this.isInitialized = true;
    } catch (error: any) {
      console.error('Error initializing Remote Config:', error);
      this.isInitialized = true;
    }
  }

  getJsonData(): JsonData {
    try {
      const jsonDataString = this.config.getValue('json_data').asString();
      return JSON.parse(jsonDataString);
    } catch (error) {
      console.error('Error getting json_data:', error);
      return {
        books: [],
        top_banner_slides: [],
        you_will_like_section: [],
      };
    }
  }

  getDetailsCarousel(): CarouselData {
    try {
      const carouselString = this.config.getValue('details_carousel').asString();
      return JSON.parse(carouselString);
    } catch (error) {
      console.error('Error getting details_carousel:', error);
      return {
        books: [],
      };
    }
  }
}

export default RemoteConfigService.getInstance();
