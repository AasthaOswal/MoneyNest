import { useEffect, useState } from "react";
import DashboardService from "../../services/dashboard.service";
import {
  setupTransactionListeners,
  removeTransactionListeners,
} from "../../socket/socketTransaction";
import toast from "react-hot-toast";

// Assuming you have individual variations or the same reusable charts
import YearlyTrendChart from "../../components/familyDashboard/YearlyTrendChart"; 

const IndividualDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    from: "",
    to: "",
  });

  const fetchDashboard = async (customFilters = filters) => {
    try {
      setLoading(true);
      const res = await DashboardService.getIndividualDashbaord(customFilters);
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const handleTransactionChange = () => {
      toast.success(
        "Refetching individual dashboard as change is detected."
      );
      fetchDashboard();
    };

    setupTransactionListeners(handleTransactionChange);

    return () => {
      removeTransactionListeners(handleTransactionChange);
    };
  }, []);

  // Safe Fallbacks Matching API Contracts
  const summary = data?.summary || {};
  const totalTransactions = data?.totalTransactions || 0;
  const labelStats = data?.labelStats || [];
  const categoryStats = data?.categoryStats || [];

  return (
    <div className="p-6 bg-bg min-h-screen text-text">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        Individual Dashboard - My Overview
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
            setFilters({ from: "", to: "" });
            fetchDashboard({});
          }}
          className="border border-border px-4 py-2 rounded-xl hover:cursor-pointer bg-surface hover:bg-surface-2 transition-colors"
        >
          Reset
        </button>

        {loading && (
          <div className="text-center ml-4 text-muted self-center">Loading...</div>
        )}

        {!loading && !data && (
          <div className="text-center ml-4 text-error self-center">
            Error loading dashboard
          </div>
        )}
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card title="Income" value={summary.income} color="text-income" />
        <Card title="Expenses" value={summary.expense} color="text-expense" />
        <Card title="Investments" value={summary.investment} color="text-investment" />
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

      {/* TRENDS */}
      <YearlyTrendChart />

      <div className="grid grid-cols-1  gap-6 mt-6">
        {/* CATEGORY STATS */}
        <Section title="Category Breakdown">
          {categoryStats.length > 0 ? (
            <StatsList data={categoryStats} />
          ) : (
            <p className="text-sm text-muted py-2">No category history found.</p>
          )}
        </Section>

        {/* LABEL STATS */}
        <Section title="Label Breakdown">
          {labelStats.length > 0 ? (
            <StatsList data={labelStats} />
          ) : (
            <p className="text-sm text-muted py-2">No label metrics assigned.</p>
          )}
        </Section>
      </div>
    </div>
  );
};

export default IndividualDashboard;

/* ================= UTILITY COMPONENTS ================= */

const Card = ({ title, value, color }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-card hover:bg-card-hover transition-colors">
      <p className="text-sm text-muted">{title}</p>
      <h2 className={`text-xl font-bold ${color}`}>
        {title.toLowerCase() === "transactions"
          ? value ?? 0
          : `₹${(value ?? 0).toLocaleString("en-IN")}`}
      </h2>
    </div>
  );
};

const Section = ({ title, children }) => {
  return (
    <div className="mb-6 h-full">
      <h2 className="text-lg font-semibold mb-3 text-text">
        {title}
      </h2>
      <div className="bg-card border border-border rounded-xl p-4 shadow-card min-h-[150px]">
        {children}
      </div>
    </div>
  );
};

const StatsList = ({ data }) => {
  return (
    <div className="space-y-2 h-auto overflow-y-auto pr-1 style-scrollbar">
      {data.map((item, index) => (
        <div
          key={item.categoryId || item.labelId || index}
          className="flex justify-between items-center border-b border-divider pb-2 pt-1"
        >
          <span className="text-text-secondary text-sm">
            {item.name}
          </span>
          <span className="font-medium text-text">
            ₹{item.total.toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
};