import { getApp } from '@react-native-firebase/app';
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
  setDefaults,
  setConfigSettings,
} from '@react-native-firebase/remote-config';
import { JsonData, CarouselData } from '../types';

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
      }
      ),
    });

    setConfigSettings(rc, {
      minimumFetchIntervalMillis: 0,
    });

    await fetchAndActivate(rc);
  } catch (e) {
    console.error('RC init error:', e);
  }
}

export async function updateData() {
  try {
    await fetchAndActivate(rc);
  } catch (e) {
    console.error('RC update error:', e);
  }
}


export function getJsonData(): JsonData {
  try {
    const value = getValue(rc, 'json_data').asString();
    return JSON.parse(value);
  } catch (e) {
    console.error('getJsonData error:', e);
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
    return JSON.parse(value);
  } catch (e) {
    console.error('getDetailsCarousel error:', e);
    return { books: [] };
  }
}
