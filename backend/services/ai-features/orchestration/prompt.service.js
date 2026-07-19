import { financialHealthPrompt } from "../prompts/financialHealth.prompt.js";
import { outlookPrompt } from "../prompts/outlook.prompt.js";
import { benchmarkPrompt } from "../prompts/benchmark.prompt.js";
import { recommendationsPrompt } from "../prompts/recommendation.prompt.js";

const promptMap = {
    financialHealth: financialHealthPrompt,
    benchmark: benchmarkPrompt,
    recommendation: recommendationsPrompt,

    outlook: outlookPrompt,
};

export const getPrompt = (feature) => {

    console.log(feature)
    const prompt = promptMap[feature];

    if (!prompt) {
        throw new Error(`Unsupported AI feature: ${feature}`);
    }

    return prompt();
};