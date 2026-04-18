import { useEffect, useState } from "react";
import DashboardService from "../../services/dashboard.service";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";


const FamilyDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        from: "",
        to: ""
    });


    const fetchDashboard = async (customFilters = filters) => {
        try {
            setLoading(true);
            console.log(customFilters);
            const res = await DashboardService.getFamilyDashboard(customFilters);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    

    const summary = data?.summary || {};
    const labelStats = data?.labelStats || [];
    const contributions = data?.contributions || [];
    const totalTransactions = data?.totalTransactions || 0;
    const categoryStats = data?.categoryStats || {
        income: [],
        expense: [],
        investment: []
    };


    const contributionChartData = {
        income: contributions.map(user => ({
            name: user.name,
            amount: user.income,
            percent: Number(user.incomePercent)
        })),
        expense: contributions.map(user => ({
            name: user.name,
            amount: user.expense,
            percent: Number(user.expensePercent)
        })),
        investment: contributions.map(user => ({
            name: user.name,
            amount: user.investment,
            percent: Number(user.investmentPercent)
        }))
    };

    const COLORS = {
        income: ["#22c55e", "#4ade80", "#86efac", "#16a34a"],
        expense: ["#ef4444", "#f87171", "#fca5a5", "#dc2626"],
        investment: ["#a855f7", "#c084fc", "#d8b4fe", "#9333ea"]
    };

    return (
        <div className="p-6 bg-bg min-h-screen text-text">
            
            {/* 🔹 HEADER */}
            <h1 className="text-2xl font-bold mb-6">Family Dashboard</h1>


            {/* 🔹 FILTERS */}
            <div className="bg-surface border border-border rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-end flex-wrap">

                <div className="flex flex-col">
                    <label className="text-sm text-muted mb-1">From</label>
                    <input
                    type="date"
                    value={filters.from}
                    onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                    className="border border-border rounded px-3 py-2 bg-bg text-text"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-muted mb-1">To</label>
                    <input
                    type="date"
                    value={filters.to}
                    onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                    className="border border-border rounded px-3 py-2 bg-bg text-text"
                    />
                </div>

                <button
                type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        fetchDashboard(); 
                    }}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
                >
                    Apply Filters
                </button>

                <button
                type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        setFilters({ from: "", to: "" });
                        fetchDashboard({}); 
                    }}
                    className="border border-border px-4 py-2 rounded"
                >
                    Reset
                </button>
                {/* 🔹 LOADING + ERROR HANDLING */}
                {loading && (
                    <div className="text-center mb-4 text-muted">Loading...</div>
                )}

                {!loading && !data && (
                    <div className="text-center mb-4 text-expense">
                        Error loading dashboard
                    </div>
                )}

            </div>

            


            {/* 🔹 SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                
                <Card title="Income" value={summary.income} color="text-income" />
                <Card title="Expenses" value={summary.expense} color="text-expense" />
                <Card title="Investments" value={summary.investment} color="text-investment" />
                <Card title="Balance" value={summary.balance} color="text-primary" />
                <Card title="Total Gains" value={summary.totalGains} color="text-primary" />
                <Card title="Transactions" value={totalTransactions} color="text-muted" />

            </div>

            {/* 🔹 CATEGORY STATS */}
            <Section title="Category Breakdown">

                <div className="grid  gap-6">

                    {/* INCOME */}
                    <div>
                    <h3 className="text-income font-semibold mb-2">Income</h3>
                    <StatsList data={categoryStats.income} />
                    </div>

                    {/* EXPENSE */}
                    <div>
                    <h3 className="text-expense font-semibold mb-2">Expense</h3>
                    <StatsList data={categoryStats.expense} />
                    </div>

                    {/* INVESTMENT */}
                    <div>
                    <h3 className="text-investment font-semibold mb-2">Investment</h3>
                    <StatsList data={categoryStats.investment} />
                    </div>

                </div>
            
            </Section>




            {/* 🔹 LABEL STATS */}
            <Section title="Label Breakdown">
                <StatsList data={labelStats} />
            </Section>

            {/* 🔹 CONTRIBUTIONS */}
            <Section title="User Contributions">
                <div className="grid md:grid-cols-2 gap-4">
                {contributions.map((user) => (
                    <div
                    key={user.userId}
                    className="bg-surface border border-border rounded-xl p-4 shadow-sm"
                    >
                    <h3 className="font-semibold mb-2">{user.name}</h3>

                    <p className="text-income">Income: ₹{user.income} ({user.incomePercent}%)</p>
                    <p className="text-expense">Expense: ₹{user.expense} ({user.expensePercent}%)</p>
                    <p className="text-investment">
                        Investment: ₹{user.investment} ({user.investmentPercent}%)
                    </p>
                    </div>
                ))}
                </div>
            </Section>

            {/* Contribution charts */}
            <Section title="Contribution Charts">

                <div className="grid md:grid-cols-3 gap-6">

                    {/* Income */}
                    <div className="flex flex-col items-center">
                    <h3 className="font-semibold mb-2 text-income">
                        Income Distribution
                    </h3>

                    <PieChart width={250} height={250}>
                        <Pie
                        data={contributionChartData.income}
                        dataKey="amount"
                        nameKey="name"
                        outerRadius={90}
                        label
                        >
                        {contributionChartData.income.map((_, index) => (
                            <Cell
                            key={index}
                            fill={COLORS.income[index % COLORS.income.length]}
                            />
                        ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                    </div>

                    {/* Expense */}
                    <div className="flex flex-col items-center">
                    <h3 className="font-semibold mb-2 text-expense">
                        Expense Distribution
                    </h3>

                    <PieChart width={250} height={250}>
                        <Pie
                        data={contributionChartData.expense}
                        dataKey="amount"
                        nameKey="name"
                        outerRadius={90}
                        label
                        >
                        {contributionChartData.expense.map((_, index) => (
                            <Cell
                            key={index}
                            fill={COLORS.expense[index % COLORS.expense.length]}
                            />
                        ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                    </div>

                    {/* Investment */}
                    <div className="flex flex-col items-center">
                    <h3 className="font-semibold mb-2 text-investment">
                        Investment Distribution
                    </h3>

                    <PieChart width={250} height={250}>
                        <Pie
                        data={contributionChartData.investment}
                        dataKey="amount"
                        nameKey="name"
                        outerRadius={90}
                        label
                        >
                        {contributionChartData.investment.map((_, index) => (
                            <Cell
                            key={index}
                            fill={COLORS.investment[index % COLORS.investment.length]}
                            />
                        ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                    </div>

                </div>

                </Section>
        </div>
    );
};

export default FamilyDashboard;





/* ================= COMPONENTS ================= */

const Card = ({ title, value, color }) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
      <p className="text-sm text-muted">{title}</p>
      <h2 className={`text-xl font-bold ${color}`}>₹{value}</h2>
    </div>
  );
};

const Section = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
        {children}
      </div>
    </div>
  );
};

const StatsList = ({ data }) => {
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex justify-between border-b border-border pb-1"
        >
          <span className="text-muted">{item.name}</span>
          <span className="font-medium">₹{item.total}</span>
        </div>
      ))}
    </div>
  );
};