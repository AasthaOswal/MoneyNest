import mongoose from "mongoose";


export const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family"
    },

    role: {
        type: String,
        enum: ["familyAdmin", "member", "admin"], //role=admin can see total number of trasnactions happening over system, tand other such parameters --but remaining data will be private
        default: "member"
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
