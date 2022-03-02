import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyCC7nYE592AUwqC7MOs8co65i64UyoyiYE",
    authDomain: "sistema-chamados-b32f2.firebaseapp.com",
    projectId: "sistema-chamados-b32f2",
    storageBucket: "sistema-chamados-b32f2.appspot.com",
    messagingSenderId: "866760653584",
    appId: "1:866760653584:web:e7f909bafd4a9ddc9c4395",
    measurementId: "G-QKN43ZJSCV"
  };

  if(!firebase.apps.length) {

      firebase.initializeApp(firebaseConfig);
  }

  export default firebase