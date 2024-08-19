// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS7fnh0pLxrz8fQhwOyK1xnVvfdR9zX4s",
  authDomain: "flashcardsaas-5cda4.firebaseapp.com",
  projectId: "flashcardsaas-5cda4",
  storageBucket: "flashcardsaas-5cda4.appspot.com",
  messagingSenderId: "735641947290",
  appId: "1:735641947290:web:ced0a2eed6622c53bae323",
  measurementId: "G-CMY56X8TQ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}