import mongoose from "mongoose";
import dotenv from "dotenv";

import { buildMonthlyReportData } from "../services/ai-monthly-family-report/dataCollection.service.js";

dotenv.config({
    path: "../.env"
});

const FAMILY_ID = "69bf69622b2fc1b9d7922efc";

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const result = await buildMonthlyReportData({
            familyId: FAMILY_ID,

            // Report generated on June 1st => May report
            reportMonthDate: new Date("2026-06-01")
        });

        console.log(
            JSON.stringify(result, null, 2)
        );
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await mongoose.disconnect();
    }
}

test();