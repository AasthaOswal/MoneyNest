import mongoose from "mongoose";


export const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    familyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family"
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


    // Array of fcmTokens because:
    // 1 user → multiple devices → multiple tokens
    fcmTokens: [
        {
            token: { type: String },
            device: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ]

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
