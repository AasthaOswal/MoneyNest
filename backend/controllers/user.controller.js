//controllers/user.controler.js
import User from '../models/user.model.js'


const getSafeUser = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    familyId: user.familyId ? user.familyId._id : null,
  };
};



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

export const getMyProfile = async (req, res) => {
  try {

    // middleware adds user to req
    return res.status(200).json({
      success: true,
      user: getSafeUser(req.user),
    });

  } catch (err) {
    return res.status(500).json({ success: false });
  }
};