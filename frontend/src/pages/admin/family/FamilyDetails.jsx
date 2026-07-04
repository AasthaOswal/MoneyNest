import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Trash2,
  Users,
  ShieldAlert,
  User,
  Database,
  Mail,
  Key
} from "lucide-react";
import toast from "react-hot-toast";

import FamilyService from "../../../services/family.service"; // Adjust import path if needed

const FamilyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [familyData, setFamilyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFamilyDetails();
  }, [id]);

  const fetchFamilyDetails = async () => {
    try {
      setLoading(true);

      const response = await FamilyService.getFamilyById(id);
      
      // Handle the data structure from backend payload: { success: true, family, members, totalMembers }
      if (response?.success) {
        setFamilyData(response);
      } else {
        setFamilyData(response?.data || response);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to fetch family details");
      navigate("/families");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this family group?");

    if (!confirmed) return;

    try {
      const response = await FamilyService.approveFamilyDeletion(id);

      toast.success(response?.message || "Family deleted");
      navigate("/all-families");
    } catch (error) {
      toast.error(error?.message || "Failed to delete family");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-(--color-success-bg) text-(--color-success)";
      case "pendingdeletion":
        return "bg-(--color-warning-bg) text-(--color-warning)";
      case "deleted":
        return "bg-(--color-error-bg) text-(--color-error)";
      default:
        return "bg-(--color-surface-3) text-(--color-text)";
    }
  };

  const InfoRow = ({ label, value }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-3 border-b border-(--color-border) last:border-b-0">
      <p className="text-text-secondary text-sm">{label}</p>
      <div className="md:col-span-2 text-text wrap-break-word whitespace-pre-wrap">
        {value || "-"}
      </div>
    </div>
  );

  const SectionCard = ({ title, icon: Icon, children }) => (
    <div className="bg-(--color-card) border border-(--color-border) rounded-xl p-5 shadow-(--shadow-card)">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon size={20} className="text-(--color-primary)" />}
        <h2 className="text-lg font-semibold text-text">{title}</h2>
      </div>
      {children}
    </div>
  );

  if (loading) {
    return <div className="p-6 text-text">Loading...</div>;
  }

  if (!familyData || !familyData.family) {
    return <div className="p-6 text-text">Family not found</div>;
  }

  const { family, members, totalMembers } = familyData;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">
            {family.familyName} Details
          </h1>
        </div>

        {family.status === "pendingDeletion" && (
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-error-bg) text-(--color-error) border border-(--color-border) hover:cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <Trash2 size={18} />
                    Delete Family
                </button>
            </div>
        )}
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border border-(--color-border) ${getStatusColor(
            family.status
          )}`}
        >
          Status: {family.status || "Unknown"}
        </span>

        <span className="px-3 py-1 rounded-full bg-(--color-info-bg) text-(--color-info) text-sm font-medium border border-(--color-border)">
          Members Count: {totalMembers ?? 0}
        </span>
      </div>

      {/* Grid Layout for details */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* General Information */}
          <SectionCard title="General Family Details" icon={Users}>
            <InfoRow label="Family ID" value={family._id} />
            <InfoRow label="Family Name" value={family.familyName} />
            <InfoRow label="Total Registered Members" value={`${totalMembers} members`} />
          </SectionCard>

          {/* Family Administrator Details */}
          <SectionCard title="Family Admin" icon={ShieldAlert}>
            <InfoRow
              label="Admin ID"
              value={family.familyAdmin?._id || "N/A"}
            />
            <InfoRow
              label="Admin Name"
              value={family.familyAdmin?.name || "-"}
            />
            <InfoRow
              label="Admin Email"
              value={family.familyAdmin?.email || "-"}
            />
            <InfoRow 
              label="System Role" 
              value={family.familyAdmin?.role || "-"} 
            />
            <InfoRow 
              label="Account Status" 
              value={family.familyAdmin?.status || "-"} 
            />
          </SectionCard>

          {/* Token Management */}
          <SectionCard title="Invite System" icon={Key}>
            <div className="py-3 border-b border-(--color-border) last:border-b-0">
              <p className="text-text-secondary text-sm mb-1">
                Active Invite Token
              </p>
              <div className="bg-(--color-input-bg) border border-(--color-border) rounded p-3 text-sm text-text wrap-break-word font-mono">
                {family.inviteToken || "No active invitation token generated."}
              </div>
            </div>
            <InfoRow
              label="Token Expires At"
              value={family.inviteTokenExpires ? formatDate(family.inviteTokenExpires) : "N/A"}
            />
          </SectionCard>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Members List Section */}
          <SectionCard title="Family Members List" icon={User}>
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
              {members && members.length > 0 ? (
                members.map((member) => (
                  <div 
                    key={member._id} 
                    className="p-4 bg-(--color-surface) border border-(--color-border) rounded-lg space-y-2 hover:bg-(--color-surface-2) transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-text text-sm">{member.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border border-(--color-border) ${getStatusColor(member.status)}`}>
                        {member.status || "active"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <Mail size={12} />
                      <span className="truncate">{member.email}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1 border-t border-(--color-divider) text-muted">
                      <span>Role: <strong className="text-text-secondary font-normal">{member.role || "user"}</strong></span>
                      <span>Joined: {new Date(member.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-text-secondary text-sm py-4 text-center">
                  No registered users associated with this family account.
                </div>
              )}
            </div>
          </SectionCard>

          {/* Timestamps */}
          <SectionCard title="System Tracking" icon={Database}>
            <InfoRow
              label="Created At"
              value={formatDate(family.createdAt)}
            />
            <InfoRow
              label="Updated At"
              value={formatDate(family.updatedAt)}
            />
          </SectionCard>
          
        </div>
      </div>
    </div>
  );
};

export default FamilyDetails;