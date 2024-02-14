// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCW8-021qr2KZk0f2vn4T8XSohF90tLJ8Y",
    authDomain: "react-notes-dae70.firebaseapp.com",
    projectId: "react-notes-dae70",
    storageBucket: "react-notes-dae70.appspot.com",
    messagingSenderId: "28068559993",
    appId: "1:28068559993:web:0b2a277ec7c7938404a8a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");