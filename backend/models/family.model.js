import mongoose from "mongoose";

const familySchema = new mongoose.Schema({
  name: String,
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true });

const Family = mongoose.model("Family", familySchema);
export default Family;
