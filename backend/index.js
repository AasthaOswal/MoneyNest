import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
    res.send("WealthNest API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
