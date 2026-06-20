export const mockAiData = {
  "reportSummary": {
    "overallFinancialHealth": "Good",
    "summary": "The family's financial health is good, with a significant increase in income and savings."
  },
  "insights": [
    {
      "type": "spending_spike",
      "title": "Groceries Spending Increased",
      "severity": "high",
      "insight": "Groceries expenses increased by 154% compared to the previous month.",
      "supportingData": {
        "currentMonth": 3550,
        "previousMonth": 1399,
        "increasePercent": 154
      }
    },
    {
      "type": "transaction_driver",
      "title": "Groceries Increase Driven by Large Transactions",
      "severity": "medium",
      "insight": "The increase in Groceries spending is largely driven by transactions worth 1000, 900, and 500.",
      "supportingData": {
        "transaction1": 1000,
        "transaction2": 900,
        "transaction3": 500
      }
    },
    {
      "type": "category_dominance",
      "title": "Groceries Dominates Total Expenses",
      "severity": "high",
      "insight": "Groceries accounts for 87.65% of the total expenses for the current month.",
      "supportingData": {
        "category": "Groceries",
        "share": 87.65
      }
    },
    {
      "type": "member_behavior",
      "title": "Change in Member Contribution",
      "severity": "medium",
      "insight": "Aastha Oswal's share of family expenses decreased from 100% to 71.6%.",
      "supportingData": {
        "member": "Aastha Oswal",
        "previousShare": 100,
        "currentShare": 71.6
      }
    },
    {
      "type": "savings_trend",
      "title": "Savings Rate Improvement",
      "severity": "high",
      "insight": "The savings rate improved significantly due to the increase in income.",
      "supportingData": {
        "currentSavings": 46950,
        "previousSavings": 5951
      }
    },
    {
      "type": "expense_concentration",
      "title": "Concentration of Expenses in Groceries",
      "severity": "high",
      "insight": "A small number of transactions account for most of the Groceries spending.",
      "supportingData": {
        "category": "Groceries",
        "topTransactions": 3
      }
    },
    {
      "type": "lifestyle_inflation",
      "title": "No Lifestyle Inflation",
      "severity": "low",
      "insight": "The increase in income is not accompanied by a proportional increase in expenses.",
      "supportingData": {
        "incomeIncrease": 53000,
        "expenseIncrease": 4050
      }
    }
  ]
}