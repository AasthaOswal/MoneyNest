import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || "Super Admin";

    if (!email || !password) {
      throw new Error("❌ ADMIN_EMAIL and ADMIN_PASSWORD required in .env");
    }

    // 🔒 Check if ANY admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists. Skipping creation.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      authProvider: ["local"],
      refreshToken: []
    });

    console.log("🎉 Admin created successfully:");
    console.log({
      id: admin._id,
      email: admin.email,
      role: admin.role
    });

    process.exit();

  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();