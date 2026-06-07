import { useEffect, useState } from "react";
import DashboardService from "../../services/dashboard.service";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import toast from "react-hot-toast";

const TrendCard = ({ title, data, dataKey, color }) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-card">
      <h2 className="text-lg font-semibold text-text mb-4">
        {title}
      </h2>

      <ResponsiveContainer width="100%" height={300}  style={{ outline: "none" }}>
        <BarChart data={data}>
          <CartesianGrid
            stroke="var(--color-divider)"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="month"
            tick={{
              fill: "var(--color-text-secondary)",
              fontSize: 12,
            }}
            axisLine={{
              stroke: "var(--color-border)",
            }}
            tickLine={{
              stroke: "var(--color-border)",
            }}
          />

          <YAxis
            tick={{
              fill: "var(--color-text-secondary)",
              fontSize: 12,
            }}
            axisLine={{
              stroke: "var(--color-border)",
            }}
            tickLine={{
              stroke: "var(--color-border)",
            }}
          />

          <Tooltip
            cursor={false}
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              color: "var(--color-text)",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.25)",
            }}
            labelStyle={{
              color: "var(--color-text)",
            }}
            formatter={(value) => [
              `₹${Number(value).toLocaleString("en-IN")}`,
              title,
            ]}
          />

          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[8, 8, 0, 0]}
            activeBar={false}
            style={{ outline: "none" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const YearlyTrendChart = () => {
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState([]);

  const fetchTrends = async () => {
    try {
      setLoading(true);

      const res = await DashboardService.getYearlyTrends();

      setTrendData(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load yearly trends");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

if (loading) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 text-text-secondary">
      Loading yearly trends...
    </div>
  );
}

if (!trendData.length) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 text-text-secondary">
      No yearly trend data available.
    </div>
  );
}

  return (
  <div className="space-y-6">
    <TrendCard
      title="Income Trend (Last 12 Months)"
      data={trendData}
      dataKey="income"
      color="var(--chart-income)"
    />

    <TrendCard
      title="Expense Trend (Last 12 Months)"
      data={trendData}
      dataKey="expense"
      color="var(--chart-expense)"
    />

    <TrendCard
      title="Investment Trend (Last 12 Months)"
      data={trendData}
      dataKey="investment"
      color="var(--chart-investment)"
    />
  </div>
);
};

export default YearlyTrendChart;