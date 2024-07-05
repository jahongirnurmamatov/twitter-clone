// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIRABASE_API_KEY,
  authDomain: "x-clone-88c98.firebaseapp.com",
  projectId: "x-clone-88c98",
  storageBucket: "x-clone-88c98.appspot.com",
  messagingSenderId: "987542868544",
  appId: "1:987542868544:web:38dfc309b301fddc1fc5a5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);