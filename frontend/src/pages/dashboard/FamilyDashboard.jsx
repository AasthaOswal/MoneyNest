import { useEffect, useState } from "react";
import DashboardService from "../../services/dashboard.service";
import {
  setupTransactionListeners,
  removeTransactionListeners,
} from "../../socket/socketTransaction";
import toast from "react-hot-toast";

import YearlyTrendChart from "../../components/familyDashboard/YearlyTrendChart";
import ContributionChart from "../../components/familyDashboard/ContributionChart";

const FamilyDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    from: "",
    to: "",
  });

  const fetchDashboard = async (customFilters = filters) => {
    try {
      setLoading(true);

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

    const handleTransactionChange = () => {
      toast.success(
        "Refetching dashboard as change is detected in transactions."
      );

      fetchDashboard();
    };

    setupTransactionListeners(handleTransactionChange);

    return () => {
      removeTransactionListeners(handleTransactionChange);
    };
  }, []);

  const summary = data?.summary || {};

  const labelStats = data?.labelStats || [];

  const contributions = data?.contributions || [];

  const totalTransactions = data?.totalTransactions || 0;

  const categoryStats = data?.categoryStats || {
    income: [],
    expense: [],
    investment: [],
  };

  const contributionChartData = {
    income: contributions.map((user) => ({
      name: user.name,
      amount: user.income,
      percent: Number(user.incomePercent),
    })),

    expense: contributions.map((user) => ({
      name: user.name,
      amount: user.expense,
      percent: Number(user.expensePercent),
    })),

    investment: contributions.map((user) => ({
      name: user.name,
      amount: user.investment,
      percent: Number(user.investmentPercent),
    })),
  };

  // Allowed to remain hardcoded
  const COLORS = {
    income: ["#22c55e", "#4ade80", "#86efac", "#16a34a"],
    expense: ["#ef4444", "#f87171", "#fca5a5", "#dc2626"],
    investment: ["#a855f7", "#c084fc", "#d8b4fe", "#9333ea"],
  };

  return (
    <div className="p-6 bg-bg min-h-screen text-text">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        Family Dashboard - Overall Overview
      </h1>

      {/* FILTERS */}
      <div className="bg-card border border-border rounded-xl p-4 mb-6 shadow-card flex flex-col md:flex-row gap-4 items-end flex-wrap">
        <div className="flex flex-col">
          <label className="text-sm text-muted mb-1">From</label>

          <input
            type="date"
            value={filters.from}
            onChange={(e) =>
              setFilters({
                ...filters,
                from: e.target.value,
              })
            }
            className="border border-input-border rounded px-3 py-2 bg-input-bg text-text focus:outline-none focus:border-input-focus"
            style={{ colorScheme: "dark" }}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-muted mb-1">To</label>

          <input
            type="date"
            value={filters.to}
            onChange={(e) =>
              setFilters({
                ...filters,
                to: e.target.value,
              })
            }
            className="border border-input-border rounded px-3 py-2 bg-input-bg text-text focus:outline-none focus:border-input-focus"
            style={{ colorScheme: "dark" }}
          />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            fetchDashboard();
          }}
          className="bg-primary text-text-on-primary px-4 py-2 font-semibold rounded-xl hover:bg-primary-hover transition-colors hover:cursor-pointer"
        >
          Apply Filters
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setFilters({
              from: "",
              to: "",
            });

            fetchDashboard({});
          }}
          className="border border-border px-4 py-2 rounded-xl hover:cursor-pointer bg-surface hover:bg-surface-2 transition-colors"
        >
          Reset
        </button>

        {loading && (
          <div className="text-center mb-4 text-muted">Loading...</div>
        )}

        {!loading && !data && (
          <div className="text-center mb-4 text-error">
            Error loading dashboard
          </div>
        )}
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card title="Income" value={summary.income} color="text-income" />

        <Card title="Expenses" value={summary.expense} color="text-expense" />

        <Card
          title="Investments"
          value={summary.investment}
          color="text-investment"
        />

        <Card title="Net Savings" value={summary.netSavings} color="text-primary" />

        <Card
          title="Pre Investment Savings"
          value={summary.preInvestmentSavings}
          color="text-success"
        />

        <Card
          title="Transactions"
          value={totalTransactions}
          color="text-text-secondary"
        />
      </div>

      <ContributionChart
        contributionChartData={contributionChartData}
        COLORS={COLORS}
      />
      
      <YearlyTrendChart />

      {/* CATEGORY STATS */}
      <Section title="Category Breakdown">
        <div className="grid gap-6">
          <div>
            <h3 className="text-income font-semibold mb-2">Income</h3>
            <StatsList data={categoryStats.income} />
          </div>

          <div>
            <h3 className="text-expense font-semibold mb-2">Expense</h3>
            <StatsList data={categoryStats.expense} />
          </div>

          <div>
            <h3 className="text-investment font-semibold mb-2">
              Investment
            </h3>

            <StatsList data={categoryStats.investment} />
          </div>
        </div>
      </Section>

      {/* LABEL STATS */}
      <Section title="Label Breakdown">
        <StatsList data={labelStats} />
      </Section>

      {/* CONTRIBUTIONS */}
      <Section title="User Contributions">
        <div className="grid md:grid-cols-2 gap-4">
          {contributions.map((user) => (
            <div
              key={user.userId}
              className="bg-card border border-border rounded-xl p-4 shadow-card"
            >
              <h3 className="font-semibold mb-2 text-text">
                {user.name}
              </h3>

              <p className="text-income">
                Income: ₹{user.income} ({user.incomePercent}%)
              </p>

              <p className="text-expense">
                Expense: ₹{user.expense} ({user.expensePercent}%)
              </p>

              <p className="text-investment">
                Investment: ₹{user.investment} (
                {user.investmentPercent}%)
              </p>
            </div>
          ))}
        </div>
      </Section>

    </div>
  );
};

export default FamilyDashboard;

/* ================= COMPONENTS ================= */

const Card = ({ title, value, color }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-card hover:bg-card-hover transition-colors">
      <p className="text-sm text-muted">{title}</p>

      <h2 className={`text-xl font-bold ${color}`}>

        {title.toLowerCase() === "transactions"
            ? value ?? 0
            : `₹${value ?? 0}`
        }
      </h2>
    </div>
  );
};

const Section = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-text">
        {title}
      </h2>

      <div className="bg-card border border-border rounded-xl p-4 shadow-card">
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
          className="flex justify-between border-b border-divider pb-1"
        >
          <span className="text-text-secondary">
            {item.name}
          </span>

          <span className="font-medium text-text">
            ₹{item.total}
          </span>
        </div>
      ))}
    </div>
  );
};