// controllers/family.controller.js

import Family from "../models/family.model.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import { createFamilySchema, joinFamilySchema, editFamilySchema } from "../validators/family.validation.js";
import mongoose from "mongoose";
import { executeRetryable } from "../utils/retryable/executeRetryable.js";
import { createNotification } from "../utils/notification/createNotification.js";
import { sendEmailBrevoNoAttachments } from "../utils/email/sendEmailBrevo.js";

//later on add(not now):-
/* 
-> leave a family
-> edit family details(familyAdmin only)
-> delete family(familyAdmin only) --cascade delete as all transaction,categories,goals etc will hhavve to be deleted
-> and anything else which i have not yet thought of
*/
// controllers/family.controller.js

// joi validation yet to add to this

// =======================
// 🟢 CREATE FAMILY
// =======================
export const createFamily = async (req, res) => {
  try {
    const userId = req.user._id;
    

    const { value, error } = createFamilySchema.validate(req.body);

    if (error) {
    return res.status(400).json({
        success: false,
        message: error.details[0].message
    });
    }

    const { familyName } = value;

    // Check if user already in a family
    const user = await User.findById(userId);

    if (user.familyId) {
      return res.status(400).json({
        success: false,
        message: "You are already part of a family. Leave it before creating a new one."
      });
    }

    const family = await Family.create({
      familyName,
      familyAdmin: userId
    });

    await User.findByIdAndUpdate(userId, {
      familyId: family._id,
      role: "familyAdmin"
    });

    res.status(201).json({
      success : true,
      message: "Family created successfully",
      data : family
    });

  } catch (err) {
    res.status(500).json({
      message: "Error creating family"
    });
  }
};


// =======================
// 🔐 GENERATE INVITE LINK (SHA256)
// =======================
export const generateInvite = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "familyAdmin") {
      return res.status(403).json({
        message: "Only family admin can generate invite"
      });
    }

    // ✅ Generate raw token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // ✅ SHA256 hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expires = Date.now() + 15 * 60 * 1000; // 15 mins

    await Family.findByIdAndUpdate(user.familyId, {
      inviteToken: hashedToken,
      inviteTokenExpires: expires
    });

    const inviteLink = `${process.env.CLIENT_URL}/join-family?token=${rawToken}`;

    return res.status(200).json({ success : true, message: "Invite link generated. Please make sure the member has already signed up. Only then they can join your family. The link will expire in 15 minutes.", data : inviteLink, });

  } catch (err) {
    return res.status(500).json({ success:false, message: "Error generating invite link" });
  }
};


// =======================
// 🟡 JOIN FAMILY VIA TOKEN (NO LOOP 🔥)
// =======================
export const joinFamilyWithToken = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(req.query)

    const { value, error } = joinFamilySchema.validate(req.body);
    console.log(error)

    if (error) {
    return res.status(400).json({
        success: false,
        message: error.details[0].message
    });
    }

    const { token } = value;

    const user = await User.findById(userId);

    if (user.familyId) {
      return res.status(400).json({
        success : false,
        message: "Already part of a family..."
      });
    }

    // ✅ Hash incoming token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // ✅ Direct DB lookup (FAST 🔥)
    const family = await Family.findOne({
      inviteToken: hashedToken,
      inviteTokenExpires: { $gt: Date.now() }
    });

    if (!family) {
      return res.status(400).json({
        message: "Invalid or expired invite"
      });
    }

    // Join user
    await User.findByIdAndUpdate(userId, {
      familyId: family._id,
      role: "member"
    });

    // Invalidate token (one-time use)
    family.inviteToken = null;
    family.inviteTokenExpires = null;
    await family.save();

    return res.status(200).json({ success : true, message: "Joined family successfully", data : family});

  } catch (err) {
    console.warn(err);
    return res.status(500).json({ success : false, message: "Error joining family" });
  }
};



