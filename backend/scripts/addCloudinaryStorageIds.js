import mongoose from "mongoose";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const users = await User.find({
    cloudinaryStorageId: { $exists: false }
}).select("_id email");

console.log(`Found ${users.length} users.`);

await User.bulkWrite(
    users.map((user) => ({
        updateOne: {
            filter: { _id: user._id },
            update: {
                $set: {
                    cloudinaryStorageId: crypto.randomUUID().replace(/-/g, ""),
                    tokenVersion: 0,
                },
            },
        },
    })),
    {
        strict: false,
    }
);

console.log("Migration completed.");

await mongoose.disconnect();

process.exit();