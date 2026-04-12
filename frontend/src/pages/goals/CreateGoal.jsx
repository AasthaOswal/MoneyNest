import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GoalService from "../../services/goal.service";

const CreateGoal = () => {
  const { id } = useParams(); // Used for Edit mode
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    type: "expense",
    goalType: "limit",
    goalMode: "recurring",
    amount: "",
    period: "monthly",
    startDate: "",
    endDate: "",
    scope: "individual",
    visibility: "private",
  });

  useEffect(() => {
    if (id) {
      const loadGoal = async () => {
        const data = await GoalService.getGoalById(id);
        setFormData(data.goal);
      };
      loadGoal();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await GoalService.updateGoal(id, formData);
      } else {
        await GoalService.createGoal(formData);
      }
      navigate("/goals");
    } catch (err) {
      alert(err.response?.data?.message || "Error saving goal");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-left">
      <h1 className="text-3xl font-bold text-text mb-8">{id ? "Edit" : "Create"} Financial Goal</h1>
      
      <form onSubmit={handleSubmit} className="bg-surface border border-border p-8 rounded-2xl space-y-6">
        <div>
          <label className="block text-muted text-sm font-medium mb-2">Goal Title</label>
          <input 
            type="text" name="title" required
            className="w-full bg-bg border border-border text-text p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="e.g., Summer Vacation Fund"
            value={formData.title} onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-muted text-sm font-medium mb-2">Category</label>
            <select name="type" className="w-full bg-bg border border-border text-text p-3 rounded-lg" value={formData.type} onChange={handleChange}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="investment">Investment</option>
              <option value="saving">Saving</option>
            </select>
          </div>
          <div>
            <label className="block text-muted text-sm font-medium mb-2">Goal Logic</label>
            <select name="goalType" className="w-full bg-bg border border-border text-text p-3 rounded-lg" value={formData.goalType} onChange={handleChange}>
              <option value="target">Target (Reach this)</option>
              <option value="limit">Limit (Don't exceed)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-muted text-sm font-medium mb-2">Amount ($)</label>
            <input 
              type="number" name="amount" required
              className="w-full bg-bg border border-border text-text p-3 rounded-lg"
              value={formData.amount} onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-muted text-sm font-medium mb-2">Goal Mode</label>
            <select name="goalMode" className="w-full bg-bg border border-border text-text p-3 rounded-lg" value={formData.goalMode} onChange={handleChange}>
              <option value="recurring">Recurring</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>
        </div>

        {formData.goalMode === "recurring" ? (
          <div>
            <label className="block text-muted text-sm font-medium mb-2">Frequency Period</label>
            <select name="period" className="w-full bg-bg border border-border text-text p-3 rounded-lg" value={formData.period} onChange={handleChange}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-muted text-sm font-medium mb-2">Start Date</label>
              <input type="date" name="startDate" required className="w-full bg-bg border border-border text-text p-3 rounded-lg" value={formData.startDate.split('T')[0]} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-muted text-sm font-medium mb-2">End Date</label>
              <input type="date" name="endDate" required className="w-full bg-bg border border-border text-text p-3 rounded-lg" value={formData.endDate.split('T')[0]} onChange={handleChange} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <label className="block text-muted text-sm font-medium mb-2">Scope</label>
            <select name="scope" className="w-full bg-bg border border-border text-text p-3 rounded-lg" value={formData.scope} onChange={handleChange}>
              <option value="individual">Individual</option>
              <option value="family">Family-wide</option>
            </select>
          </div>
          <div>
            <label className="block text-muted text-sm font-medium mb-2">Visibility</label>
            <select name="visibility" className="w-full bg-bg border border-border text-text p-3 rounded-lg" value={formData.visibility} onChange={handleChange}>
              <option value="private">Private</option>
              <option value="family">Visible to Family</option>
            </select>
          </div>
        </div>

        <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all">
          {id ? "Update Goal" : "Create Goal"}
        </button>
      </form>
    </div>
  );
};

export default CreateGoal;