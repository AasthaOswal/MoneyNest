// importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey: "AIzaSyBT5GpZ5EhNU5f51KaQAYccePvrsIj7oVs",
//   authDomain: "moneynest-7d03e.firebaseapp.com",
//   projectId: "moneynest-7d03e",
//   storageBucket: "moneynest-7d03e.firebasestorage.app",
//   messagingSenderId: "240125729828",
//   appId: "1:240125729828:web:9a42348ee125fb881f0cb1",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   console.log("Received background message ", payload);

//   const notificationTitle = payload.notification?.title || "New Notification";
//   const notificationOptions = {
//     body: payload.notification?.body || "",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-sw.js";

const firebaseConfig = {
  apiKey: "AIzaSyBT5GpZ5EhNU5f51KaQAYccePvrsIj7oVs",
  authDomain: "moneynest-7d03e.firebaseapp.com",
  projectId: "moneynest-7d03e",
  storageBucket: "moneynest-7d03e.firebasestorage.app",
  messagingSenderId: "240125729828",
  appId: "1:240125729828:web:9a42348ee125fb881f0cb1",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received:', payload);

  const notificationTitle = payload.data?.title || "Default Title";

  const notificationOptions = {
    body: payload.data?.body || "Default Body",
    icon: './favicon.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


// Handle background messages
// onBackgroundMessage(messaging, (payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: `${payload.notification.body} --- from sw.js`,
//     icon: './favicon.svg' 
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

