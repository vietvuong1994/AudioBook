// import { Platform } from "react-native";
// import firebase from "react-native-firebase";
// import _ from "lodash";
// import FirebaseConfig from "./firebaseInfo";

// const unitiveApp = firebase.initializeApp(
//   Platform.OS === "ios" ? iosConfig : androidConfig,
//   FIRE_PROJECT_CUSTOME_NAME
// );

// class ChatService {
//   constructor() {
//   }

//   init = async () => {
//     const app = await unitiveApp.onReady();
//     this.firebaseApp = firebase.app(FIRE_PROJECT_CUSTOME_NAME);
//     this.ref = this.firebaseApp.firestore().collection("UnitiveChat");
//   };

//   authenticate = token => {
//     return this.firebaseApp.auth().signInWithCustomToken(token);
//   };

//   createGroup = (channelId, { artistId, state }) => {
//     const groupRef = this.ref.doc(channelId);
//     return this.firebaseApp.firestore().runTransaction(function(transaction) {
//       return transaction.get(groupRef).then(function(doc) {
//         if (doc.exists) {
//           return Promise.reject("Group existed!");
//         }
//         transaction.set(groupRef, {
//           artistID: artistId,
//           state: state
//         });
//       });
//     });
//   };

//   joinGroup = (channelId, { avatar, uid, joinAt }) => {
//     const groupRef = this.ref.doc(channelId);
//     const membersCollection = groupRef.collection("members");
//     const newMember = membersCollection.doc(`${uid}`);
//     return newMember.set({ avatar: avatar, uid, joinAt });
//   };

//   leaveGroup = (channelId, { uid }) => {
//     const groupRef = this.ref.doc(channelId);
//     const membersCollection = groupRef.collection("members");
//     const leaveMember = membersCollection.doc(`${uid}`);
//     return leaveMember.delete();
//   };

//   sendMessage = (channelId, data) => {
//     const messageCollection = this.ref.doc(channelId).collection("chats");
//     const newMessage = messageCollection.doc();
//     return newMessage.set(data);
//   };

//   changeStateGroup = (channelId, isAllowFanJoin) => {
//     const groupRef = this.ref.doc(channelId);

//     return this.firebaseApp.firestore().runTransaction(function(transaction) {
//       return transaction.get(groupRef).then(function(doc) {
//         transaction.update(groupRef, {
//           state: isAllowFanJoin ? 1 : 0
//         });
//       });
//     });
//   };

//   onMessageDataUpdate = (channelId, callback) => {
//     this.unsubMessage = this.ref
//       .doc(channelId)
//       .collection("chats")
//       .orderBy("timestamp")
//       .onSnapshot(snapshot => {
//         snapshot.docChanges.forEach(function(change) {
//           if (change.type === "added") {
//             __DEV__ &&
//               console.log(
//                 "==> onMessageDataUpdate FIRE: New: ",
//                 change.doc.data()
//               );
//             callback({
//               ...change.doc.data(),
//               key: change.doc.id,
//               type: "added"
//             });
//           }
//           if (change.type === "removed") {
//             __DEV__ &&
//               console.log("==> onMessageDataRemove FIRE: ", change.doc.data());
//             callback({
//               ...change.doc.data(),
//               key: change.doc.id,
//               type: "removed"
//             });
//           }
//         });
//       });
//   };

//   onMemberDataUpdate = (channelId, onAdd, onDelete) => {
//     this.unsubMember = this.ref
//       .doc(channelId)
//       .collection("members")
//       .onSnapshot(snapshot => {
//         snapshot.docChanges.forEach(function(change) {
//           if (change.type === "added") {
//             __DEV__ &&
//               console.log(
//                 "==> onMemberDataUpdate FIRE: New: ",
//                 change.doc.data()
//               );
//             onAdd({ ...change.doc.data(), key: change.doc.id });
//           } else if (change.type === "removed") {
//             __DEV__ &&
//               console.log(
//                 "==> onMemberDataUpdate FIRE: delete: ",
//                 change.doc.data()
//               );
//             onDelete({ ...change.doc.data(), key: change.doc.id });
//           }
//         });
//       });
//   };

//   onGroupDataUpdate = (channelId, callback) => {
//     this.unsubGroup = this.ref.doc(channelId).onSnapshot(function(doc) {
//       __DEV__ && console.log("==> onGroupDataUpdate FIRE: ", doc.data());
//       callback({ ...doc.data(), key: doc.id });
//     });
//   };

//   clean() {
//     this.unsubGroup && this.unsubGroup();
//     this.unsubMessage && this.unsubMessage();
//     this.unsubMember && this.unsubMember();
//   }
// }

// const chatService = new ChatService();
// export default chatService;
