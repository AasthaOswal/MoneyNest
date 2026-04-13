
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

		response.responses.forEach((res, idx) => {
			if (!res.success) {
				console.log(`❌ Token ${idx} failed`);
				console.log("Error:", res.error);
				console.log("Error Code:", res.error?.code);
				console.log("Error Message:", res.error?.message);
			} else {
				console.log(`✅ Token ${idx} success`);
				console.log("Message ID:", res.messageId);
			}
		});
    }catch(err){
      	console.log(err);
    }
};