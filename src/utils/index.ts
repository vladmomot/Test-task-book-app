import { Platform } from 'react-native';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import * as Keychain from 'react-native-keychain';

const saveKeychainData = async () => {
  const username = 'vlad';
  const password = 'poniesRgr8';

  await Keychain.setGenericPassword(username, password, {
    service: 'service_key',
  });

  try {
    const credentials = await Keychain.getGenericPassword({
      service: 'service_key',
    });
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' +
          credentials.username +
          ' with password: ' +
          credentials.password,
      );
    } else {
      console.log('No credentials stored');
    }
  } catch (error) {
    console.error('Failed to access Keychain', error);
  }

  await Keychain.resetGenericPassword({ service: 'service_key' });
};

const enableLocation = async () => {
  if (Platform.OS === 'android') {
    try {
      const enableResult = await promptForEnableLocationIfNeeded();
      console.log('enableResult', enableResult);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
};

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export { saveKeychainData, sleep, enableLocation };
