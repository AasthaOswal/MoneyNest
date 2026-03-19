import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family"
  },

  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member"
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
