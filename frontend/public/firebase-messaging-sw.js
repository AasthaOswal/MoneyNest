importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBT5GpZ5EhNU5f51KaQAYccePvrsIj7oVs",
  authDomain: "moneynest-7d03e.firebaseapp.com",
  projectId: "moneynest-7d03e",
  storageBucket: "moneynest-7d03e.firebasestorage.app",
  messagingSenderId: "240125729828",
  appId: "1:240125729828:web:9a42348ee125fb881f0cb1",
});

const messaging = firebase.messaging();