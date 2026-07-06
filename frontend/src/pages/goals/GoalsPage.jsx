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
  DollarSign
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
        toast.success("Goals updated successfully", { id: toastId });
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
    <div className="bg-bg min-h-[calc(100vh-64px)] p-0 sm:p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-6">
        
        {/* Header Segment */}
        <div className="flex justify-between items-center bg-surface p-6 rounded-2xl border border-border shadow-card">
          <div>
            <h1 className="text-2xl font-bold text-text">Family Financial Goals</h1>
            <p className="mt-2 text-text-secondary">
              Track targets, spend ceilings, savings benchmarks, and multi-tenant family allocations.
            </p>
          </div>
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
              Clear Configurations
            </button>
            <button
              onClick={fetchGoals}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-text-on-primary hover:bg-primary-hover font-medium hover:cursor-pointer transition-colors"
            >
              <Search size={16} />
              Query Analytics Engine
            </button>
          </div>
        </div>

        {/* Primary Data Output Node Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 min-h-[50vh]">
          {!loading &&
            goals.map((goal) => {
              // Standardizing progress values safe for fallback layout operations
              const progressPct = Math.min(Math.max(goal.progress || 0, 0), 100);
              
              return (
                <div
                  key={goal._id}
                  className="bg-card border border-border rounded-2xl p-5 shadow-card transition-all hover:bg-card-hover h-fit flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Identity tags + Current State status updates */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex flex-col gap-2 max-w-[75%]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${getTypeClasses(goal.type)}`}>
                            {goal.type}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide capitalize ${getStatusClasses(goal.status)}`}>
                            {goal.status}
                          </span>
                        </div>
                        <h3 className="text-base text-text font-bold break-words mt-1">
                          {goal.title}
                        </h3>
                      </div>
                      
                      {/* Privacy Strategy Icon indicator */}
                      <span className={`p-2 rounded-xl text-xs ${goal.visibility === 'family' ? 'bg-primary-subtle text-primary' : 'bg-surface-3 text-text-secondary'}`} title={`${goal.visibility} visibility scope`}>
                        <Shield size={16} />
                      </span>
                    </div>

                    {/* Numeric Tracking Information Block */}
                    <div className="mt-4 bg-surface-2 rounded-xl p-3 border border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-muted" />
                        <span className="text-xs text-text-secondary">Allocation Target</span>
                      </div>
                      <span className="text-sm font-mono font-bold text-text">
                        {goal.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </span>
                    </div>

                    {/* Progress Engine UI Node */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center text-xs text-text-secondary">
                        <div className="flex items-center gap-1.5">
                          <Target size={14} className="text-muted" />
                          <span className="capitalize">{goal.goalType} Strategy</span>
                        </div>
                        <span className="font-mono font-semibold text-text">{progressPct.toFixed(1)}%</span>
                      </div>
                      
                      {/* Progress Bar Track wrapper */}
                      <div className="w-full bg-input-bg rounded-full h-2 overflow-hidden border border-border">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            goal.goalType === "limit" && progressPct > 90
                              ? "bg-error"
                              : "bg-primary"
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta Data Context Rows (Family vs Personal Created By) */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-divider text-[11px] text-text-secondary">
                      <div className="flex items-center gap-1.5 truncate">
                        <Layers size={13} className="text-muted shrink-0" />
                        <span className="truncate">{goal.family?.familyName || "System Block"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end truncate">
                        <span className="truncate text-muted">By: {goal.createdBy?.name || "Anonymous"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar Footer Control Block */}
                  <div>
                    <div className="mt-4 pt-3 border-t border-divider flex items-center gap-1.5 text-[11px] text-muted">
                      <Calendar size={13} />
                      <span>
                        {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                      </span>
                    </div>

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