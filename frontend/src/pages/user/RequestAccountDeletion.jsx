import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestAccountDeletion } from "../../services/user.service"; // Adjust this path to match your folder structure
import toast from "react-hot-toast";

const RequestAccountDeletion = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestDeletion = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to request deletion of your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await requestAccountDeletion();
      console.log(res);

      toast.success(
        res.message || "Account deletion request submitted successfully."
      );

      // Clean up local authentication states here if necessary (e.g., localStorage.clear())
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error.message || "Failed to request account deletion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-md h-fit rounded-2xl bg-card border border-border shadow-card p-6">

        <h2 className="text-2xl font-semibold text-error mb-4">
          Request Account Deletion
        </h2>

        <div className="rounded-xl border border-error bg-error-bg text-text p-4 mb-6">
          <p className="font-semibold text-error mb-3">
            ⚠️ Warning
          </p>

          <ul className="list-disc pl-5 space-y-2 text-sm text-text-secondary">
            <li>
              This request will permanently delete your personal profile and account credentials.
            </li>

            <li>
              Your personal data, configurations, and individual activity logs will be scrubbed from the database.
            </li>

            <li>
              You will instantly lose access to any personal dashboards, configurations, and settings linked specifically to your profile.
            </li>

            <li>
              This action is irreversible once the administrative grace window is processed.
            </li>

            <li>
              If you decide to return to the application in the future, you will have to undergo a fresh registration process.
            </li>
          </ul>
        </div>

        <button
          onClick={handleRequestDeletion}
          disabled={loading}
          className={`
            w-full rounded-lg py-2.5 font-medium transition-all cursor-pointer
            ${
              loading
                ? "bg-surface-3 text-muted cursor-not-allowed"
                : "bg-error text-bg hover:opacity-90 active:scale-[0.98]"
            }
          `}
        >
          {loading
            ? "Submitting Request..."
            : "Request Account Deletion"}
        </button>

      </div>
    </div>
  );
};

export default RequestAccountDeletion;