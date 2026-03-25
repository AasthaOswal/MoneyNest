import express from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();



import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import familyRoutes from "./routes/family.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import labelRoutes from './routes/label.routes.js';
import transactionRoutes from './routes/transaction.routes.js';



const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // URL of your frontend
    credentials: true,
  })
);

// Middleware to parse incoming JSON payloads
app.use(express.json());
app.use(cookieParser());

// base route
app.use("/api/auth", authRoutes);
app.use("/api/family" , familyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/labels", labelRoutes);
app.use("/api/transactions", transactionRoutes);

// Basic test route
app.get("/", (req, res) => {
    res.send("WealthNest API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
