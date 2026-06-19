import cron from "node-cron"
import Family from "../../models/family.model.js";
import { buildMonthlyReportData } from "../ai-monthly-family-report/dataCollection.service.js";
// import { generateFinancialInsights } from "../ai-monthly-family-report/geminiResponse.service.js";

import { generateFinancialInsights } from "../ai-monthly-family-report/groqResponse.service.js";

// runs every minute - for testing
const GOAL_TRACKER_CRON = "* * * * *";


// 1st day of every month at 12:00 AM - 0 0 1 * *
// const GOAL_TRACKER_CRON = "0 0 1 * *"; 

const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const startAiMonthlyFinancialReportCron = () => {

    cron.schedule( GOAL_TRACKER_CRON, async () => {

        console.log(
            "\n========================================\nMonthly Financial Report Cron Started\n========================================\n"
        );

        try {

            const families = await Family.find({})
                .select("_id familyName")
                .lean();

            console.log(
                `Found ${families.length} families`
            );

            for (const family of families) {

                try {

                    console.log(
                        `\nGenerating report for: ${family.familyName}`
                    );

                    // Step 1
                    // Build financial dataset

                    const reportData =
                        await buildMonthlyReportData({
                            familyId: family._id
                        });

                    console.log(
                        "Financial data collected"
                    );

                    // Step 2
                    // Send to Gemini

                    const aiReport =
                        await generateFinancialInsights(
                            reportData
                        );

                    // Step 3
                    // For now just log response

                    console.log(
                        "\n---------- AI REPORT ----------"
                    );

                    console.log(
                        JSON.stringify(
                            aiReport,
                            null,
                            2
                        )
                    );

                    console.log(
                        "-------- END AI REPORT --------\n"
                    );

                     await sleep(10000); // 10 sec

                } catch (familyError) {

                    console.error(
                        `Failed report generation for family: ${family.familyName}`
                    );

                    console.error(familyError);
                }
            }

            console.log(
                "\nMonthly Financial Report Cron Completed\n"
            );

        } catch (error) {

            console.error(
                "Monthly Financial Report Cron Failed"
            );

            console.error(error);
        }

    },
    {
        timezone: "Asia/Kolkata"
    }
    );

    console.log(
        "Monthly Financial Report Cron Registered"
    );


};
