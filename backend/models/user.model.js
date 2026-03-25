import mongoose from "mongoose";


export const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family"
    },

    role: {
        type: String,
        enum: ["familyAdmin", "member", "admin"], //role=admin can see total number of trasnactions happening over system, tand other such parameters --but remaining data will be private
        default: "member"
    },

    authProvider: {
        type: String,
        enum: ["local", "google"],
        required: true
    },
    googleSub: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: false
    },
    refreshToken: [{
        type: String,
        required: false
    }],

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
