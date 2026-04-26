
import admin from "../../config/firebase.js";
import User from "../../models/user.model.js";
import { createFailedOperation } from "../../utils/failedOperation/failedOperationCreator.js";

export const sendPushNotification = async (userId, title, body) => {
    try{
		console.log("Inside push notification function")
		const user = await User.findById(userId);

		const tokens = user.fcmTokens.map(t => t.token);

		if (!tokens.length) return;

		const message = {
			notification: { title, body: body + " --- from backend" },
			tokens,
		};

// 		const message = {
//   data: {
//     title: String(title),
//     body: String(body + " --- from backend"),
//   },
//   webpush: {
//     fcmOptions: {
//       link: "https://project-money-nest.vercel.app/"
//     }
//   },
//   tokens,
// };

		const response = await admin.messaging().sendEachForMulticast(message);
		console.log(response);

		response.responses.forEach(async (res, idx) => {
			if (!res.success) {
				console.log(`❌ Token ${idx} failed`);
				console.log("Error:", res.error);
				console.log("Error Code:", res.error?.code);
				console.log("Error Message:", res.error?.message);
				const errorCode = res.error?.code;
				if (errorCode === 'messaging/registration-token-not-registered' || 
					errorCode === 'messaging/invalid-registration-token') {
					
					// Remove the invalid token from the user's document
					await User.updateOne(
						{ _id: userId },
						{ $pull: { fcmTokens: { token: tokens[idx] } } }
					);
					console.log(`🧹 Removed invalid token at index ${idx}`);
				}
			} else {
				console.log(`✅ Token ${idx} success`);
				console.log("Message ID:", res.messageId);
			}
		});

    }catch(err){
      	console.log(err);
		    await createFailedOperation({
        operationType: "push_notification",
        payload: {
            userId: userId,
            title,
            body,
        },
        error: err,
    });
    }
};