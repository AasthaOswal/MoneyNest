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
}, { timestamps: true });

const Family = mongoose.model("Family", familySchema);
export default Family;
