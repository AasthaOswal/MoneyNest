//controllers/user.controler.js
import User from '../models/user.model.js'

export const saveFcmToken = async (req, res) => {
    try {
        const { fcmToken, device } = req.body;

        if (!fcmToken) {
            return res.status(400).json({ message: "Token is required" });
        }

        const cleanToken = fcmToken.trim();

        await User.updateOne(
            { 
                _id: req.user._id,
                "fcmTokens.token": { $ne: cleanToken } // check inside array
            },
            {
                $push: {
                fcmTokens: {
                    token: cleanToken,
                    device: device || "unknown",
                    createdAt: new Date()
                }
                }
            }
        );

        return res.status(200).json({ message: "FCM token saved" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};