//utils/createFcmToken
import toast from "react-hot-toast";
import { getToken } from "firebase/messaging";
import { messaging } from "../services/firebase.service.js";

export const getFCMToken = async () => {


    try {
        const permission = await Notification.requestPermission();


        console.log("Permission:", permission);

        if (Notification.permission === "denied") {
            toast("Notifications are blocked. Please enable them from browser settings in order to receive push notifications.");
            console.log("Notification from createFcmTOken.js  file");
            return null;
        }

        if (permission !== "granted") return null;

        const registration = await navigator.serviceWorker.ready;

        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration, // 🔥 THIS LINE IS IMPORTANT
        });

        console.log("TOKEN:", token);
        return token;
    } catch (err) {
        console.log(err);
        return null;
    }
};

