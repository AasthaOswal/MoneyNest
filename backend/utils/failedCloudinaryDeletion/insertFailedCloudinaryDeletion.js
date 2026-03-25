import FailedCloudinaryDeletion from "../../models/failedCloudinaryDeletion.model.js";

export const insertFailedCloudinaryDeletion = async (files = []) => {
    try {

        if (!Array.isArray(files) || files.length === 0) return;

        // Filter valid entries
        const validFiles = files.filter(file =>
            file &&
            typeof file.publicId === "string" &&
            file.publicId.trim() !== "" 
        );

        if (validFiles.length === 0) return;

        // Insert all failures
        await FailedCloudinaryDeletion.insertMany(validFiles);

    } catch (err) {
        console.error("Failed to log Cloudinary deletion failure:", err);
    }
};
