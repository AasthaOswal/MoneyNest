
import admin from "../../config/firebase.js";
import User from "../../models/user.model.js";

export const sendPushNotification = async (userId, title, body) => {
    try{
		console.log("Inside push notification function")
		const user = await User.findById(userId);

		const tokens = user.fcmTokens.map(t => t.token);

		if (!tokens.length) return;

		const message = {
			notification: { title, body },
			tokens,
		};

		const response = await admin.messaging().sendEachForMulticast(message);

		console.log("FCM Response:", response);
    }catch(err){
      	console.log(err);
    }
};