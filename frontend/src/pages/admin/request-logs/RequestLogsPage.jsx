import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import RequestLogService from "../../../services/admin/requestLog.service";
import FilterSelect from "../../../components/reusable/FilterSelect";

import toast from "react-hot-toast";

import {
  Search,
  RotateCcw,
  Activity,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  HardDrive,
  User,
  Calendar,
} from "lucide-react";

const RequestLogsPage = () => {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const sortOptions = [
    { id: "createdAt", name: "Created At" },
    { id: "responseTimeMs", name: "Response Time" },
    { id: "statusCode", name: "Status Code" },
  ];

  const fetchLogs = async (page = 1) => {
    const toastId = toast.loading("Fetching request logs...");

    try {
      setLoading(true);

      const response = await RequestLogService.getRequestLogs({
        page,
        limit: 12,
        search: filters.search,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      setLogs(response.data);
      setPagination(response.pagination);

      toast.success("Request logs fetched successfully", {
        id: toastId,
      });
    } catch (error) {
      toast.error(error.message || "Failed to fetch request logs", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this request log?");
    if (!confirmed) return;

    const toastId = toast.loading("Deleting request log...");

    try {
      await RequestLogService.deleteRequestLog(id);

      setLogs((prev) => prev.filter((item) => item._id !== id));

      toast.success("Request log deleted successfully", {
        id: toastId,
      });
    } catch (error) {
      toast.error(error.message || "Failed to delete request log", {
        id: toastId,
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      startDate: "",
      endDate: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const getStatusClasses = (statusCode) => {
    if (statusCode >= 500) return "bg-error-bg text-error";
    if (statusCode >= 400) return "bg-warning-bg text-warning";
    if (statusCode >= 300) return "bg-info-bg text-info";
    return "bg-success-bg text-success";
  };

  const getMethodClasses = (method) => {
    switch (method?.toUpperCase()) {
      case "GET":
        return "text-success bg-success-bg border border-success/20";
      case "POST":
        return "text-primary bg-primary-subtle border border-primary/20";
      case "PUT":
      case "PATCH":
        return "text-warning bg-warning-bg border border-warning/20";
      case "DELETE":
        return "text-error bg-error-bg border border-error/20";
      default:
        return "text-text-secondary bg-surface-2 border border-border";
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="bg-bg min-h-[calc(100vh-64px)] p-0 sm:p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-surface p-6 rounded-2xl border border-border shadow-card">
          <div>
            <h1 className="text-2xl font-bold text-text">Request Logs</h1>
            <p className="mt-2 text-text-secondary">
              Monitor and manage incoming application HTTP requests.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            
            {/* Search Input */}
            <div className="xl:col-span-1">
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
                placeholder="Email, Path, IP, Status..."
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-md font-semibold text-muted mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-md font-semibold text-muted mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus"
              />
            </div>

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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-text-secondary hover:bg-surface-3"
            >
              <RotateCcw size={16} />
              Clear Filters
            </button>

            <button
              onClick={() => fetchLogs(1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-text-on-primary hover:bg-primary-hover"
            >
              <Search size={16} />
              Show Logs
            </button>
          </div>
        </div>

        {/* Grid/Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 min-h-[80vh]">
          {!loading &&
            logs.map((log) => (
              <div
                key={log._id}
                className="bg-card border border-border rounded-2xl p-5 shadow-card transition-colors h-fit flex flex-col justify-between"
              >
                <div>
                  {/* Method & Path Endpoint Header */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex flex-col gap-2 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold tracking-wide uppercase ${getMethodClasses(log.method)}`}>
                          {log.method}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusClasses(log.statusCode)}`}>
                          {log.statusCode}
                        </span>
                      </div>
                      <h3 className="font-mono text-sm text-text font-bold break-all mt-1">
                        {log.path}
                      </h3>
                    </div>
                    <Activity size={18} className="text-muted shrink-0" />
                  </div>

                  {/* Operational Metrics Segment */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-divider text-xs text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-muted" />
                      <span>{log.responseTimeMs} ms</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HardDrive size={14} className="text-muted" />
                      <span>{log.responseSizeKb.toFixed(2)} KB</span>
                    </div>
                  </div>

                  {/* Metadata Indicators: Actor, OS/Browser info */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-surface-2 text-text max-w-full">
                      <User size={12} className="text-muted shrink-0" />
                      <span className="truncate">{log.userEmail || "Anonymous"}</span>
                    </div>

                    {log.userRole && (
                      <span className="px-2 py-1 rounded-md text-xs bg-primary-subtle text-primary capitalize">
                        {log.userRole}
                      </span>
                    )}

                    <span className="px-2 py-1 rounded-md text-xs bg-surface-2 text-text-secondary capitalize">
                      {log.deviceType}
                    </span>
                  </div>
                </div>

                {/* Footer Controls & Date Formatting */}
                <div>
                  <div className="mt-4 pt-3 border-t border-divider flex items-center gap-1.5 text-xs text-muted">
                    <Calendar size={13} />
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/request-logs/${log._id}`);
                      }}
                      className="flex-1 inline-flex justify-center items-center gap-2 py-2 rounded-xl bg-primary-subtle text-primary hover:cursor-pointer hover:bg-primary-subtle/80 transition-colors text-sm font-medium"
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(log._id);
                      }}
                      className="inline-flex justify-center items-center px-3 rounded-xl bg-error-bg text-error hover:cursor-pointer hover:bg-error-bg/80 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* Empty State Illustration Block */}
          {!loading && logs.length === 0 && (
            <div className="bg-surface border w-full md:col-span-2 xl:col-span-3 h-fit border-border rounded-2xl p-12 text-center">
              <Activity size={48} className="mx-auto text-muted mb-4" />
              <h3 className="text-lg font-semibold text-text">No Request Logs Found</h3>
              <p className="text-text-secondary mt-2">
                No telemetry parameters mapped across your specific filtering options.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Section Footer */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center bg-surface border border-border rounded-2xl p-4">
            <button
              disabled={pagination.currentPage <= 1}
              onClick={() => fetchLogs(pagination.currentPage - 1)}
              className="p-2 rounded-xl border border-border text-text disabled:opacity-50 hover:bg-surface-2 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-text-secondary text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => fetchLogs(pagination.currentPage + 1)}
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

export default RequestLogsPage;