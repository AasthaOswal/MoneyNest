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
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6 border border-gray-200">

        {/* Title */}
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Leave Family
        </h2>

        {/* Warning Box */}
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-sm">
          <p className="font-medium mb-2">⚠️ Warning</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You will lose access to all family transactions</li>
            <li>Your contribution history will no longer be visible</li>
            <li>You may need a new invite to rejoin</li>
          </ul>
        </div>

        {/* Button */}
        <button
          onClick={handleLeaveFamily}
          disabled={loading}
          className={`w-full py-2 rounded-lg font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {loading ? "Leaving..." : "Leave Family"}
        </button>

      </div>
    </div>
  );
};

export default LeaveFamily;