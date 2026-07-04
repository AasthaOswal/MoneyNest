import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FamilyService from "../../../services/family.service";
import FilterSelect from "../../../components/reusable/FilterSelect";

import toast from "react-hot-toast";

import {
  Search,
  RotateCcw,
  Users,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  User,
  Calendar,
  Layers
} from "lucide-react";

const AllFamiliesPage = () => {
  const navigate = useNavigate();

  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // Aligned with the controller query parameters
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const sortOptions = [
    { id: "createdAt", name: "Created At" },
    { id: "familyName", name: "Family Name" },
  ];

  const statusOptions = [
    { id: "", name: "All Statuses" },
    { id: "active", name: "Active" },
    { id: "pendingDeletion", name: "Pending Deletion" },
    { id: "deleted", name: "Deleted" },
  ];

  const fetchFamilies = async (page = 1) => {
    const toastId = toast.loading("Fetching families...");

    try {
      setLoading(true);

      const response = await FamilyService.getAllFamilies({
        page,
        limit: 10, // Matches controller default limit
        search: filters.search || undefined,
        status: filters.status || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      // controller returns { success: true, families: [...], pagination: { page, limit, total, pages } }
      setFamilies(response.families || []);
      setPagination({
        currentPage: response.pagination.page,
        totalPages: response.pagination.pages,
      });

      toast.success("Families fetched successfully", {
        id: toastId,
      });
    } catch (error) {
      toast.error(error.message || "Failed to fetch families", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };



  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "active":
        return "bg-success-bg text-success border border-success/20";
      case "pendingDeletion":
        return "bg-warning-bg text-warning border border-warning/20";
      case "deleted":
        return "bg-error-bg text-error border border-error/20";
      default:
        return "text-text-secondary bg-surface-2 border border-border";
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  return (
    <div className="bg-bg min-h-[calc(100vh-64px)] p-0 sm:p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-surface p-6 rounded-2xl border border-border shadow-card">
          <div>
            <h1 className="text-2xl font-bold text-text">Registered Families</h1>
            <p className="mt-2 text-text-secondary">
              Review, filter, and monitor active user accounts grouped by family organizations.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div>
              <label className="block text-md font-semibold text-muted mb-1">
                Search Family Name
              </label>
              <input
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                placeholder="Family name containing..."
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus"
              />
            </div>

            {/* Status Select */}
            <FilterSelect
              label="Lifecycle Status"
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
          <div className="flex gap-3 mt-6 justify-end">
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-text-secondary hover:bg-surface-3 hover:cursor-pointer transition-colors"
            >
              <RotateCcw size={16} />
              Clear Filters
            </button>

            <button
              onClick={() => fetchFamilies(1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-text-on-primary hover:bg-primary-hover transition-colors font-medium"
            >
              <Search size={16} />
              Show Families
            </button>
          </div>

          <p className="mt-5 wrap-break-word break-all text-muted font-sm">
            Note:- Real-time searching aggregates results filtered exclusively through the <code className="font-mono bg-surface-2 px-1 rounded text-primary">familyName</code> structure.
          </p>
        </div>

        {/* Grid/Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 min-h-[50vh]">
          {!loading &&
            families.map((family) => (
              <div
                key={family._id}
                className="bg-card border border-border rounded-2xl p-5 shadow-card hover:bg-card-hover transition-colors h-fit flex flex-col justify-between"
              >
                <div>
                  {/* Status Badge & Title Header */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex flex-col gap-2 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold tracking-wide uppercase ${getStatusClasses(family.status)}`}>
                          {family.status || "active"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-text break-all mt-1">
                        {family.familyName}
                      </h3>
                    </div>
                  </div>

                  {/* Administrative Context */}
                  <div className="mt-4 pt-4 border-t border-divider flex flex-col gap-2 text-xs text-text-secondary">
                    <div className="flex items-center gap-1.5 bg-surface-2 p-2 rounded-xl">
                      <User size={14} className="text-muted shrink-0" />
                      <div className="truncate flex flex-col">
                        <span className="text-muted text-[10px] uppercase font-bold">Family Administrator</span>
                        <span className="text-text font-medium truncate">
                          {family.familyAdmin?.name || "Unassigned"}
                        </span>
                        {family.familyAdmin?.email && (
                          <span className="text-muted truncate">{family.familyAdmin.email}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Invite Token Info Block if active */}
                  {family.inviteToken && (
                    <div className="mt-3 flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs bg-primary-subtle text-primary border border-primary/10">
                      <Layers size={13} className="shrink-0" />
                      <span className="truncate font-mono">Token Active</span>
                    </div>
                  )}
                </div>

                {/* Footer Controls & Date Formatting */}
                <div>
                  <div className="mt-4 pt-3 border-t border-divider flex items-center gap-1.5 text-xs text-muted">
                    <Calendar size={13} />
                    <span>Registered: {new Date(family.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/family/${family._id}`);
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
          {!loading && families.length === 0 && (
            <div className="bg-surface border w-full md:col-span-2 xl:col-span-3 h-fit border-border rounded-2xl p-12 text-center">
              <Users size={48} className="mx-auto text-muted mb-4" />
              <h3 className="text-lg font-semibold text-text">No Families Located</h3>
              <p className="text-text-secondary mt-2">
                No system organization records were captured matching your designated filters.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Section Footer */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center bg-surface border border-border rounded-2xl p-4">
            <button
              disabled={pagination.currentPage <= 1}
              onClick={() => fetchFamilies(pagination.currentPage - 1)}
              className="p-2 rounded-xl border border-border text-text disabled:opacity-50 hover:bg-surface-2 transition-colors disabled:hover:bg-transparent"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-text-secondary text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => fetchFamilies(pagination.currentPage + 1)}
              className="p-2 rounded-xl border border-border text-text disabled:opacity-50 hover:bg-surface-2 transition-colors disabled:hover:bg-transparent"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AllFamiliesPage;