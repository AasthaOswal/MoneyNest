import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export const generateFinancialInsights = async (reportData) => {

    const prompt = `
You are an expert financial analyst.

Analyze the family finance data and identify hidden insights, trends, anomalies and behavioral changes.

DO NOT summarize the dashboard.

ONLY provide insights that require comparison, reasoning, historical analysis or pattern detection.

Possible insight categories:

1. spending_spike
- Detect categories that increased significantly compared to previous months.

2. savings_trend
- Detect savings rate improvement or decline.

Savings Rate =
(Income - Expense - Investment) / Income

3. lifestyle_inflation
- Detect situations where income increased but expenses increased faster, reducing savings gains.

4. member_behavior
- Detect unusual spending contribution changes by family members.

5. category_dominance
- Detect categories consuming a disproportionately high share of total expenses.

6. expense_concentration
- Detect if a small number of transactions account for most spending.

7. transaction_driver
- Explain category increases using actual transactions.
- Highlight unusually large transactions when relevant.

Example:
"Groceries increased by 154%, largely driven by two transactions worth ₹1000 and ₹900."


8. hidden_pattern
- Only generate if supported by multiple months of evidence.
- Do not infer recurring behavior from repeated transaction amounts alone.


Return ONLY valid JSON.

Response Format:

{
  "reportSummary": {
    "overallFinancialHealth": "Good | Moderate | Poor",
    "summary": "short summary"
  },
  "insights": [
    {
      "type": "spending_spike",
      "title": "Dining Out Spending Increased",
      "severity": "low | medium | high",
      "insight": "Dining expenses increased by 71% compared to the previous 3-month average.",
      "supportingData": {
        "currentMonth": 12000,
        "previousAverage": 7000,
        "increasePercent": 71
      }
    }
  ]
}

Rules:

Return between 5 and 8 insights.

Prioritize meaningful insights first.

If fewer than 5 strong insights exist, additional insights may include:
- spending composition
- member contribution changes
- transaction concentration
- transaction drivers
- category concentration

Do not invent trends unsupported by the available data.

- Use actual numbers from the data.
- Quantify insights whenever possible.
- Explain why a change occurred when evidence exists.
- Use topTransactions to identify likely drivers of spending changes.
- Do not repeat the same finding across multiple insight types.
- Skip insight types that are not supported by the available data.
- Prioritize the most meaningful insights first.
- Output valid JSON only.
- No markdown.
- No explanations outside JSON.

Historical Data Rules:

- Base insights only on the available months of data.
- When fewer than 4 months of history exist, describe month-over-month changes rather than long-term trends.
- Do not claim long-term behavioral patterns without sufficient historical evidence.


Additional Rules
All values inside supportingData must be valid JSON values.

Never output calculations, formulas, expressions, arithmetic operations or text placeholders.

Compute all values before returning them.

Example:

Correct:
"increasePercent": 154

Incorrect:
"increasePercent": (3550 - 1399) / 1399 * 100

Financial Data:

${JSON.stringify(reportData, null, 2)}
`;
console.log(
    "Prompt Length:",
    prompt.length
);
const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
        {
            role: "user",
            content: prompt
        }
    ],
    temperature: 0.2,
    response_format: {
        type: "json_object"
    }
});

const text =
    completion.choices[0]?.message?.content || "";

console.log(
    "\n========== RAW GROQ RESPONSE =========="
);

console.log(text);

console.log(
    "\n======================================="
);

return JSON.parse(text);
    
};