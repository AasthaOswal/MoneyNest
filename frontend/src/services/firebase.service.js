import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "moneynest-7d03e.firebaseapp.com",
  projectId: "moneynest-7d03e",
  storageBucket: "moneynest-7d03e.firebasestorage.app",
  messagingSenderId: "240125729828",
  appId: "1:240125729828:web:9a42348ee125fb881f0cb1",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);