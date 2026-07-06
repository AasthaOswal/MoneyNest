import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Target,
  DollarSign,
  Calendar,
  Layers,
  Shield,
  FileText,
  Save
} from "lucide-react";

import GoalService from "../../services/goal.service"; // Adjusted path to match references
import FilterSelect from "../../components/reusable/FilterSelect";

const CreateGoal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State aligned explicitly to your MongoDB/Mongoose Schema definition
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    goalType: "",
    amount: "",
    visibility: "family", // Schema default parameter
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation fallback mirroring backend constraints
    if (!formData.title.trim()) return toast.error("Goal title is required.");
    if (!formData.type) return toast.error("Please pick a transaction context matrix.");
    if (!formData.goalType) return toast.error("Please select a goal constraint strategy.");
    if (!formData.amount || Number(formData.amount) <= 0) {
      return toast.error("Please enter a valid target amount structural value.");
    }
    if (!formData.startDate) return toast.error("Start timeline validation bound is required.");
    if (!formData.endDate) return toast.error("End timeline validation bound is required.");
    
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      return toast.error("Timeline violation: Start date cannot sit past end date.");
    }

    const toastId = toast.loading("Provisioning new family financial target...");
    try {
      setLoading(true);

      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };

      const response = await GoalService.createGoal(payload);

      if (response.success) {
        toast.success("Financial metrics goal tracking provisioned successfully!", { id: toastId });
        navigate("/goals"); // Returns user back to telemetry panel
      } else {
        throw new Error(response.message || "Engine rejected goal payload schema validation.");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Failed to commit financial ledger tracker configuration", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg min-h-[calc(100vh-64px)] flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-5xl space-y-6">
        

        {/* Form Identity Module Header */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-card flex items-start gap-4">
          <div className="p-3 bg-primary-subtle rounded-xl text-primary shrink-0">
            <Target size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">Create Goal Goal</h1>
            <p className="mt-1 text-text-secondary text-sm">
              Create family wide or personal goals for  income, expense, pre-investment savings, net savings.
            </p>
          </div>
        </div>

        {/* Primary Data Collection Pipeline */}
        <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-2xl border border-border shadow-card space-y-6">
          
          {/* Section: Core Identity */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-md font-semibold text-muted mb-1.5">
                <FileText size={16} className="text-primary" />
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter goal title"
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus placeholder:text-placeholder"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Financial Type Enum Mapping */}
              <FilterSelect
                label="Transaction Type"
                value={formData.type}
                onChange={(val) => handleSelectChange("type", val)}
                options={[
                  { id: "", name: "Select" },
                  { id: "income", name: "Income" },
                  { id: "expense", name: "Expense" },
                  { id: "investment", name: "Investment" },
                  { id: "preInvestmentSavings", name: "Pre-Investment Savings" },
                  { id: "netSavings", name: "Net Savings" },
                ]}
              />

              {/* Goal Strategy Constraints */}
              <FilterSelect
                label="Goal Type"
                value={formData.goalType}
                onChange={(val) => handleSelectChange("goalType", val)}
                options={[
                  { id: "", name: "Select Target or Limit" },
                  { id: "target", name: "Target" },
                  { id: "limit", name: "Limit " },
                ]}
              />
            </div>
          </div>

          <hr className="border-divider" />

          {/* Section: Metrics & Ledger Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-md font-semibold text-muted mb-1.5">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="1"
                step="any"
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus placeholder:text-placeholder"
                disabled={loading}
              />
            </div>

            {/* Privacy Scope Visibility Matrix Dropdown */}
            <FilterSelect
              label=" Visibility"
              value={formData.visibility}
              onChange={(val) => handleSelectChange("visibility", val)}
              options={[
                { id: "family", name: "Family Level Goal" },
                { id: "personal", name: "Personal Level Goal" },
              ]}
            />
          </div>

          <hr className="border-divider" />

          {/* Section: Timeline Bounds */}
          <div>
            <label className="flex items-center gap-2 text-md font-semibold text-muted mb-2">
              <Calendar size={16} className="text-primary" />
              Date Range
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-semibold text-text-secondary mb-1">Start Date</span>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus scheme-dark"
                  disabled={loading}
                />
              </div>
              <div>
                <span className="block text-xs font-semibold text-text-secondary mb-1">End Date</span>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus scheme-dark"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Core Action Engine Controls Container */}
          <div className="flex gap-3 pt-4 border-t border-divider justify-end">
            <button
              type="button"
              onClick={() => navigate("/goals")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-2 border border-border text-text-secondary hover:bg-surface-3 hover:cursor-pointer transition-colors font-medium text-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-text-on-primary hover:bg-primary-hover font-bold hover:cursor-pointer transition-colors shadow-sm disabled:opacity-50 text-sm"
              disabled={loading}
            >
              <Save size={16} />
              {loading ? "Processing..." : "Create Goal"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateGoal;