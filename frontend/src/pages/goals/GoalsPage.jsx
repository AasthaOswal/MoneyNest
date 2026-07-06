import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  RotateCcw,
  TrendingUp,
  Trash2,
  Eye,
  Clock,
  Calendar,
  Target,
  Shield,
  Layers,
  DollarSign,
  Users,
  Lock,
  Plus
} from "lucide-react";

// Assuming GoalService and FilterSelect are implemented in your standard directories
import GoalService from "../../services/goal.service"; // Adjust based on your actual path
import FilterSelect from "../../components/reusable/FilterSelect";

const GoalsPage = () => {
  const navigate = useNavigate();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters state aligned directly with your GET /goals API query params
  const [filters, setFilters] = useState({
    search: "",
    visibility: "",
    status: "",
    goalType: "",
    type: "",
    sortBy: "createdAt",
    order: "desc",
  });

  const sortOptions = [
    { id: "createdAt", name: "Date Created" },
    { id: "startDate", name: "Start Date" },
    { id: "endDate", name: "End Date" },
    { id: "amount", name: "Target Amount" },
    { id: "title", name: "Goal Title" },
  ];

  const fetchGoals = async () => {
    const toastId = toast.loading("Fetching family goals...");
    try {
      setLoading(true);
      
      // Sanitizing empty values to prevent passing empty strings to backend query
      const queryParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );

      const response = await GoalService.getGoals(queryParams);
      
      if (response.success) {
        setGoals(response.goals);
        toast.success("Goals fetched successfully", { id: toastId });
      } else {
        throw new Error(response.message || "Failed to fetch goals.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to retrieve family goals", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      visibility: "",
      status: "",
      goalType: "",
      type: "",
      sortBy: "createdAt",
      order: "desc",
    });
  };

  // Finance Schema-Specific Color Mapping
  const getTypeClasses = (type) => {
    switch (type) {
      case "income":
        return "text-income bg-income-bg border border-income/20";
      case "expense":
        return "text-expense bg-expense-bg border border-expense/20";
      case "investment":
        return "text-investment bg-investment-bg border border-investment/20";
      default:
        return "text-info bg-info-bg border border-info/20";
    }
  };

  const getStatusClasses = (status) => {
    if (status === "completed") return "bg-success-bg text-success";
    if (status === "failed") return "bg-error-bg text-error";
    return "bg-warning-bg text-warning"; // Active status
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="bg-bg min-h-[calc(100vh-64px)]  flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-7xl space-y-6">
        
        {/* Header Segment */}
        <div className="flex justify-between items-center bg-surface p-6 rounded-2xl border border-border shadow-card">
          <div>
            <h1 className="text-2xl font-bold text-text">Family Financial Goals</h1>
            <p className="mt-2 text-text-secondary">
              Track targets, spend ceilings, savings benchmarks, and multi-tenant family allocations.
            </p>
          </div>
          <button
            onClick={()=>navigate("/goals/create")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-text-on-primary hover:bg-primary-hover font-medium hover:cursor-pointer transition-colors"
          >
            <Plus size={16} />
            Create Goal
          </button>
        </div>

        {/* Dynamic Contextual Filters Grid */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            
            {/* Structural Title Query */}
            <div>
              <label className="block text-md font-semibold text-muted mb-1">Search</label>
              <input
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Search goals by title..."
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus"
              />
            </div>

            {/* Financial Type Enum Dropdown */}
            <FilterSelect
              label="Transaction Context"
              value={filters.type}
              onChange={(val) => setFilters((prev) => ({ ...prev, type: val }))}
              options={[
                { id: "", name: "All Matrix Types" },
                { id: "income", name: "Income" },
                { id: "expense", name: "Expense" },
                { id: "investment", name: "Investment" },
                { id: "preInvestmentSavings", name: "Pre-Investment Savings" },
                { id: "netSavings", name: "Net Savings" },
              ]}
            />

            {/* Goal Strategy Paradigm */}
            <FilterSelect
              label="Goal Constraint Type"
              value={filters.goalType}
              onChange={(val) => setFilters((prev) => ({ ...prev, goalType: val }))}
              options={[
                { id: "", name: "All Types" },
                { id: "target", name: "Target (Accumulate)" },
                { id: "limit", name: "Limit (Ceiling)" },
              ]}
            />

            {/* Privacy Scope Visibility Matrix */}
            <FilterSelect
              label="Visibility Scope"
              value={filters.visibility}
              onChange={(val) => setFilters((prev) => ({ ...prev, visibility: val }))}
              options={[
                { id: "", name: "Shared & Personal" },
                { id: "family", name: "Family Wide" },
                { id: "personal", name: "Personal Private" },
              ]}
            />

            {/* Operational Metrics Sort Target */}
            <FilterSelect
              label="Sort Attribute"
              value={filters.sortBy}
              onChange={(val) => setFilters((prev) => ({ ...prev, sortBy: val }))}
              options={sortOptions}
            />

            {/* Display Ordering Sequence */}
            <FilterSelect
              label="Directional Sequence"
              value={filters.order}
              onChange={(val) => setFilters((prev) => ({ ...prev, order: val }))}
              options={[
                { id: "desc", name: "Descending" },
                { id: "asc", name: "Ascending" },
              ]}
            />

            {/* Global Status Filter Constraints */}
            <FilterSelect
              label="Lifecycle Status"
              value={filters.status}
              onChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
              options={[
                { id: "", name: "All Lifecycles" },
                { id: "active", name: "Active Trackers" },
                { id: "completed", name: "Completed Matrix" },
                { id: "failed", name: "Breached/Failed" },
              ]}
            />
          </div>

          {/* Core Action Engine Container */}
          <div className="flex gap-3 mt-6 justify-end">
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-text-secondary hover:bg-surface-3 hover:cursor-pointer transition-colors"
            >
              <RotateCcw size={16} />
              Clear Filters
            </button>
            <button
              onClick={fetchGoals}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-text-on-primary hover:bg-primary-hover font-medium hover:cursor-pointer transition-colors"
            >
              <Search size={16} />
              Search
            </button>
          </div>
        </div>

        {/* Primary Data Output Node Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 min-h-[50vh]">
          {!loading &&
            goals.map((goal) => {
              // Standardizing progress values safe for fallback layout operations
              const progressPct = Math.min(Math.max(goal.progress || 0, 0), 100);
              
              return (
                <div
                  key={goal._id}
                  className="bg-card border border-border rounded-2xl p-5 shadow-card transition-all  h-fit flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Identity tags + Current State status updates */}
                    <div className="flex flex-col gap-2 max-w-[75%]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${getTypeClasses(goal.type)}`}>
                            {goal.type}
                          </span>
                          <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold tracking-wide capitalize ${getStatusClasses(goal.status)}`}>
                            {goal.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold tracking-wide capitalize bg-primary-subtle text-primary`}>
                            {goal.visibility}
                          </span>
                        </div>
                        <h3 className="text-base text-text font-bold break-words mt-1">
                          {goal.title}
                        </h3>
                      </div>

          

                    <div className="mt-5 rounded-xl flex flex-wrap justify-between items-center">
                        <p className="text-base uppercase tracking-wider text-text-secondary font-semibold">
                            {goal.goalType === "target"
                                ? "Target Amount"
                                : "Maximum Limit"}
                        </p>

                        <h2 className="mt-1 text-base font-semibold text-text">
                            ₹{goal.amount.toLocaleString("en-IN")}
                        </h2>


                    </div>

                    

                  {/* Summary */}
                  <div className="mt-4 rounded-xl bg-surface-2 border border-border p-3">
                    <p className="text-sm text-text-secondary">
                      {goal.goalSummary.message}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center flex-wrap gap-3 mt-4">
                    <div>
                      <p className="text-xs text-text-secondary">
                        {goal.goalType === "target" ? "Current" : "Spent"}
                      </p>
                      <p className="font-semibold">
                        ₹{goal.progress.currentAmount.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-secondary">
                        {goal.goalType === "target" ? "Remaining" : goal.progress.hasExceededLimit ? "Exceeded" : "Remaining"}
                      </p>

                      <p className="font-semibold">
                        ₹{(
                          goal.progress.hasExceededLimit
                            ? goal.progress.exceededAmount
                            : goal.progress.remainingAmount
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Meta Data Context Rows (Family vs Personal Created By) */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-divider text-[11px] text-text-secondary">
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar size={13} />
                      <span>
                        {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                      </span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end truncate">
                        <span className="truncate text-muted">By: {goal.createdBy?.name || "Anonymous"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar Footer Control Block */}
                  <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => navigate(`/goals/${goal._id}`)}
                        className="flex-1 inline-flex justify-center items-center gap-2 py-2 rounded-xl bg-primary-subtle text-primary hover:cursor-pointer hover:bg-primary-subtle/80 transition-colors text-xs font-semibold"
                      >
                        <Eye size={14} />
                        View Details
                      </button>

                    </div>
                </div>
              );
            })}

          {/* Empty Analytics State Trigger Indicator */}
          {!loading && goals.length === 0 && (
            <div className="bg-surface border w-full md:col-span-2 xl:col-span-3 h-fit border-border rounded-2xl p-12 text-center">
              <TrendingUp size={48} className="mx-auto text-muted mb-4" />
              <h3 className="text-lg font-semibold text-text">No Ledger System Goals Mapped</h3>
              <p className="text-text-secondary mt-2">
                No telemetry parameters or metrics were detected matching your specific filtering configurations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;