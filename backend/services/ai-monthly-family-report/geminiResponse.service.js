import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const generateFinancialInsights = async (reportData) => {

    const prompt = `
You are an expert financial analyst.

Analyze the family finance data and identify hidden insights, trends, anomalies and behavioral changes.

DO NOT summarize the dashboard.

ONLY provide insights that require comparison, reasoning, historical analysis or pattern detection.


Possible insight categories:

1. spending_spike

* Detect categories whose spending increased significantly compared to previous months.
* Compare current month against previous 2-3 month average.
* Explain possible drivers using topTransactions.

Example:
{
"type": "spending_spike",
"insight": "Dining expenses increased by 71% compared to the previous 3-month average."
}

2. savings_trend

* Calculate savings rate trend.

Savings Rate =
(Income - Expense - Investment) / Income

* Detect improvement or deterioration.

Example:
{
"type": "savings_trend",
"insight": "Savings rate declined from 27% to 18% this month."
}

3. lifestyle_inflation

* Detect cases where income increased but expenses increased proportionally or faster.
* Explain impact on savings.

Example:
{
"type": "lifestyle_inflation",
"insight": "Income increased by 15% but expenses increased by 19%, reducing potential savings gains."
}

4. member_behavior

* Detect unusual spending contribution changes by family members.
* Compare current share of expenses against historical average.

Example:
{
"type": "member_behavior",
"insight": "John accounted for 52% of all family expenses this month compared to his usual average of 30%."
}

5. member_shift

* Detect long-term shifts in spending responsibility between family members.
* Identify members whose expense share is steadily increasing or decreasing.

Example:
{
"type": "member_shift",
"insight": "Rahul's share of family expenses rose from 22% to 47% over the last two months."
}

6. category_dominance

* Detect categories occupying a large share of total household spending.

Example:
{
"type": "category_dominance",
"insight": "Groceries represented 62% of total household expenses this month."
}

7. category_risk

* Detect over-dependence on a single expense category.
* Highlight concentration risk.

Example:
{
"type": "category_risk",
"insight": "87% of total expenses came from a single category, creating a highly concentrated spending pattern."
}

8. expense_concentration

* Detect whether a small number of transactions contribute a large portion of expenses.

Example:
{
"type": "expense_concentration",
"insight": "The top five transactions accounted for 54% of total monthly spending."
}

9. top_transaction_impact

* Analyze impact of the largest transactions.
* Determine whether they materially affected monthly spending.

Example:
{
"type": "top_transaction_impact",
"insight": "The top three transactions accounted for 41% of total household spending this month."
}

10. transaction_driver

* Explain category increases using actual transactions.
* Mention specific transactions whenever possible.

Example:
{
"type": "transaction_driver",
"insight": "Groceries increased by 154%, largely driven by purchases worth ₹1,000 and ₹900."
}

11. large_transaction

* Identify unusually large transactions.
* Explain their impact on monthly spending.

12. expense_volatility

* Detect unstable month-to-month spending patterns.
* Highlight categories or overall expenses that fluctuate significantly.

Example:
{
"type": "expense_volatility",
"insight": "Household expenses fluctuate significantly month-to-month, indicating inconsistent spending patterns."
}

13. savings_dependency

* Detect situations where savings rely heavily on one unusually strong income month.
* Identify sustainability risks.

Example:
{
"type": "savings_dependency",
"insight": "Family savings are heavily dependent on one income month. Recent savings levels may not be sustainable."
}

14. hidden_pattern

* Detect any non-obvious behavioral, spending, savings or transaction trend.
* Prioritize insights that would not be visible from charts alone.


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

- Return between 5 and 15 insights.
- Prefer actionable insights.
- Use actual numbers from the data.
- Explain WHY something happened whenever possible.
- Use topTransactions to justify spending changes.
- Detect hidden trends not visible from a normal dashboard.
- Output valid JSON only.
- No markdown.
- No explanations outside JSON.

Additional Rules:

* Focus on hidden trends rather than summaries.
* Prefer insights requiring comparison across months.
* Prefer insights requiring reasoning across multiple datasets.
* Use categoryHistory for historical comparisons.
* Use memberHistory for behavior analysis.
* Use monthlyTotals for savings and income trends.
* Use currentMonthCategoryBreakdown for concentration analysis.
* Use topTransactions for root-cause explanations.
* Quantify every insight whenever possible.
* Explain WHY a change occurred whenever evidence exists.
* Avoid generic statements.
* Do not repeat the same finding in multiple insight types.
* If insufficient evidence exists for an insight type, skip it.
* Return the most meaningful insights first.


Financial Data:

${JSON.stringify(reportData, null, 2)}
`;
console.log(
    "Prompt Length:",
    prompt.length
);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    const text = response.text;

    console.log(
    "\n========== RAW GEMINI RESPONSE =========="
);

console.log(text);

console.log(
    "\n========================================="
);

    return JSON.parse(
        text.replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()
    );
};