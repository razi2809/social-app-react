import React from "react";
import { initializeApp } from "firebase/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCWu39i99LppMLzKVHX_GGkt8vEASbHaXE",
  authDomain: "social-media-27267.firebaseapp.com",
  projectId: "social-media-27267",
  storageBucket: "social-media-27267.appspot.com",
  messagingSenderId: "940323635932",
  appId: "1:940323635932:web:795f0adbe7aab3b6c92a19",
  measurementId: "G-KW9X06J0CV",
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// const auth = getAuth(app);
const auth = firebase.auth();
const storage = firebase.storage();
const db = app.firestore();
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
const signInWithGoogle = () =>
  signInWithPopup(auth, provider)
    .then(async (res) => {
      await setDoc(doc(db, "users", res.user.uid), {
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        displayName: res.user.displayName,
        avatar: res.user.photoURL,
        uid: res.user.uid,
      });
      // await setDoc(doc(db, "chats", res.user.uid), {});
      await setDoc(doc(db, "userchats", res.user.uid), {});
      return res;
    })
    .catch((error) => {
      console.log(error);
    });
const LoginWithGoogle = () =>
  signInWithPopup(auth, provider)
    .then(async (res) => {
      return res;
    })
    .catch((error) => {
      console.log(error);
    });
export { storage, db, auth, signInWithGoogle, LoginWithGoogle };
// auth,
