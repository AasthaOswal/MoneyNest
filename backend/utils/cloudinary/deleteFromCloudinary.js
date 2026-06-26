
import cloudinary from "../../config/cloudinary.js";
import { insertFailedCloudinaryDeletion } from "../failedCloudinaryDeletion/insertFailedCloudinaryDeletion.js";
import { createFailedOperation } from "../failedOperation/failedOperationCreator.js";


const isCronTesting = process.env.CRON_TESTING;
console.log("From delete cloudinary util: ",isCronTesting)
export const deleteFromCloudinary = async (publicId) => {

	if (!publicId || typeof publicId !== "string" || publicId.trim() === "") {
		return;
	}

	try {

		if(isCronTesting == "true"){
			throw new Error("Testing cron -On Purpose Error in cloudinary deletion");
		}

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

		throw err;

	}
};