// =======================
// 🔵 GET MY FAMILY DETAILS WITH MEMBERS
// =======================
export const getMyFamily = async (req, res) => {
  try {
    // 1️⃣ Get user with family
    const user = await User.findById(req.user._id)
      .populate("familyId");

    if (!user.familyId) {
      return res.status(404).json({
        success: false,
        message: "User is not part of any family"
      });
    }

    // 2️⃣ Get all members of this family
    const members = await User.find({ familyId: user.familyId._id })
      .select("name email role"); // _id comes by default

    // 3️⃣ Return combined response
    return res.json({
      success: true,
      data: {
        familyId: user.familyId,
        members: members
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching family"
    });
  }
};


export const deleteFamily = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);

    if (admin.role !== "familyAdmin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete family"
      });
    }

    const familyId = admin.familyId;

    // Remove familyId from all users
    await User.updateMany(
      { familyId },
      { $set: { familyId: null, role: "member" } }
    );

    // Delete family
    await Family.findByIdAndDelete(familyId);

    res.json({
      success: true,
      message: "Family deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting family" });
  }
};

export const editFamily = async (req, res) => {
  try {
    const user = req.user;
    

    const { value, error } = editFamilySchema.validate(req.body);

    if (error) {
    return res.status(400).json({
        success: false,
        message: error.details[0].message
    });
    }

    const { familyName } = value;

    if (user.role !== "familyAdmin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can edit family"
      });
    }

    const family = await Family.findByIdAndUpdate(
      user.familyId,
      { familyName },
      { new: true }
    );

    res.json({
      success: true,
      message: "Family updated successfully",
      data: family
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating family" });
  }
};


// if a member leaves then send notification toall other members of the famiyl
export const leaveFamily = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user.familyId) {
      return res.status(400).json({
        success: false,
        message: "You are not part of any family"
      });
    }

    // Prevent admin from leaving 
    if (user.role === "familyAdmin") {
      return res.status(400).json({
        success: false,
        message: "Family admin cannot leave. Transfer admin or delete family."
      });
    }

    // Soft remove user from family
    user.familyId = null;
    user.role = "member";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Left family successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error leaving family"
    });
  }
};

// we should also send them notification that familyAdmin has removed  them - so aadd this notificaiton thingy
export const removeFamilyMember = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { memberId } = req.params;

    const admin = await User.findById(adminId);

    // Only family admin allowed
    if (admin.role !== "familyAdmin") {
      return res.status(403).json({
        success: false,
        message: "Only family admin can remove members"
      });
    }

    const member = await User.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Ensure same family (ownership check)
    if (!member.familyId || member.familyId.toString() !== admin.familyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "User does not belong to your family"
      });
    }

    // Prevent admin removing themselves
    if (member._id.toString() === adminId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot remove themselves"
      });
    }

    // Soft remove member
    member.familyId = null;
    member.role = "member";

    await member.save();

    return res.status(200).json({
      success: true,
      message: "Member removed successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error removing member"
    });
  }
};

export const transferFamilyAdmin = async (req, res) => {
  try {
    const currentAdminId = req.user._id;
    const { newAdminId } = req.params;

    // Validate ID
    if (!newAdminId || !mongoose.Types.ObjectId.isValid(newAdminId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const currentAdmin = await User.findById(currentAdminId);

    // Only current admin can transfer
    if (currentAdmin.role !== "familyAdmin") {
      return res.status(403).json({
        success: false,
        message: "Only current family admin can transfer admin role"
      });
    }

    const newAdmin = await User.findById(newAdminId);

    if (!newAdmin) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Same family check
    if ( !newAdmin.familyId || newAdmin.familyId.toString() !== currentAdmin.familyId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "User does not belong to your family"
      });
    }

    // Prevent transferring to inactive user
    if (!newAdmin.isActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot transfer admin role to inactive user"
      });
    }

    // Prevent self-transfer
    if (newAdminId.toString() === currentAdminId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You are already the admin"
      });
    }

    // TRANSACTION (important for consistency)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1️⃣ Update Family document
      await Family.findByIdAndUpdate(
        currentAdmin.familyId,
        { familyAdmin: newAdmin._id },
        { session }
      );

      // 2️⃣ Update roles
      await User.findByIdAndUpdate(
        currentAdminId,
        { role: "member" },
        { session }
      );

      await User.findByIdAndUpdate(
        newAdmin._id,
        { role: "familyAdmin" },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Admin role transferred successfully"
      });

    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

  } catch (err) {
    console.error("Error transferring admin:", err);
    return res.status(500).json({
      success: false,
      message: "Error transferring admin role"
    });
  }
};


