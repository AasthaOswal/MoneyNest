import mongoose from "mongoose";

const labelSchema = new mongoose.Schema({
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family",
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    isActive:{
        default:true,
        type:Boolean
    },


    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });


// Prevent duplicate labels in same family
labelSchema.index({ family: 1, name: 1, isActive: true }, { unique: true });

const Label = mongoose.model("Label", labelSchema);
export default Label;