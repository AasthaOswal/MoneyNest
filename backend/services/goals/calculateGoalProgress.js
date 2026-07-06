import Transaction from "../../models/transaction.model.js";

const calculateGoalProgress = async (goal) => {
    const match = {
        date: {
        $gte: goal.startDate,
        $lte: goal.endDate,
        },
    };

    // Family goal
    if (goal.visibility === "family") {
        match.family = goal.family;
    }

    // Private goal
    else {
        match.user = goal.createdBy;
    }

    const totals = await Transaction.aggregate([
        {
        $match: match,
        },
        {
        $group: {
            _id: "$type",
            total: {
            $sum: "$amount",
            },
        },
        },
    ]);

    console.log("Match Query:", match);
    console.log("Aggregation Result:", totals);

    let income = 0;
    let expense = 0;
    let investment = 0;

    totals.forEach((item) => {
        if (item._id === "income") income = item.total;
        if (item._id === "expense") expense = item.total;
        if (item._id === "investment") investment = item.total;
    });

    let currentAmount = 0;

    switch (goal.type) {
        case "income":
        currentAmount = income;
        break;

        case "expense":
        currentAmount = expense;
        break;

        case "investment":
        currentAmount = investment;
        break;

        case "preInvestmentSavings":
        currentAmount = income - expense;
        break;

        case "netSavings":
        currentAmount = income - expense - investment;
        break;

        default:
        currentAmount = 0;
    }

    // Prevent negative values
    currentAmount = Math.max(0, currentAmount);

    const now = new Date();

    const hasStarted = now >= goal.startDate;
    const hasEnded = now > goal.endDate;
    const isWithinDateRange = hasStarted && !hasEnded;

    let progress = 0;
    let remainingAmount = 0;
    let exceededAmount = 0;

    let hasExceededLimit = false;

    let status = "active";

    if (goal.goalType === "target") {

        progress =
            goal.amount === 0
                ? 100
                : Math.min((currentAmount / goal.amount) * 100, 100);

        remainingAmount = Math.max(goal.amount - currentAmount, 0);

        // Status
        if (currentAmount >= goal.amount) {
            status = "completed";
        } else if (hasEnded) {
            status = "failed";
        } else {
            status = "active";
        }

    } else {

        // LIMIT GOAL

        progress =
            goal.amount === 0
                ? 100
                : (currentAmount / goal.amount) * 100;

        hasExceededLimit = currentAmount > goal.amount;

        exceededAmount = hasExceededLimit
            ? currentAmount - goal.amount
            : 0;

        remainingAmount = hasExceededLimit
            ? 0
            : goal.amount - currentAmount;

        // Status
        if (hasExceededLimit) {
            status = "failed";
        } else if (hasEnded) {
            status = "completed";
        } else {
            status = "active";
        }
    }


    return {
        currentAmount,
        targetAmount: goal.amount,

        progress: Number(progress.toFixed(2)),

        remainingAmount,
        exceededAmount,

        hasExceededLimit,

        status,

        hasStarted,
        hasEnded,
        isWithinDateRange,

        totals: {
            income,
            expense,
            investment,
        },
    };

};

export default calculateGoalProgress;