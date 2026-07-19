import mongoose from "mongoose";
import crypto from "crypto";


export const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    familyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family",
        default : null
    },

    role: {
        type: String,
        enum: ["familyAdmin", "member", "admin"], //role=admin can see total number of trasnactions happening over system, tand other such parameters --but remaining data will be private
        default: "member"
    },

    authProvider: {
        type: [String],
        enum: ["local", "google",], // we can add future methods here
        default: [],
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: false,
        default : null
    },
    refreshToken: [{
        type: String,
        required: false
    }],




    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },

    /*
        Future usecases
        User deletes account
        Admin bans user
        User temporarily disables account
        etc.
        for such use cases we haave isActive flag
        whether user is a  part of family  or not, that we are determining using familyId == null or not
    */
    isActive:{
        type:Boolean,
        default:true
    },

    status: {
        type: String,
        enum: ["active", "pendingDeletion", "deleted"],
        default: "active",
    },


    cloudinaryStorageId: {
        type: String,
        unique: true,
        immutable: true,
        default: () => crypto.randomUUID().replace(/-/g, ""),
    },


    tokenVersion: {
        type: Number,
        default: 0,
    },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;