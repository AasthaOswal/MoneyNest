import Groq from "groq-sdk";
import { getPrompt } from "./prompt.service.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const generateAIFeature = async (
    reportData,
    feature,
) => {

    console.log(feature)

    const instructions = getPrompt(feature);

    const prompt = `
        ${instructions}

        Financial Report:

        ${JSON.stringify(reportData, null, 2)}
        `;

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.4,
        response_format: {
            type: "json_object",
        },
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    console.log(response);

    const result = JSON.parse(response.choices[0].message.content);

    return result;
};