import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GoalService from "../../services/goal.service"; // Adjust path as necessary
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  Target,
  Users,
  User,
  Shield,
  TrendingUp,
  List,
  Plus,
} from "lucide-react";

const GoalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState(null);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        console.log("inside fetch goal")
        const res = await GoalService.getGoalById(id);
        console.log("Fetch Goal Response: ", res);
        // Matching sample structure: res.data.goal or res.data depending on your base service
        setGoal(res.goal || res.data);
      } catch (error) {
        console.log(error.response)
        toast.error(error?.response?.data?.message || "Failed to fetch goal details");
      }
    };

    fetchGoal();
  }, [id]);

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting financial goal...");

    try {
      const res = await GoalService.deleteGoal(id);

      toast.success(
        res?.message || "Financial goal deleted successfully",
        { id: loadingToast }
      );

      navigate("/goals");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete financial goal",
        { id: loadingToast }
      );
    }
  };

  if (!goal) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-secondary">Loading financial goal......jsbckjs.</p>
      </div>
    );
  }

  // Type badge styling using the theme variables
  const typeBadgeStyles = {
    income: "bg-income-bg text-income border border-income/30",
    expense: "bg-expense-bg text-expense border border-expense/30",
    investment: "bg-investment-bg text-investment border border-investment/30",
  };

  // Status badge styling map
  const statusBadgeStyles = {
    active: "bg-success-bg text-success border border-success/30",
    completed: "bg-info-bg text-info border border-info/30",
    exceeded: "bg-error-bg text-error border border-error/30",
  };

  const formattedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-bg p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Main Card */}
        <div
          className="bg-card border border-border rounded-3xl overflow-hidden"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-divider">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeBadgeStyles[goal.type]}`}>
                    {goal.type?.toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadgeStyles[goal.progress?.hasExceededLimit ? 'exceeded' : goal.status]}`}>
                    {goal.progress?.hasExceededLimit ? "LIMIT EXCEEDED" : goal.status?.toUpperCase()}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-surface-2 text-text-secondary border border-border">
                    {goal.goalType?.toUpperCase()}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-text mb-3">
                  {goal.title}
                </h1>

                <p className="text-3xl font-bold text-primary">
                  ₹ {Number(goal.amount).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="p-6 md:p-8 border-b border-divider bg-surface/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-text-secondary font-medium flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                Goal Progress
              </span>
              <span className="text-sm font-bold text-text">
                {goal.progress?.progress}%
              </span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="w-full bg-surface-3 h-3 rounded-full overflow-hidden border border-border">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  goal.progress?.hasExceededLimit ? 'bg-error' : 'bg-success'
                }`}
                style={{ width: `${Math.min(goal.progress?.progress || 0, 100)}%` }}
              />
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-surface-2 border border-border rounded-xl p-3">
                <p className="text-xs text-muted">Current Amount</p>
                <p className="text-base font-semibold text-text mt-0.5">
                  ₹ {Number(goal.progress?.currentAmount).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-surface-2 border border-border rounded-xl p-3">
                <p className="text-xs text-muted">Remaining Balance</p>
                <p className={`text-base font-semibold mt-0.5 ${goal.progress?.remainingAmount < 0 ? 'text-error' : 'text-text'}`}>
                  ₹ {Number(goal.progress?.remainingAmount).toLocaleString("en-IN")}
                </p>
              </div>
              {goal.progress?.exceededAmount > 0 && (
                <div className="bg-error-bg border border-error/20 rounded-xl p-3 col-span-2 md:col-span-1">
                  <p className="text-xs text-error">Exceeded Amount</p>
                  <p className="text-base font-semibold text-error mt-0.5">
                    ₹ {Number(goal.progress?.exceededAmount).toLocaleString("en-IN")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Details Metadata */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Timeline Dates */}
            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-primary mt-1 shrink-0" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div>
                  <p className="text-sm text-muted">Start Date</p>
                  <p className="text-text font-medium">{formattedDate(goal.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">End Date</p>
                  <p className="text-text font-medium">{formattedDate(goal.endDate)}</p>
                </div>
              </div>
            </div>

            {/* Family context */}
            {goal.family && (
              <div className="flex items-start gap-3">
                <Users size={18} className="text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-muted">Family Workspace</p>
                  <p className="text-text font-medium">{goal.family.familyName}</p>
                </div>
              </div>
            )}

            {/* Created By */}
            {goal.createdBy && (
              <div className="flex items-start gap-3">
                <User size={18} className="text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-muted">Created By</p>
                  <p className="text-text font-medium">
                    {goal.createdBy.name}{" "}
                    <span className="text-text-secondary text-xs font-normal">
                      ({goal.createdBy.email})
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Visibility Scope */}
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-primary mt-1 shrink-0" />
              <div>
                <p className="text-sm text-muted">Visibility Scope</p>
                <p className="text-text font-medium capitalize">{goal.visibility}</p>
              </div>
            </div>

            {/* Target Settings Summary Box */}
            <div className="flex items-start gap-3">
              <Target size={18} className="text-primary mt-1 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-muted mb-1">Target Configurations</p>
                <div className="bg-surface-2 border border-border rounded-xl p-4">
                  <p className="text-text text-sm leading-relaxed">
                    This financial target tracks active <span className="text-warning font-medium">{goal.type}</span> patterns. 
                    It operates structurally as a tracking <span className="text-primary font-medium">{goal.goalType}</span> parameters config.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Footer Panel */}
            <div className="pt-6 border-t border-divider">
              <h3 className="text-sm font-medium text-muted mb-3">Actions</h3>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/goals")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 border border-border text-text hover:bg-surface-3 transition-colors hover:cursor-pointer"
                >
                  <List size={16} />
                  All Goals
                </button>

                <button
                  onClick={() => navigate("/goals/create")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-subtle text-primary border border-primary/20 hover:bg-primary/10 transition-colors hover:cursor-pointer"
                >
                  <Plus size={16} />
                  Create Goal
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-error text-error hover:bg-error-bg transition-colors hover:cursor-pointer"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

                <button
                  onClick={() => navigate(`/goals/edit/${goal._id}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-text-on-primary hover:bg-primary-hover transition-colors hover:cursor-pointer"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default GoalDetails;