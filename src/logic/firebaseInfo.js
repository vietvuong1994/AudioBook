import {
  FIRE_PROJECT,
  FIRE_DB_URL,
  FIRE_STORAGE_BUCKET,
  FIRE_MSG_SENDER,
  FIRE_IOS_API_KEY,
  FIRE_ANDROID_API_KEY,
  FIRE_IOS_CLIENT_ID,
  FIRE_IOS_APP_ID,
  FIRE_ANDROID_CLIENT_ID,
  FIRE_ANDROID_APP_ID,
} from './constants';
import {Platform} from 'react-native';

const FirebaseConfig = Platform.select({
  ios: {
    clientId: FIRE_IOS_CLIENT_ID,
    appId: FIRE_IOS_APP_ID,
    apiKey: FIRE_IOS_API_KEY,
    databaseURL: FIRE_DB_URL,
    storageBucket: FIRE_STORAGE_BUCKET,
    messagingSenderId: FIRE_MSG_SENDER,
    projectId: FIRE_PROJECT,
    // enable persistence by adding the below flag
    persistence: true,
  },
  android: {
    clientId: FIRE_ANDROID_CLIENT_ID,
    appId: FIRE_ANDROID_APP_ID,
    apiKey: FIRE_ANDROID_API_KEY,
    databaseURL: FIRE_DB_URL,
    storageBucket: FIRE_STORAGE_BUCKET,
    messagingSenderId: FIRE_MSG_SENDER,
    projectId: FIRE_PROJECT,
    // enable persistence by adding the below flag
    persistence: true,
  },
});

export default FirebaseConfig;
