// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA83iKNd28AadG3oirmwDQakotLFIs5SrI",
    authDomain: "dine-time-53f02.firebaseapp.com",
    projectId: "dine-time-53f02",
    storageBucket: "dine-time-53f02.firebasestorage.app",
    messagingSenderId: "380051617483",
    appId: "1:380051617483:web:47dcafd2f50ad6814f4d4e",
    measurementId: "G-167FYXEN42"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);