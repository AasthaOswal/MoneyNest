import User from "../../models/user.model.js";
import { buildMonthlyReportData } from "./dataCollection.service.js";
import { generateFinancialInsights } from "./groqResponse.service.js";
import { generateMonthlyReportPdf } from "./pdf-generation/generator/generateMonthlyReportPdf.js";
import { sendEmailBrevo } from "../../utils/email/sendEmailBrevo.js";

import {mockAiData} from "./mocks/mockAiReport.js";


const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const generateMonthlyReportForFamily = async ({
    familyId,
    reportMonthDate,
    userIds = null
}) => {

    try {

        // throw new Error("Testing retry cron for ai monthly report email automation")

        const reportData =
            await buildMonthlyReportData({
                familyId,
                reportMonthDate
            });

        // const aiReport =
        //     await generateFinancialInsights(
        //         reportData
        //     );

        const pdfBuffer =
            await generateMonthlyReportPdf({
                reportData,
                aiReport:mockAiData
            });

        let members;

        if (userIds) {
            console.log( "in monthlyReportMain.service.js, userIds received: ",userIds, "\n");

            members = await User.find({

                _id: { $in: userIds },

                familyId,

                isActive: true

            });

        } else {

            members = await User.find({

                familyId,

                isActive: true

            });

        }

        const failedUsers = [];

        for (const member of members) {

            try {

                // if (member.email === "aasthaoswal29@gmail.com" || member.email === "besibay692@divahd.com") {
                //     throw new Error("Testing partial email failure");
                // }

                await sendEmailBrevo({

                    toEmail: member.email,

                    subject:
                        `AI Powered Monthly Financial Report - ${reportData.reportMonth}`,

                    htmlContent: `
                        <h2>Your Monthly Report</h2>
                        <p>Attached is your report.</p>
                    `,

                    attachments: [
                        {
                            name:
                                `Report-${reportData.reportMonth}.pdf`,

                            content:
                                pdfBuffer.toString("base64")
                        }
                    ]

                });

                console.log(`Email sent to ${member.email}`
            );
            } catch (error) {

                failedUsers.push({
                    userId: member._id,
                    email: member.email,
                    error
                });
            }



            await sleep(10000);

        }

        return {

            success: true,
            failedUsers

        };

    }
    catch (error) {

        return {

            success: false,

            error

        };

    }

};