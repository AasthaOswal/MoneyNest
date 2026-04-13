import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBT5GpZ5EhNU5f51KaQAYccePvrsIj7oVs",
  authDomain: "moneynest-7d03e.firebaseapp.com",
  projectId: "moneynest-7d03e",
  storageBucket: "moneynest-7d03e.firebasestorage.app",
  messagingSenderId: "240125729828",
  appId: "1:240125729828:web:9a42348ee125fb881f0cb1",
};

const app = initializeApp(firebaseConfig);

// 🔥 THIS is what "messaging" is
export const messaging = getMessaging(app);