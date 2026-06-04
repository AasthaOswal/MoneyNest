// middlewares/error.middleware.js

import multer from "multer";

export const globalErrorHandler = (err, req, res, next) => {
    console.error(err);

    // Multer errors
    if (err instanceof multer.MulterError) {
        switch (err.code) {
        case "LIMIT_FILE_SIZE":
            return res.status(400).json({
            success: false,
            message: "File size exceeds maximum allowed limit."
            });

        default:
            return res.status(400).json({
            success: false,
            message: err.message
            });
        }
    }

    // Custom errors
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};