export const getFamilyMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const currentUser = await User.findById(req.user._id);

    if (!currentUser.familyId) {
      return res.status(400).json({
        success: false,
        message: "You are not part of any family",
      });
    }

    const member = await User.findById(memberId)
      .select("name email role familyId");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Security check
    if (
      !member.familyId ||
      member.familyId.toString() !== currentUser.familyId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This member does not belong to your family",
      });
    }

    return res.status(200).json({
      success: true,
      data: member,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Error fetching member",
    });
  }
};


export const requestFamilyDeletion = async (req, res) => {

    try {

        if (req.user.role !== "familyAdmin") {
            return res.status(403).json({
                success: false,
                message: "Only family admin can request deletion."
            });
        }

        const family = await Family.findById(req.user.familyId);

        if (!family) {
            return res.status(404).json({
                success: false,
                message: "Family not found."
            });
        }

        if (family.status === "pendingDeletion") {
            return res.status(400).json({
                success: false,
                message: "Family deletion request already pending."
            });
        }

        if (family.status === "deleted") {
            return res.status(400).json({
                success: false,
                message: "Family has already been deleted."
            });
        }

        const admin = await User.findOne({role: "admin"});
        
        await executeRetryable({
            operationType: "db_notification",
            payload: {
                userId: admin._id,
                title: "Family Deletion Request",
                body: `User ${req.user._id} has requested family deletion for family: ${req.user.familyId}.`,
                type: "family_deletion",
                data: {
                    requestedUserId: req.user._id,
                    familyId: req.user.familyId
                },
            },

            operation: () =>
                createNotification({
                    userId: admin._id,
                    title: "Family Deletion Request",
                    body: `User ${req.user._id} has requested family deletion for family: ${req.user.familyId}.`,
                    type: "family_deletion",
                    data: {
                        requestedUserId: req.user._id,
                        familyId: req.user.familyId
                    },
                }),
        });


        await executeRetryable({
            operationType: "email",

            payload: {
                toEmail: admin.email,
                subject: "Family Deletion Request",
                htmlContent: `
                    <p>User ${req.user._id} has requested family deletion for family: ${req.user.familyId}.</p>
                `,
            },

            operation: () =>
                sendEmailBrevoNoAttachments({
                    toEmail: admin.email,
                    subject: "Family Deletion Request",
                    htmlContent: `
                        <p>User ${req.user._id} has requested family deletion for family: ${req.user.familyId}.</p>
                    `,
                }),
        });

        family.status = "pendingDeletion";

        family.inviteToken = null;
        family.inviteTokenExpires = null;

        await family.save();

        return res.status(200).json({
            success: true,
            message: "Family deletion request submitted."
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Failed to submit deletion request."
        });

    }

};

export const approveFamilyDeletion = async (req, res) => {

    try {

        const { familyId } = req.params;

        const family = await Family.findById(familyId);

        if (!family) {
            return res.status(404).json({
                success: false,
                message: "Family not found."
            });
        }

        if (family.status !== "pendingDeletion") {
            return res.status(400).json({
                success: false,
                message: "Family is not awaiting deletion."
            });
        }

        family.status = "deleted";

        family.inviteToken = null;
        family.inviteTokenExpires = null;

        await family.save();

        await User.updateMany(
            { familyId: family._id },
            {
                $set: {
                    familyId: null,
                    role: "member"
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Family deleted successfully."
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Failed to delete family."
        });

    }

};


export const getAllFamilies = async (req, res) => {
    try {

        const {
            page = 1,
            limit = 10,
            status,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        const query = {};

        if (status) {
            query.status = status;
        }

        if (search) {
            query.familyName = {
                $regex: search,
                $options: "i",
            };
        }

        const skip = (page - 1) * limit;

        const families = await Family.find(query)
            .populate(
                "familyAdmin",
                "name email"
            )
            .sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            })
            .skip(skip)
            .limit(Number(limit));

        const total = await Family.countDocuments(query);

        return res.status(200).json({
            success: true,
            families,
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
            message: "Failed to fetch families.",
        });

    }
};


export const getFamilyById = async (req, res) => {
    try {

        const family = await Family.findById(req.params.familyId)
            .populate(
                "familyAdmin",
                "name email role status"
            );

        if (!family) {
            return res.status(404).json({
                success: false,
                message: "Family not found.",
            });
        }

        const members = await User.find({
            familyId: family._id,
        }).select(
            "name email role status createdAt"
        );

        return res.status(200).json({
            success: true,
            family,
            members,
            totalMembers: members.length,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch family.",
        });

    }
};
