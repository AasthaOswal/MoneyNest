import { getToken } from "firebase/messaging";
import { messaging } from "../src/services/firebase.service.js";

export const getFCMToken = async () => {
    try{
        const permission = await Notification.requestPermission();

        if (permission !== "granted") return null;

        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        console.log("TOKEN:", token);
        return token;
    }catch(err){
        console.log(err);
        return null;
    }
};