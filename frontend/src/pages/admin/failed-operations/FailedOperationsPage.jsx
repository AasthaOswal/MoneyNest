import { useEffect, useState } from "react";
import FilterSelect from "../../../components/reusable/FilterSelect";
import toast from "react-hot-toast";
import {
  Search,
  RotateCcw,
  AlertTriangle,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Activity,
  Eye
} from "lucide-react";

// Assuming these are exported from your service file
import {
  getFailedOperations,
  retryFailedOperation,
  deleteFailedOperation
} from "../../../services/admin/failedOperation.service";
import { useNavigate } from "react-router-dom";

const FailedOperationsPage = () => {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    type: "",
    status: ""
  });

  const typeOptionns = [
    {id: "", name: "All Types"},
    {id: "cloudinary_delete", name: "Cloudinary Delete"},
    {id: "cloudinary_delete_multiple", name: "Cloudinary Delete Multiple"},
    {id: "monthly_report_email", name: "Monthly Report Email"},
    {id: "push_notification", name: "Push Notificaiton"},
    {id: "db_notification", name: "DB Notification"},
    {id: "request_log_export", name: "Request Log Export"}
  ];

  const statusOptions = [
    { id: "", name: "All Statuses" },
    { id: "pending", name: "Pending" },
    { id: "failed", name: "Failed" },
    { id: "resolved", name: "Completed" }
  ];

  const sortOptions = [
    { id: "createdAt", name: "Created At" },
    { id: "operationType", name: "Operation Type" },
    { id: "status", name: "Status" },
  ];

  const fetchOperations = async (page = 1) => {
    const toastId = toast.loading("Fetching failed operations...");

    try {
      setLoading(true);

      const response = await getFailedOperations({
        page,
        limit: 12,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        type: filters.type,
        status: filters.status
      });

      console.log(response)

      setOperations(response.data);
      setPagination(response.pagination);

      toast.success("Operations fetched successfully", {
        id: toastId,
      });
    } catch (error) {
        console.error(error.response);
      toast.error(
        error.response.data.message || "Failed to fetch operations",
        {
          id: toastId,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (id) => {
    const toastId = toast.loading("Retrying operation...");

    try {
      await retryFailedOperation(id);

      setOperations((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, status: "retrying" }
            : item
        )
      );

      toast.success("Operation retry initiated", {
        id: toastId,
      });
    } catch (error) {
      toast.error(
        error.message || "Failed to retry operation",
        {
          id: toastId,
        }
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this failed operation log?");
    if (!confirmed) return;
    
    const toastId = toast.loading("Deleting operation log...");

    try {
      await deleteFailedOperation(id);

      setOperations((prev) =>
        prev.filter((item) => item._id !== id)
      );

      toast.success("Operation log deleted successfully", {
        id: toastId,
      });
    } catch (error) {
      toast.error(
        error.message || "Failed to delete operation log",
        {
          id: toastId,
        }
      );
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      type: "",
      status: ""
    });
  };

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "failed":
        return "bg-error-bg text-error";
      case "pending":
      case "retrying":
        return "bg-warning-bg text-warning";
      case "completed":
        return "bg-success-bg text-success";
      default:
        return "bg-info-bg text-info";
    }
  };

  useEffect(() => {
    fetchOperations();
  }, []);

  return (
    <div className="bg-bg min-h-[calc(100vh-64px)] p-0 sm:p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center bg-surface p-6 rounded-2xl border border-border shadow-card">
          <div>
            <h1 className="text-2xl font-bold text-text">
              Failed Operations
            </h1>
            <p className="mt-2 text-text-secondary">
              Monitor, manage, and retry background tasks that encountered errors.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            
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
                placeholder="Request ID, message..."
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus" 
              />
            </div>

            {/* <div>
              <label className="block text-md font-semibold text-muted mb-1">
                Operation Type
              </label>
              <input
                value={filters.type}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                placeholder="e.g. EMAIL_SYNC"
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus" 
              />
            </div> */}

            <FilterSelect
              label="Type"
              value={filters.type}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, type: value }))
              }
              options={typeOptionns}
            />

            <FilterSelect
              label="Status"
              value={filters.status}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
              options={statusOptions}
            />

            <FilterSelect
              label="Sort By"
              value={filters.sortBy}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, sortBy: value }))
              }
              options={sortOptions}
            />

            <FilterSelect
              label="Order"
              value={filters.sortOrder}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, sortOrder: value }))
              }
              options={[
                { id: "desc", name: "Descending" },
                { id: "asc", name: "Ascending" },
              ]}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-text-secondary hover:bg-surface-3 transition-colors" 
            >
              <RotateCcw size={16} />
              Clear Filters
            </button>

            <button
              onClick={() => fetchOperations(1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-text-on-primary hover:bg-primary-hover transition-colors"
            >
              <Search size={16} />
              Find Operations
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 min-h-[80vh]">
          {!loading &&
            operations.map((op) => (
              <div
                key={op._id}
                className="bg-card border border-border rounded-2xl p-5 shadow-card transition-colors h-fit flex flex-col"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-text break-all">
                      {op.operationType || "Unknown Operation"}
                    </h3>
                    <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                      {op.error?.message || "No error message provided"}
                    </p>
                  </div>
                  <Activity size={18} className="text-muted shrink-0" />
                </div>

                <div className="mt-4 text-sm text-text-secondary truncate">
                  <span className="font-semibold text-muted">Req ID:</span> {op.requestId || "N/A"}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusClasses(op.status)}`}
                  >
                    {op.status ? op.status.toUpperCase() : "UNKNOWN"}
                  </span>
                </div>

                <div className="mt-4 text-xs text-muted grow">
                  {new Date(op.createdAt).toLocaleString()}
                </div>

                <div className="flex gap-2 mt-5">
                  {op.status !== "completed" && op.status !== "retrying" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetry(op._id);
                      }}
                      className="flex-1 inline-flex justify-center items-center gap-2 py-2 rounded-xl bg-primary-subtle text-primary hover:cursor-pointer hover:bg-primary-subtle/80 transition-colors"
                    >
                      <RefreshCw size={16} />
                      Retry
                    </button>
                  )}

                  {op.status === "completed" && (
                    <span className="flex-1 inline-flex justify-center items-center gap-2 py-2 rounded-xl bg-success-bg text-success cursor-default">
                      Resolved
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      navigate(`/failed-operations/${op._id}`);
                    }}
                    className="flex-1 inline-flex justify-center items-center gap-2 py-2 rounded-xl bg-primary-subtle text-primary hover:cursor-pointer hover:bg-primary-subtle/80 transition-colors"
                  >
                    <Eye size={18} />
                    View
                  </button>

                  

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(op._id);
                    }}
                    className="inline-flex justify-center items-center py-2 px-3 rounded-xl bg-error-bg text-error hover:cursor-pointer hover:bg-error-bg/80 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

          {!loading && operations.length === 0 && (
            <div className="bg-surface border w-full md:col-span-2 xl:col-span-3 h-fit border-border rounded-2xl p-12 text-center shadow-card">
              <AlertTriangle size={48} className="mx-auto text-muted mb-4" />
              <h3 className="text-lg font-semibold text-text">
                No Operations Found
              </h3>
              <p className="text-text-secondary mt-2">
                No failed operations match the selected filters.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center bg-surface border border-border rounded-2xl p-4 shadow-card">
            <button
              disabled={pagination.currentPage <= 1}
              onClick={() => fetchOperations(pagination.currentPage - 1)}
              className="p-2 rounded-xl border border-border text-text disabled:opacity-50 hover:bg-surface-2 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-text-secondary font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => fetchOperations(pagination.currentPage + 1)}
              className="p-2 rounded-xl border border-border text-text disabled:opacity-50 hover:bg-surface-2 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default FailedOperationsPage;