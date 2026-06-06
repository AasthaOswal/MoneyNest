import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Shield, Wallet } from "lucide-react";
import toast from "react-hot-toast";

const FamilyOnboarding = () => {
  const navigate = useNavigate();



  return (
    <div className="min-h-[80vh] h-auto bg-bg text-text flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        <div className="bg-surface border border-border rounded-3xl p-8 shadow-card">

          {/* Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-subtle flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-primary" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-center mb-3">
            Welcome to MoneyNest
          </h1>

          <p className="text-text-secondary text-center mb-8">
            Create or join a family to unlock shared transactions,
            goals, budgets, labels, and collaborative financial planning.
          </p>



          {/* Actions */}
          <div className="space-y-4">

            <button
              onClick={()=>navigate("/family/create")}
              className="w-full bg-primary hover:bg-primary-hover text-text-on-primary font-semibold py-3.5 rounded-xl transition-all duration-200 hover:cursor-pointer"
            >
              Create Family
            </button>

            <button
              onClick={()=>navigate("/family/join")}
              className="w-full bg-surface-2 border border-border hover:border-border-hover hover:bg-surface-3 py-3.5 rounded-xl transition-all duration-200 hover:cursor-pointer"
            >
              Join Existing Family
            </button>

          </div>

          <p className="text-center text-muted text-sm mt-6">
            You can invite other members after creating a family.
          </p>

        </div>

      </div>
    </div>
  );
};

export default FamilyOnboarding;