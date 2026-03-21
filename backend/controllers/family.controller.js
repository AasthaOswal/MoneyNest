// controllers/family.controller.js

import Family from "../models/family.model.js";
import User from "../models/user.model.js";
import crypto from "crypto";


//later on add(not now):-
/* 
-> leave a family
-> edit family details(familyAdmin only)
-> delete family(familyAdmin only) --cascade delete as all transaction,categories,goals etc will hhavve to be deleted
-> and anything else which i have not yet thought of
*/
// controllers/family.controller.js



// =======================
// 🟢 CREATE FAMILY
// =======================
export const createFamily = async (req, res) => {
  try {
    const userId = req.user._id;
    const { familyName } = req.body;

    const family = await Family.create({
      familyName,
      familyAdmin: userId
    });

    await User.findByIdAndUpdate(userId, {
      family: family._id,
      role: "familyAdmin"
    });

    res.status(201).json({
      message: "Family created successfully",
      family
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

    await Family.findByIdAndUpdate(user.family, {
      inviteToken: hashedToken,
      inviteTokenExpires: expires
    });

    const inviteLink = `${process.env.CLIENT_URL}/join-family?token=${rawToken}`;

    return res.status(200).json({ success : true, message: "Invite link generated", data : inviteLink, });

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
    const { token } = req.body;

    const user = await User.findById(userId);

    if (user.family) {
      return res.status(400).json({
        success : true,
        message: "Already part of a family."
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

    // ✅ Join user
    await User.findByIdAndUpdate(userId, {
      family: family._id,
      role: "member"
    });

    // ✅ Invalidate token (one-time use)
    family.inviteToken = null;
    family.inviteTokenExpires = null;
    await family.save();

    return res.status(200).json({ success : true, message: "Joined family successfully", data : family._id});

  } catch (err) {
    return res.status(500).json({ success : false, message: "Error joining family" });
  }
};


// =======================
// 🔵 GET MY FAMILY DETAILS
// =======================
export const getMyFamily = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("family");

    return res.json({ success : true, data: user.family, });

  } catch (err) {
    return res.status(500).json({ success : false, message: "Error fetching family" });
  }
};