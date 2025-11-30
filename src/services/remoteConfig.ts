import { getApp } from '@react-native-firebase/app';
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
  setDefaults,
  setConfigSettings,
} from '@react-native-firebase/remote-config';
import { ZodError } from 'zod';
import { JsonData, CarouselData } from '@/types';
import { JsonDataSchema, CarouselDataSchema } from '@/validation/remoteConfigSchemas';

const app = getApp();
const rc = getRemoteConfig(app);

export async function initRemoteConfig() {
  try {
    setDefaults(rc, {
      json_data: JSON.stringify({
        books: [],
        top_banner_slides: [],
        you_will_like_section: [],
      }),
      details_carousel: JSON.stringify({
        books: [],
      }),
    });

    setConfigSettings(rc, {
      minimumFetchIntervalMillis: 0,
    });

    await fetchAndActivate(rc);
  } catch (e) {
    if (__DEV__) {
      console.error('RC init error:', e);
    }
  }
}

export async function updateData() {
  try {
    await fetchAndActivate(rc);
  } catch (e) {
    if (__DEV__) {
      console.error('RC update error:', e);
    }
  }
}

export function getJsonData(): JsonData {
  try {
    const value = getValue(rc, 'json_data').asString();
    const parsed = JSON.parse(value);
    const validated = JsonDataSchema.parse(parsed);
    return validated;
  } catch (e) {
    if (__DEV__) {
      if (e instanceof ZodError) {
        console.error('getJsonData validation error:', e.issues);
      } else if (e instanceof Error) {
        console.error('getJsonData error:', e.message);
      } else {
        console.error('getJsonData unknown error:', e);
      }
    }
    return {
      books: [],
      top_banner_slides: [],
      you_will_like_section: [],
    };
  }
}

export function getDetailsCarousel(): CarouselData {
  try {
    const value = getValue(rc, 'details_carousel').asString();
    const parsed = JSON.parse(value);
    const validated = CarouselDataSchema.parse(parsed);
    return validated;
  } catch (e) {
    if (__DEV__) {
      if (e instanceof ZodError) {
        console.error('getDetailsCarousel validation error:', e.issues);
      } else if (e instanceof Error) {
        console.error('getDetailsCarousel error:', e.message);
      } else {
        console.error('getDetailsCarousel unknown error:', e);
      }
    }
    return { books: [] };
  }
}
