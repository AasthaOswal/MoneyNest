//controllers/user.controler.js
import User from '../models/user.model.js'

import cloudinary from "../config/cloudinary.js"
import { executeRetryable } from '../utils/retryable/executeRetryable.js';
import { createNotification } from '../utils/notification/createNotification.js';
import { sendEmailBrevoNoAttachments } from '../utils/email/sendEmailBrevo.js';

const getSafeUser = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    familyId: user.familyId ? user.familyId._id : null,
  };
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



export const requestAccountDeletion = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.status === "pendingDeletion") {
            return res.status(400).json({
                success: false,
                message: "Your account deletion request is already pending."
            });
        }

        if (user.status === "deleted") {
            return res.status(400).json({
                success: false,
                message: "This account has already been deleted."
            });
        }

        user.status = "pendingDeletion";

        const admin = await User.findOne({role: "admin"});
        
        await executeRetryable({
            operationType: "db_notification",
            payload: {
                userId: admin._id,
                title: "Account Deletion Request",
                body: `${user.name} has requested account deletion.`,
                type: "account_deletion",
                data: {
                    requestedUserId: user._id,
                },
            },

            operation: () =>
                createNotification({
                    userId: admin._id,
                    title: "Account Deletion Request",
                    body: `${user.name} has requested account deletion.`,
                    type: "account_deletion",
                    data: {
                        requestedUserId: user._id,
                    },
                }),
        });


        await executeRetryable({
            operationType: "email",

            payload: {
                toEmail: admin.email,
                subject: "Account Deletion Request",
                htmlContent: `
                    <p>${user.name} has requested account deletion.</p>
                    <p>User Id is: ${user._id}</p>
                `,
            },

            operation: () =>
                sendEmailBrevoNoAttachments({
                    toEmail: admin.email,
                    subject: "Account Deletion Request",
                    htmlContent: `
                        <p>${user.name} has requested account deletion.</p>
                        <p>User Id is: ${user._id}</p>
                    `,
                }),
        });


        await user.save();

        return res.status(200).json({
            success: true,
            message: "Your account deletion request has been submitted for approval."
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Failed to submit deletion request."
        });
    }
};


export const approveUserDeletion = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.status !== "pendingDeletion") {
            return res.status(400).json({
                success: false,
                message: "User is not awaiting deletion."
            });
        }

        // const folderPath = `MoneyNest/${user.cloudinaryStorageId}`;

        // // Delete everything inside the folder
        // await cloudinary.api.delete_resources_by_prefix(folderPath);

        // // Delete the empty folder
        // await cloudinary.api.delete_folder(folderPath);

        const originalEmail = user.email;

        user.email = `deleted_${user._id}_${originalEmail}`;
        user.status = "deleted";
        user.familyId = null;
        user.role = "member";
        user.tokenVersion += 1;
        user.isActive = false;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User deleted successfully."
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Failed to delete user."
        });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            role,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        const query = {};

        if (status) {
            query.status = status;
        }

        if (role) {
            query.role = role;
        }

        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        const skip = (page - 1) * limit;

        const users = await User.find(query).select("-password")
            .populate("familyId", "familyName")
            .sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            })
            .skip(skip)
            .limit(Number(limit));

        const total = await User.countDocuments(query);

        return res.status(200).json({
            success: true,
            users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users.",
        });
    }
};


export const getUserById = async (req, res) => {
    try {

        const user = await User.findById(req.params.userId)
            .populate(
                "familyId",
                "familyName familyAdmin status createdAt"
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user.",
        });

    }
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

