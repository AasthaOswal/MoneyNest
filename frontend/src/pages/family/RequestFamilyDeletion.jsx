import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FamilyService from "../../services/family.service";
import toast from "react-hot-toast";

const RequestFamilyDeletion = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestDeletion = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to request deletion of this family? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await FamilyService.requestFamilyDeletion();
      console.log(res)

      toast.success(
        res.message || "Family deletion request submitted successfully."
      );

      setTimeout(() => {
        navigate("/family");
      }, 1500);
    } catch (error) {
      toast.error(error.message || "Failed to request family deletion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-md h-fit rounded-2xl bg-card border border-border shadow-card p-6">

        <h2 className="text-2xl font-semibold text-error mb-4">
          Request Family Deletion
        </h2>

        <div className="rounded-xl border border-error bg-error-bg text-text p-4 mb-6">
          <p className="font-semibold text-error mb-3">
            ⚠️ Warning
          </p>

          <ul className="list-disc pl-5 space-y-2 text-sm text-text-secondary">
            <li>
              This request will permanently delete the entire family.
            </li>

            <li>
              All transactions, budgets, goals, reports, categories, labels,
              and other family data will be permanently removed.
            </li>

            <li>
              Every family member will lose access to this family and its data.
            </li>

            <li>
              This action cannot be undone once the deletion request is
              approved and processed.
            </li>

            <li>
              If you wish to continue using the application together, you will
              need to create a new family after deletion.
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
            : "Request Family Deletion"}
        </button>

      </div>
    </div>
  );
};

export default RequestFamilyDeletion;