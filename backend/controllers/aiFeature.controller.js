import Family from "../models/family.model.js";
import { buildMonthlyReportData } from "../services/ai-monthly-family-report/dataCollection.service.js";
import {generateAIFeature} from "../services/ai-features/orchestration/groq.service.js"


const DAILY_LIMIT = 6;

// utils/checkAndResetAIUsage.js


const resetAIUsage = async (family) => {


    if (!family) {
        throw new Error("Family not found.");
    }

    const today = new Date();

    // First ever AI request
    if (!family.aiUsage.lastResetDate) {
        family.aiUsage.requestsMade = 0;
        family.aiUsage.lastResetDate = today;

        await family.save();

        return family;
    }

    const lastResetDate = new Date(family.aiUsage.lastResetDate);

    // Compare only the date portion
    const todayOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const lastResetOnly = new Date(
        lastResetDate.getFullYear(),
        lastResetDate.getMonth(),
        lastResetDate.getDate()
    );

    // New day → reset credits
    if (todayOnly > lastResetOnly) {

        family.aiUsage.requestsMade = 0;
        family.aiUsage.lastResetDate = today;

        await family.save();
    }

    return family;
};

export const aiFeature = async (req, res) => {
    try {

        const familyId = req.user.familyId;

        const {feature} = req.params;

        const family = await Family.findById(familyId);

        if (!family) {
            return res.status(404).json({
                success: false,
                message: "Family not found."
            });
        }

        resetAIUsage(family);

    
        // ============================================
        // CHECK DAILY LIMIT
        // ============================================

        if (family.aiUsage.requestsMade >= DAILY_LIMIT) {
            return res.status(429).json({
                success: false,
                message: `Daily AI limit of ${DAILY_LIMIT} requests has been reached.`
            });
        }

        // ============================================
        // BUILD DATA
        // ============================================

        const today = new Date();

        const reportData = await buildMonthlyReportData({
            familyId,
            reportMonthDate: today
        });

        // ============================================
        // CALL LLM
        // ============================================

        console.log(feature)

        const aiResponse = await generateAIFeature(reportData,feature);

        // ============================================
        // INCREMENT ONLY AFTER SUCCESS
        // ============================================

        family.aiUsage.requestsMade += 1;

        await family.save();

        return res.status(200).json({
            success: true,
            data: aiResponse,
            remainingRequests:
                DAILY_LIMIT - family.aiUsage.requestsMade
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to generate AI insights."
        });
    }
};