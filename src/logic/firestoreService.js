// import { Platform } from "react-native";
import firebase from "react-native-firebase";
import _ from "lodash";
import FirebaseConfig from "./firebaseInfo";

const AudioApp = firebase.initializeApp(FirebaseConfig);

class FirebaseService {
  constructor() {
  }

  init = async () => {
    if (!firebase.apps.length) {
        await AudioApp.onReady()
    }
    this.ref = firebase.firestore().collection('books');
  };

  getBookList = (limit, category = null) => {
     return new Promise((resolve, reject) => {
        let ref = this.ref
        if( category != null){
          ref = this.ref.where('category', 'array-contains', category)
        }
        ref
        // .where('category', 'array-contains', category)
        .orderBy("book_id")
        // .startAt("13c7764884b549029e517e14959f5569")
        .limit(limit)
        .get()
        .then(snapshot => {

          const data = snapshot.docs.map(document => document.data())
          console.log(data[data.length - 1].id)
          resolve(data)
        })
        .catch(err => {
          console.log('Error getting documents', err);
          reject(err)
        });
     }) 
  }
}

const firebaseService = new FirebaseService();
export default firebaseService;
