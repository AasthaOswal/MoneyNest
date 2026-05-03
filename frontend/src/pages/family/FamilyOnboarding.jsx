import { useNavigate } from "react-router-dom";

const FamilyOnboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center p-6">
      <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-md space-y-6 shadow-md">

        <h1 className="text-2xl font-semibold text-center">
          Welcome 👋
        </h1>

        <p className="text-muted text-center">
          Create a new family or join an existing family to access all tabss like transaction, goals,labels etc.
        </p>



        <div className="space-y-4">
          <button
            onClick={() => navigate("/family/create")}
            className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl"
          >
            Create Family
          </button>

          <button
            onClick={() => navigate("/family/join")}
            className="w-full border border-border py-3 rounded-xl hover:bg-bg"
          >
            Join Family
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyOnboarding;