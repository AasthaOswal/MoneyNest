import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Users,
  Key,
  Database,
  UserCheck,
  Smartphone
} from "lucide-react";
import toast from "react-hot-toast";

// Importing the API service utility provided
import { getUserById, approveUserDeletion } from "../../../services/user.service"; 

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      // Handles data extraction based on backend response layout { success: true, user: {...} }
      const response = await getUserById(id);
      setUserData(response?.user || response);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch user details");
      navigate("/users");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeletion = async () => {
    const confirmed = window.confirm("Are you sure you want to approve this user's deletion request?");
    if (!confirmed) return;

    try {
      const response = await approveUserDeletion(id);
      console.log(response)
      toast.success(response?.message || "User deletion approved successfully");
      // Re-fetch details to show updated data status
      fetchUserDetails();
    } catch (error) {
      toast.error(error?.message || "Failed to approve user deletion");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-(--color-success-bg) text-(--color-success)";
      case "pendingDeletion":
        return "bg-(--color-warning-bg) text-(--color-warning)";
      case "deleted":
        return "bg-(--color-error-bg) text-(--color-error)";
      default:
        return "bg-(--color-surface-3) text-(--color-text)";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-(--color-investment-bg) text-(--color-investment)";
      case "familyAdmin":
        return "bg-(--color-info-bg) text-(--color-info)";
      default:
        return "bg-surface-3 text-text-secondary";
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
    return <div className="p-6 text-text">Loading user profile...</div>;
  }

  if (!userData) {
    return <div className="p-6 text-text">User profile not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">User Profile Management</h1>
        </div>

        {/* Display Deletion Approval button conditionally if user is in pendingDeletion state */}
        {userData.status === "pendingDeletion" && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleApproveDeletion}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-error-bg) text-(--color-error) border border-(--color-border) hover:cursor-pointer hover:opacity-80 transition-opacity"
            >
              <UserCheck size={18} />
              Approve Deletion
            </button>
          </div>
        )}
      </div>

      {/* Status Pills Summary */}
      <div className="flex flex-wrap gap-3">
        <span className={`px-3 py-1 rounded-full text-sm font-medium border border-(--color-border) ${getRoleColor(userData.role)}`}>
          Role: {userData.role}
        </span>

        <span className={`px-3 py-1 rounded-full text-sm font-medium border border-(--color-border) ${getStatusColor(userData.status)}`}>
          Status: {userData.status}
        </span>

        <span className={`px-3 py-1 rounded-full text-sm font-medium border border-(--color-border) ${userData.isActive ? "bg-(--color-success-bg) text-(--color-success)" : "bg-(--color-error-bg) text-(--color-error)"}`}>
          {userData.isActive ? "Active Account" : "Suspended / Disabled"}
        </span>

        <span className="px-3 py-1 rounded-full bg-surface-3 text-text-secondary text-sm border border-(--color-border)">
          {userData.familyId ? "Family Member" : "Independent User"}
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Identity Information */}
          <SectionCard title="Personal Information" icon={User}>
            <InfoRow label="Full Name" value={userData.name} />
            <InfoRow label="Email Address" value={userData.email} />
            <InfoRow label="User ID" value={userData._id} />
            <InfoRow label="Storage Namespace ID" value={userData.cloudinaryStorageId} />
          </SectionCard>

          {/* Family Structure Linkage (Populated Fields) */}
          <SectionCard title="Family Organization" icon={Users}>
            {userData.familyId ? (
              <>
                <InfoRow label="Family Group Name" value={userData.familyId?.familyName} />
                <InfoRow label="Family Admin ID" value={userData.familyId?.familyAdmin} />
                <InfoRow label="Family Account Status" value={userData.familyId?.status} />
                <InfoRow label="Family Joined Date" value={formatDate(userData.familyId?.createdAt)} />
              </>
            ) : (
              <div className="p-3 text-sm bg-(--color-input-bg) border border-(--color-border) rounded text-text-secondary italic">
                Not associated with any family network profiles.
              </div>
            )}
          </SectionCard>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Security & Access Logs */}
          <SectionCard title="Authentication Profile" icon={Shield}>
            <div className="py-3 border-b border-(--color-border)">
              <p className="text-text-secondary text-sm mb-2">Registered Providers</p>
              <div className="flex flex-wrap gap-2">
                {userData.authProvider?.length > 0 ? (
                  userData.authProvider.map((provider, idx) => (
                    <span key={idx} className="bg-(--color-surface-2) text-text px-2.5 py-1 text-xs border border-(--color-border) rounded uppercase font-semibold">
                      {provider}
                    </span>
                  ))
                ) : (
                  <span className="text-text-secondary text-sm">-</span>
                )}
              </div>
            </div>
            {userData.googleId && <InfoRow label="Google Identity Signature" value={userData.googleId} />}
            <InfoRow label="Token Generation Version" value={userData.tokenVersion?.toString()} />
          </SectionCard>


          {/* Internal Database Records Tracking */}
          <SectionCard title="System Chronology Records" icon={Database}>
            <InfoRow label="Profile Provisioned" value={formatDate(userData.createdAt)} />
            <InfoRow label="Profile Structural Modification" value={formatDate(userData.updatedAt)} />
          </SectionCard>
          
        </div>
      </div>
    </div>
  );
};

export default UserDetails;