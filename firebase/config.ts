import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAdn2WkPyh2u7IVuunS-yYCwWJUo4rKsw",
  authDomain: "edustream-10eed.firebaseapp.com",
  projectId: "edustream-10eed",
  storageBucket: "edustream-10eed.appspot.com",
  messagingSenderId: "40901839185",
  appId: "1:40901839185:web:c7c2dc10c40c65ec31ab70",
  measurementId: "G-CV1LRM2TYW"
};

// Initialize Firebase App
// This pattern ensures that Firebase is initialized only once,
// preventing errors in environments with hot-reloading.
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();