import mongoose from "mongoose";
import dotenv from "dotenv";

import Goal from "../models/goal.model.js";
import calculateGoalProgress from "../services/goals/calculateGoalProgress.js";


dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const goal = await Goal.findById("6a4a63b060df4d4f21539ac3");

    if (!goal) {
      console.log("Goal not found");
      process.exit(0);
    }

    const result = await calculateGoalProgress(goal);

    console.log("\n========== GOAL ==========");
    console.log(goal);

    console.log("\n========== RESULT ==========");
    console.log(result);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();