import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// API Import mapping to your axios services
import { getAllUsers } from "../../../services/user.service"; // Adjust path according to your structure
import FilterSelect from "../../../components/reusable/FilterSelect";

import toast from "react-hot-toast";

import {
  Search,
  RotateCcw,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Shield,
  Mail,
  UserCheck
} from "lucide-react";

const AllUsersPage = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    status: "active",
  });

  const sortOptions = [
    { id: "createdAt", name: "Join Date" },
    { id: "name", name: "Name" },
    { id: "email", name: "Email" },
  ];

  const statusOptions = [
    { id: "", name: "All Usess" },
    { id: "active", name: "Active" },
    { id: "pendingDeletion", name: "Pending Delete" },
    { id: "deleted", name: "Deleted" },
  ];

  const roleOptions = [
    { id: "", name: "All Roles" },
    { id: "admin", name: "Admin" },
    { id: "member", name: "Member" },
    { id: "familyAdmin", name: "FamilyAdmin" },
  ];

  const fetchUsers = async (page = 1) => {
    const toastId = toast.loading("Fetching platform users...");

    try {
        setLoading(true);

        const response = await getAllUsers({
        page,
        limit: 12,
        search: filters.search,
        role: filters.role || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        status: filters.status
        });

        // 1. Change response.data to response.users to match your API JSON structure
        setUsers(response.users || []);
        
        // 2. Adjust pagination based on how your backend sends totalPages/currentPage.
        // If your backend doesn't send a explicit "pagination" object, you might need to map it:


        // Change this line in your frontend fetchUsers function:
        setPagination({ 
        currentPage: response.pagination?.page || page, 
        totalPages: response.pagination?.pages || 1 
        });

        toast.success("Users records loaded successfully", {
        id: toastId,
        });
    } catch (error) {
        toast.error(error.message || "Failed to fetch platform users", {
        id: toastId,
        });
    } finally {
        setLoading(false);
    }
    };

  const clearFilters = () => {
    setFilters({
      search: "",
      role: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      status: "active"
    });
  };

  const getRoleClasses = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "text-warning bg-warning-bg border border-warning/20";
      case "user":
        return "text-primary bg-primary-subtle border border-primary/20";
      default:
        return "text-text-secondary bg-surface-2 border border-border";
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-bg min-h-[calc(100vh-64px)] p-0 sm:p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-surface p-6 rounded-2xl border border-border shadow-card">
          <div>
            <h1 className="text-2xl font-bold text-text">Platform Users</h1>
            <p className="mt-2 text-text-secondary">
              Review configuration matrix, status tracking, and account management for users.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div>
              <label className="block text-md font-semibold text-muted mb-1">
                Search
              </label>
              <input
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                placeholder="Search by Name, Email, ID..."
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus"
              />
            </div>

            {/* Role Filter Option */}
            <FilterSelect
              label="Role"
              value={filters.role}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  role: value,
                }))
              }
              options={roleOptions}
            />

            {/* Status Filter Option */}
            <FilterSelect
              label="Status"
              value={filters.status}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value,
                }))
              }
              options={statusOptions}
            />

            {/* Sort By */}
            <FilterSelect
              label="Sort By"
              value={filters.sortBy}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: value,
                }))
              }
              options={sortOptions}
            />

            {/* Sort Order */}
            <FilterSelect
              label="Order"
              value={filters.sortOrder}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  sortOrder: value,
                }))
              }
              options={[
                { id: "desc", name: "Descending" },
                { id: "asc", name: "Ascending" },
              ]}
            />
          </div>

          {/* Filter Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-text-secondary hover:bg-surface-3 hover:cursor-pointer transition-colors"
            >
              <RotateCcw size={16} />
              Clear Filters
            </button>

            <button
              onClick={() => fetchUsers(1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-text-on-primary hover:bg-primary-hover font-medium ml-auto"
            >
              <Search size={16} />
              Search Users
            </button>
          </div>

          <p className="mt-5 wrap-break-word break-all text-muted font-sm">
            Note:- Advanced Query Filtering evaluates records utilizing Name indexes, deep User ID targets, and direct Email configurations.
          </p>
        </div>

        {/* Grid/Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 min-h-[50vh]">
          {!loading &&
            users.map((user) => (
              <div
                key={user._id}
                className="bg-card border border-border rounded-2xl p-5 shadow-card transition-colors h-fit flex flex-col justify-between hover:bg-card-hover"
              >
                <div>
                  {/* Role Header Status info */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex flex-col gap-2 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold tracking-wide uppercase ${getRoleClasses(user.role)}`}>
                          {user.role || "User"}
                        </span>
                        {user.isVerified && (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-success-bg text-success flex items-center gap-1">
                            <UserCheck size={12} /> Verified
                          </span>
                        )}
                      </div>
                      <h3 className="text-md text-text font-bold break-all mt-1">
                        {user.name || "Unnamed User"}
                      </h3>
                    </div>
                  </div>

                  {/* Core Account Identifiers Segment */}
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-divider text-xs text-text-secondary">
                    <div className="flex items-center gap-1.5 break-all">
                      <Mail size={14} className="text-muted shrink-0" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted">
                      <Shield size={14} className="shrink-0" />
                      <span className="font-mono text-[11px] truncate">ID: {user._id}</span>
                    </div>
                  </div>

                </div>

                {/* Footer Actions & Navigation Mapping */}
                <div>
                  <div className="mt-4 pt-3 border-t border-divider flex items-center gap-1.5 text-xs text-muted">
                    <Calendar size={13} />
                    <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/all-users/${user._id}`);
                      }}
                      className="flex-1 inline-flex justify-center items-center gap-2 py-2 rounded-xl bg-primary-subtle text-primary hover:cursor-pointer hover:bg-primary-subtle/80 transition-colors text-sm font-medium"
                    >
                      <Eye size={16} />
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* Empty State Illustration Block */}
          {!loading && users.length === 0 && (
            <div className="bg-surface border w-full md:col-span-2 xl:col-span-3 h-fit border-border rounded-2xl p-12 text-center">
              <Users size={48} className="mx-auto text-muted mb-4" />
              <h3 className="text-lg font-semibold text-text">No Users Found</h3>
              <p className="text-text-secondary mt-2">
                No user profiles mapped across your current active filtration metrics.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Section Footer */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center bg-surface border border-border rounded-2xl p-4">
            <button
              disabled={pagination.currentPage <= 1}
              onClick={() => fetchUsers(pagination.currentPage - 1)}
              className="p-2 rounded-xl border border-border text-text disabled:opacity-50 hover:bg-surface-2 transition-colors hover:cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-text-secondary text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => fetchUsers(pagination.currentPage + 1)}
              className="p-2 rounded-xl border border-border text-text disabled:opacity-50 hover:bg-surface-2 transition-colors hover:cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AllUsersPage;