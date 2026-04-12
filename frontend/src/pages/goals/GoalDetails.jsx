import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import GoalService from "../../services/goal.service";

const GoalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const data = await GoalService.getGoalById(id);
        setGoal(data.goal);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGoal();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await GoalService.deleteGoal(id);
        navigate("/goals");
      } catch (err) {
        alert("Failed to delete");
      }
    }
  };

  if (!goal) return <div className="p-10 text-text">Loading details...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto text-left">

    

      <div className="bg-surface border border-border rounded-2xl p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-text mb-2">{goal.title}</h1>
            <p className="text-muted italic">Created on {new Date(goal.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/goals/edit/${goal._id}`} className="border border-border text-text px-4 py-2 rounded-lg hover:bg-bg">Edit</Link>
            <button onClick={handleDelete} className="bg-expense text-white px-4 py-2 rounded-lg">Delete</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-bg p-4 rounded-xl">
            <p className="text-muted text-sm mb-1">Target Amount</p>
            <p className="text-3xl font-bold text-primary">₹{goal.amount.toLocaleString()}</p>
          </div>
          <div className="bg-bg p-4 rounded-xl">
            <p className="text-muted text-sm mb-1">Goal Type</p>
            <p className="text-xl font-semibold text-text capitalize">{goal.goalType} ({goal.type})</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted">Mode</span>
            <span className="text-text font-medium capitalize">{goal.goalMode}</span>
          </div>
          {goal.goalMode === "recurring" ? (
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted">Frequency</span>
              <span className="text-text font-medium capitalize">{goal.period}</span>
            </div>
          ) : (
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted">Duration</span>
              <span className="text-text font-medium">
                {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted">Visibility</span>
            <span className="text-text font-medium capitalize">{goal.visibility}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted">Scope</span>
            <span className="text-text font-medium capitalize">{goal.scope}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalDetails;