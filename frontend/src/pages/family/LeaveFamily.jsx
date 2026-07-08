import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FamilyService from "../../services/family.service";
import toast from "react-hot-toast";

const LeaveFamily = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLeaveFamily = async () => {
    const confirm = window.confirm(
      "Are you sure you want to leave this family? This action cannot be undone."
    );

    if (!confirm) return;

    try {
      setLoading(true);

      const res = await FamilyService.leaveFamily();

      toast.success(res.message || "You have left the family successfully");

      // redirect after leaving
      setTimeout(() => {
        navigate("/family/setup"); // or wherever makes sense
      }, 1500);

    } catch (error) {
      toast.error(error.message || "Failed to leave family");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-(--shadow-card) p-6">

        <h2 className="mb-2 text-2xl font-bold text-error">
          Leave Family
        </h2>

        <p className="mb-6 text-sm text-text-secondary">
          Leaving your family will immediately remove your access to shared data
          and features. Please review the consequences before continuing.
        </p>

        <div className="mb-6 rounded-xl border border-error bg-error-bg p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <h3 className="font-semibold text-error">Warning</h3>
          </div>

          <ul className="list-disc space-y-2 pl-5 text-sm text-text-secondary">
            <li>You will lose access to all family transactions.</li>
            <li>Your contribution history will no longer be visible.</li>
            <li>You may require a new invite to join again.</li>
          </ul>
        </div>

        <button
          onClick={handleLeaveFamily}
          disabled={loading}
          className={`w-full rounded-xl border py-3 font-semibold transition-all duration-200 ${
            loading
              ? "cursor-not-allowed border-border bg-surface text-muted"
              : "border-error bg-error text-bg hover:opacity-90 cursor-pointer"
          }`}
        >
          {loading ? "Leaving..." : "Leave Family"}
        </button>
      </div>
    </div>
  );
};

export default LeaveFamily;