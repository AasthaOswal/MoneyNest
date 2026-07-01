import cron from "node-cron"
import Family from "../../models/family.model.js";
import User from "../../models/user.model.js";
import { buildMonthlyReportData } from "../ai-monthly-family-report/dataCollection.service.js";
// import { generateFinancialInsights } from "../ai-monthly-family-report/geminiResponse.service.js";
import path from "path";
import { generateFinancialInsights } from "../ai-monthly-family-report/groqResponse.service.js";


import {generateMonthlyReportPdf} from "../ai-monthly-family-report/pdf-generation/generator/generateMonthlyReportPdf.js"

import {mockAiData} from "../ai-monthly-family-report/mocks/mockAiReport.js";

import {sendEmailBrevo} from "../../utils/email/sendEmailBrevo.js"

import {createFailedOperation} from "../../utils/failedOperation/failedOperationCreator.js"

import {generateMonthlyReportForFamily} from "../ai-monthly-family-report/monthlyReportMain.service.js"

// runs every 10 minutes - for deployed version testing
// const GOAL_TRACKER_CRON = "*/10 * * * *";

// runs every 3 minutes - for deployed version testing
const GOAL_TRACKER_CRON = "*/3 * * * *";

//runs every minute - localhost testing
// const GOAL_TRACKER_CRON = "* * * * *";


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

                console.log(
                    `Generating report for ${family.familyName}`
                );

                const reportMonthDate=new Date();

                const result = await generateMonthlyReportForFamily({ familyId: family._id, reportMonthDate });

                if (!result.success) {
                    
                    console.log("before  failed operation creation function is called")

                    await createFailedOperation({

                        operationType:"ai_monthly_report_email",

                        payload: {

                            familyId:family._id,
                            reportMonthDate,
                            userIds: null

                        },

                        error: result.error

                    });

                }

                if (result.success && result.failedUsers.length > 0) {

                    await createFailedOperation({

                        operationType: "ai_monthly_report_email",

                        payload: {

                            familyId: family._id,

                            reportMonthDate,

                            userIds: result.failedUsers.map(
                                user => user.userId
                            )

                        },

                        error: new Error("Some emails failed")

                    });

                }

                await sleep(10000);

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
