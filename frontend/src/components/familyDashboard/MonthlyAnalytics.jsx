import { useEffect, useState } from "react";
import DashboardService from "../../services/dashboard.service";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import toast from "react-hot-toast";

const COLORS = {
  income: ["#22c55e", "#4ade80", "#86efac"],
  expense: ["#ef4444", "#f87171", "#fca5a5"],
  investment: ["#a855f7", "#c084fc", "#d8b4fe"],
};

const MonthlyAnalytics = () => {
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  const [data, setData] = useState(null);

  const fetchAnalytics = async (
    month = selectedMonth,
    year = selectedYear
  ) => {
    try {
      setLoading(true);

      const res =
        await DashboardService.getMonthlyAnalytics({
          month,
          year,
        });

      setData(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load monthly analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const summary = data?.summary || {};

  const categoryDistribution =
    data?.categoryDistribution || {
      income: [],
      expense: [],
      investment: [],
    };

  const userDistribution =
    data?.userDistribution || {
      income: [],
      expense: [],
      investment: [],
    };

    console.log("Monthly Analytics Data", data);
console.log("Category Distribution", categoryDistribution);

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">

      {/* HEADER */}

      <div className="flex flex-wrap gap-3 mb-6">

        <select
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(Number(e.target.value))
          }
          className="border border-border rounded px-3 py-2 bg-bg"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option
              key={i + 1}
              value={i + 1}
            >
              {new Date(2026, i).toLocaleString(
                "default",
                { month: "long" }
              )}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(Number(e.target.value))
          }
          className="border border-border rounded px-3 py-2 bg-bg"
        >
          {[2025, 2026, 2027].map((year) => (
            <option
              key={year}
              value={year}
            >
              {year}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            fetchAnalytics(
              selectedMonth,
              selectedYear
            )
          }
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Load Analytics
        </button>
      </div>

      {loading && (
        <p>Loading monthly analytics...</p>
      )}

      {!loading && (
        <>
          {/* SUMMARY */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

            <Card
              title="Income"
              value={summary.income}
              color="text-income"
            />

            <Card
              title="Expense"
              value={summary.expense}
              color="text-expense"
            />

            <Card
              title="Investment"
              value={summary.investment}
              color="text-investment"
            />

            <Card
              title="Savings"
              value={
                (summary.income || 0) -
                (summary.expense || 0) -
                (summary.investment || 0)
              }
              color="text-primary"
            />
          </div>

          {/* CATEGORY CHARTS */}

          <h3 className="font-semibold text-lg mb-4">
            Category Distribution
          </h3>

          <div className="grid lg:grid-cols-3 gap-6 mb-10">

            <PieBlock
              title="Income Categories"
              data={categoryDistribution.income}
              colors={COLORS.income}
            />

            <PieBlock
              title="Expense Categories"
              data={categoryDistribution.expense}
              colors={COLORS.expense}
            />

            <PieBlock
              title="Investment Categories"
              data={categoryDistribution.investment}
              colors={COLORS.investment}
            />

          </div>

          {/* USER DISTRIBUTION */}

          <h3 className="font-semibold text-lg mb-4">
            User Distribution
          </h3>

          <div className="space-y-8">

            <UserBarChart
              title="Income By User"
              data={userDistribution.income}
              color="#22c55e"
            />

            <UserBarChart
              title="Expense By User"
              data={userDistribution.expense}
              color="#ef4444"
            />

            <UserBarChart
              title="Investment By User"
              data={userDistribution.investment}
              color="#a855f7"
            />

          </div>
        </>
      )}
    </div>
  );
};

export default MonthlyAnalytics;

/* -------------------------------- */

const Card = ({ title, value, color }) => (
  <div className="bg-bg border border-border rounded-xl p-4">
    <p className="text-sm text-muted">
      {title}
    </p>

    <h2 className={`text-xl font-bold ${color}`}>
      ₹{value || 0}
    </h2>
  </div>
);

/* -------------------------------- */

const PieBlock = ({
  title,
  data=[],
  colors,
}) => (
  <div className="bg-bg border border-border rounded-xl p-4">

    <h4 className="font-medium mb-4">
      {title}
    </h4>

    <ResponsiveContainer
      width="100%"
      height={250}
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          outerRadius={80}
          label
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={
                colors[
                  index % colors.length
                ]
              }
            />
          ))}
        </Pie>

        <Tooltip />

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

/* -------------------------------- */

const UserBarChart = ({
  title,
  data=[],
  color,
}) => (
  <div className="bg-bg border border-border rounded-xl p-4">

    <h4 className="font-medium mb-4">
      {title}
    </h4>

    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="amount"
          fill={color}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);