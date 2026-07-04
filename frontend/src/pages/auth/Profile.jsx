import React from "react";
import { User, Mail, Shield, Calendar, Bell, Lock, LogOut, Trash2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* Header */}
      <div className="bg-surface border border-border rounded-2xl shadow-card p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">

          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-text-on-primary">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* User Details */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text">
              {user?.name || "Unknown User"}
            </h1>

            <p className="text-muted mt-1">
              {user?.email}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">

              <span className="px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold uppercase">
                {user?.role}
              </span>



            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-surface border border-border rounded-2xl shadow-card">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-text">
            Account Information
          </h2>
        </div>

        <div className="divide-y divide-border">

          <InfoRow
            icon={<User size={18} />}
            label="Full Name"
            value={user?.name || "-"}
          />

          <InfoRow
            icon={<Mail size={18} />}
            label="Email Address"
            value={user?.email || "-"}
          />

          <InfoRow
            icon={<Shield size={18} />}
            label="Role"
            value={user?.role || "-"}
          />
{/* 
          <InfoRow
            icon={<Calendar size={18} />}
            label="Joined"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "-"
            }
          /> */}

        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-border rounded-2xl shadow-card">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-text">
            Account Settings
          </h2>
        </div>

        <div className="p-5 flex flex-col gap-4">

          <button
            className="
              flex items-center gap-3
              border border-border
              bg-card
              hover:bg-card-hover
              rounded-xl
              px-4 py-4
              transition
              hover:cursor-pointer
            "

            onClick={()=>navigate("/settings/push-notifications")}
          >
            <Bell className="text-primary" size={18} />
            <div className="text-left">
              <p className="text-text font-medium">
                Notifications
              </p>
              <p className="text-muted text-sm">
                Manage push notifications
              </p>
            </div>
          </button>

            {/* Leave Family Button */}
            <button
            className="
                flex items-center gap-3
                border border-border
                bg-card
                hover:bg-card-hover
                rounded-xl
                px-4 py-4
                transition
                hover:cursor-pointer
            "
            onClick={() => navigate("/family/leave")}
            >
                <LogOut className="text-primary" size={18} />

                <div className="text-left">
                    <p className="text-text font-medium">
                    Leave Family
                    </p>

                    <p className="text-muted text-sm">
                    Exit your current family group
                    </p>
                </div>
            </button>


            {/* Delete Account Button */}
            <button
            className="
                flex items-center gap-3
                border border-border
                bg-error-bg/50
                hover:bg-error-bg/80
                rounded-xl
                px-4 py-4
                transition
                hover:cursor-pointer
            "
            onClick={() => navigate("/request-account-delete")}
            >
                <Trash2 className="text-error" size={18} />

                <div className="text-left">
                    <p className="text-text font-medium">
                    Delete Account
                    </p>

                    <p className="text-muted text-sm">
                    Send Request to admin to delete your account.
                    </p>
                </div>
            </button>

        </div>
      </div>

    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-5">
    <div className="flex items-center gap-3 text-muted">
      {icon}
      <span>{label}</span>
    </div>

    <span className="text-text font-medium">
      {value}
    </span>
  </div>
);

export default ProfilePage;