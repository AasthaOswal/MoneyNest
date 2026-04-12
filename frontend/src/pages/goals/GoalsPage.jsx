import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GoalService from "../../services/goal.service";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await GoalService.getGoals();
      setGoals(data.goals);
    } catch (err) {
      console.error("Failed to fetch goals", err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "income": return "bg-income";
      case "expense": return "bg-expense";
      case "investment": return "bg-investment";
      default: return "bg-primary";
    }
  };

  if (loading) return <div className="p-10 text-text">Loading goals...</div>;

  return (
    <div className="p-6 text-left">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text">Financial Goals</h1>
        <Link 
          to="/goals/create" 
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Create Goal
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <Link 
            to={`/goals/${goal._id}`} 
            key={goal._id}
            className="bg-surface border border-border p-5 rounded-xl hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`${getTypeColor(goal.type)} text-white text-xs font-bold px-2 py-1 rounded uppercase`}>
                {goal.type}
              </span>
              <span className="text-muted text-sm capitalize">{goal.period || "Custom Range"}</span>
            </div>
            
            <h3 className="text-xl font-semibold text-text mb-2">{goal.title}</h3>
            <div className="text-2xl font-bold text-primary mb-4">
              ₹{goal.amount.toLocaleString()}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-muted text-xs">Scope: <span className="text-text font-medium capitalize">{goal.scope}</span></span>
              <span className={`text-xs px-2 py-1 rounded-full ${goal.status === 'active' ? 'bg-income/20 text-income' : 'bg-muted/20 text-muted'}`}>
                {goal.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GoalsPage;