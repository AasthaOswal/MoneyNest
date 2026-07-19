// models/family.model.js

import mongoose from "mongoose";

const familySchema = new mongoose.Schema({

    familyName: {
        type: String,
        required: true,
    },
    familyAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    inviteToken: {
        type: String
    },
    inviteTokenExpires: {
        type: Date
    },

    status: {
        type: String,
        enum: ["active", "pendingDeletion", "deleted"],
        default: "active",
    },

    aiUsage:{
        requestsMade: {
            type:Number,
            default:0
        },
        lastResetDate: {
            type:Date
        }
    }


}, { timestamps: true });

const Family = mongoose.model("Family", familySchema);
export default Family;
