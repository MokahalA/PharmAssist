import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD8sIGZvZ3Gv9yy7FCm7DG6pDrTK9zwxDQ",
  authDomain: "pharm-assist-96bbc.firebaseapp.com",
  projectId: "pharm-assist-96bbc",
  storageBucket: "pharm-assist-96bbc.appspot.com",
  messagingSenderId: "659730175383",
  appId: "1:659730175383:web:32440650cef3957185a0d2",
  measurementId: "G-1L4WCKB78D"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();