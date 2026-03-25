import mongoose from "mongoose"; // Change require to import

const failedCloudinaryDeletionSchema = new mongoose.Schema({
    publicId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

// Change module.exports to export default
export default mongoose.model("FailedCloudinaryDeletion", failedCloudinaryDeletionSchema);