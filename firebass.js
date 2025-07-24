// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwxfbsyAlLlqJlNrla--a5zPkvhZzqauY",
  authDomain: "logistics-73898.firebaseapp.com",
  projectId: "logistics-73898",
  storageBucket: "logistics-73898.firebasestorage.app",
  messagingSenderId: "460214783904",
  appId: "1:460214783904:web:549a6bb3c21875cfed1ec5",
  measurementId: "G-GK6RNQ109K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);