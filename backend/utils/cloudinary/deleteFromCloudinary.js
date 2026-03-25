
import cloudinary from "../../config/cloudinary.js";
import { insertFailedCloudinaryDeletion } from "../failedCloudinaryDeletion/insertFailedCloudinaryDeletion.js";

export const deleteFromCloudinary = async (publicId) => {

	if (!publicId || typeof publicId !== "string" || publicId.trim() === "") {
		return;
	}

	try {

		const result = await cloudinary.uploader.destroy(publicId);

		if (result.result === "ok" || result.result === "not found") {
			console.log(`✅ Cloudinary deletion successful: ${publicId}`);
			return;
		}

		console.error(`⚠️ Cloudinary deletion issue for ${publicId}:`, result);

		await insertFailedCloudinaryDeletion([
			{
				publicId,
				reason: result.result || "Unknown error"
			}
		]);

	} catch (err) {

		console.error("❌ Cloudinary deletion error:", err);

		await insertFailedCloudinaryDeletion([
			{
				publicId,
				reason: err.message
			}
		]);
	}
};

