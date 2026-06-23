import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export const generateFinancialInsights = async (reportData) => {

    const prompt = `
You are an expert financial analyst.

Your goal is to uncover hidden patterns, anomalies, risks, behavioral changes and financial relationships that are not immediately visible from raw numbers.

DO NOT summarize the dashboard.

DO NOT simply restate metrics.

Prefer insights that require comparing multiple metrics, multiple members, or multiple months.

Avoid observations such as:

❌ Income was ₹53,000.
❌ Expenses were ₹4,050.
❌ Groceries was the largest category.

Instead generate insights such as:

✅ A single member generated 94% of household income, creating dependency risk.
✅ A member contributed only 5% of income but accounted for 28% of expenses.
✅ Household savings improved despite increased spending because income grew significantly faster.
✅ A member allocated more than 100% of income toward expenses and investments.

Focus on identifying meaningful relationships.

Possible Insight Categories

1. income_concentration

Detect situations where a single member contributes a disproportionately large share of household income.

Example:
"Aastha contributed 94.3% of household income, creating dependency on a single income source."

--------------------------------------------------

2. expense_burden

Compare income contribution versus expense contribution.

Detect members whose expense share is significantly higher than their income share.

Example:
"Testing1@ generated 5.7% of family income but accounted for 28.4% of family expenses."

--------------------------------------------------

3. negative_net_contributor

Detect members whose expenses and investments exceed earnings.

Example:
"Testing1@ allocated 105% of income toward expenses and investments, resulting in a ₹150 deficit."

--------------------------------------------------

4. investment_concentration

Detect when investment activity is concentrated among very few members.

Example:
"100% of family investments were funded by a single member."

--------------------------------------------------

5. savings_dependency

Identify which members generate household savings.

Example:
"Aastha generated ₹47,100 in net savings, accounting for nearly all family savings."

--------------------------------------------------

6. lifestyle_inflation

Compare income growth and expense growth.

Detect whether higher income improved savings or was consumed by spending growth.

Example:
"Income increased by 489% while expenses increased by 98%, allowing most additional income to convert into savings."

--------------------------------------------------

7. savings_trend

Analyze changes in family net savings rate across months.

Detect improvement or deterioration.

--------------------------------------------------

8. spending_spike

Detect categories with significant month-over-month increases.

Use categoryInsightsDataTop7Categories.

--------------------------------------------------

9. category_dominance

Detect categories consuming an unusually large share of expenses.

Example:
"Groceries accounted for 87.7% of all family expenses."

--------------------------------------------------

10. expense_concentration

Detect when a small number of categories dominate total spending.

Example:
"More than 90% of household expenses were concentrated in two categories."

--------------------------------------------------

11. new_spending_pattern

Detect categories that appeared for the first time.

Example:
"A new spending category appeared this month with ₹500 in expenses."

--------------------------------------------------

12. over_allocation

Use:

isOverAllocated
totalAllocationRate
deficitAmount

Detect members spending and investing beyond earnings.

--------------------------------------------------

13. financial_efficiency

Compare members using:

netSavingsRate
expenseToIncomeRatio
investmentRate

Identify strongest and weakest financial positions.

--------------------------------------------------

14. member_behavior_change

Use member growth metrics when available:

incomeGrowthPercent
expenseGrowthPercent
investmentGrowthPercent

Detect significant behavioral changes.

--------------------------------------------------

15. hidden_pattern

Generate only when supported by multiple months of evidence.

Requires comparison across months.

Do not infer recurring behavior from repeated transaction amounts alone.



Generate insights only if they reveal a meaningful relationship,
change, risk, anomaly, concentration or behavioral shift.

Do NOT generate an insight simply because a metric is large.

A metric must be compared against:
- another member
- another category
- a previous month
- a family-level metric

before becoming an insight.

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