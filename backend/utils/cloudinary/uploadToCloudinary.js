import fs from "fs/promises";
import cloudinary from "../../config/cloudinary.js";
import { fileTypeFromBuffer } from "file-type";
import path from "path";
import crypto from "crypto"

export const uploadToCloudinary = async (
    file,
    fileConfig,
    cloudinaryStorageId
) => {

    const {
        allowedTypes,
        maxSize,
        friendlyName,
        cloudinaryOptions = {},
    } = fileConfig;

    try {

        if (!file)
            throw new Error(`${friendlyName} is required`);

        if (!allowedTypes.includes(file.mimetype))
            throw new Error(
                `${friendlyName} must be one of: ${allowedTypes.join(", ")}`
            );

        if (file.size > maxSize)
            throw new Error(`${friendlyName} exceeds max size.`);

        const buffer = await fs.readFile(file.path);

        const type = await fileTypeFromBuffer(buffer);

        if (!type || !allowedTypes.includes(type.mime))
            throw new Error(`${friendlyName} file content is invalid`);

        const extension = path.extname(file.originalname);

        const baseName = path
            .basename(file.originalname, extension)
            .replace(/[^\w-]/g, "_");

        const randomPrefix = crypto.randomBytes(8).toString("hex");

        const publicId = `${randomPrefix}_${baseName}`;

        const result = await cloudinary.uploader.upload(file.path, {
            folder: `MoneyNest/${cloudinaryStorageId}`,
            public_id: publicId,
            overwrite: false,
            resource_type: "auto",
            access_mode: "public",
            ...cloudinaryOptions
        });

        return {
            url: result.secure_url,
            publicId: result.public_id
        };

    } finally {

        if (file) {
            await fs.unlink(file.path).catch((err) => {

                console.error("Failed deleting temp file:", err);

            });
        }

    }
};