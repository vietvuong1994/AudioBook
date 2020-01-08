// import { Platform } from "react-native";
import firebase from 'react-native-firebase';
import _ from 'lodash';
import FirebaseConfig from './firebaseInfo';

const AudioApp = firebase.initializeApp(FirebaseConfig);

class FirebaseService {
  constructor() {}

  init = async () => {
    if (!firebase.apps.length) {
      await AudioApp.onReady();
    }
    this.ref = firebase.firestore().collection('test_data');
  };

  getBookList = ({limit, category, lastId}) => {
    // lastId = '05cc046d3e384350abab8b195cd00be7';
    // lastId = '3';
    limit = 4;
    category = 'Children';
    console.log('[FIR] GET BOOK QUERY: ', {limit}, {category}, {lastId});
    return new Promise((resolve, reject) => {
      let ref = this.ref;
      // if (category) {
      //   ref = this.ref.where('category', 'array-contains', category);
      // }
      ref = ref.orderBy('rate', 'desc');
      if (lastId) {
        ref = ref.startAfter(lastId);
      } else {
        // ref = ref.orderBy('book_id');
      }
      ref
        .limit(limit)
        .get()
        .then(snapshot => {
          const data = snapshot.docs.map(document => document.data());
          const lastDoc = snapshot.docs[snapshot.docs.length - 1];
          console.log('========================');
          console.log(snapshot.docs.length);
          console.log('========================');

          console.log('[FIR] GET BOOK RESULT: ', data);
          resolve({data, lastDoc});
        })
        .catch(err => {
          console.log('[FIR] GET BOOK ERROR: ', err);
          reject(err);
        });
    });
  };
}

const firebaseService = new FirebaseService();
export default firebaseService;
