import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FamilyService from "../../services/family.service";
import toast from "react-hot-toast";

const TransferFamilyAdmin = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transferring, setTransferring] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await FamilyService.getFamilyMember(memberId);

        if (res.success) {
          setMember(res.data);
        }
      } catch (err) {
        toast.error(err?.message || "Failed to fetch member");
        navigate("/family");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId, navigate]);

  const handleTransfer = async () => {
    const confirmTransfer = window.confirm(
      `Are you sure you want to transfer Family Admin role to ${member?.name}?`
    );

    if (!confirmTransfer) return;

    const toastId = toast.loading("Please wait while we transfer familyAdmin role...");

    try {
      setTransferring(true);

      const res = await FamilyService.transferFamilyAdmin(memberId);

      if (res.success) {
        toast.success("Family Admin role transferred successfully", {id:toastId});
        navigate("/family");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to transfer admin role", {id:toastId});
    } finally {
      setTransferring(false);
    }
  };

    if (loading) {
    return (
        <div className="min-h-screen bg-(--color-bg) flex items-center justify-center">
        <div className="text-text-secondary text-lg">
            Loading...
        </div>
        </div>
    );
    }

    if (!member) {
    return (
        <div className="min-h-screen bg-(--color-bg) flex items-center justify-center">
        <div className="text-(--color-error) text-lg">
            Member not found
        </div>
        </div>
    );
    }

    return (
    <div className="min-h-screen bg-(--color-bg) flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-(--color-card) border border-(--color-border) rounded-2xl shadow-(--shadow-card) p-6">
        
        <h1 className="text-2xl font-bold text-text text-center mb-6">
            Transfer Family Admin
        </h1>

        <div className="space-y-5 mb-6">
            <div className="bg-(--color-surface-2) border border-(--color-border) rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-text-secondary mb-1">
                Name
            </p>
            <p className="text-text font-medium">
                {member.name}
            </p>
            </div>

            <div className="bg-(--color-surface-2) border border-(--color-border) rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-text-secondary mb-1">
                Email
            </p>
            <p className="text-text font-medium break-all">
                {member.email}
            </p>
            </div>

            <div className="bg-(--color-surface-2) border border-(--color-border) rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-text-secondary mb-1">
                Role
            </p>
            <p className="text-(--color-primary) font-semibold capitalize">
                {member.role}
            </p>
            </div>
        </div>

        <div className="bg-warning-bg border border-warning rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-warning mb-3">
            Important
            </p>

            <ul className="space-y-2 text-sm text-text">
            <li>• You will become a regular family member.</li>
            <li>• The selected member will become Family Admin.</li>
            <li>• Only the new admin can transfer ownership back.</li>
            </ul>
        </div>

        <div className="flex gap-3">
            <button
            onClick={() => navigate("/family")}
            className="flex-1 py-3 rounded-xl border border-(--color-border) bg-(--color-surface) text-text hover:bg-(--color-surface-2) transition-colors"
            >
            Cancel
            </button>

            <button
            onClick={handleTransfer}
            disabled={transferring}
            className="flex-1 py-3 rounded-xl bg-(--color-primary) text-(--color-text-on-primary) font-semibold hover:bg-(--color-primary-hover) disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            {transferring ? "Transferring..." : "Transfer Admin"}
            </button>
        </div>
        </div>
    </div>
    );
};

export default TransferFamilyAdmin;