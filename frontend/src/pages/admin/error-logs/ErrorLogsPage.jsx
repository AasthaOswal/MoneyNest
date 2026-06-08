import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ErrorLogService from "../../../services/admin/errorLog.service";
import FilterSelect from "../../../components/reusable/FilterSelect";

import toast from "react-hot-toast";

import {
  Search,
  RotateCcw,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ErrorLogsPage = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    severity: "",
    isResolved: "",
    environment: ""
  });

  const severityOptions = [
    { id: "", name: "All Severities" },
    { id: "low", name: "Low" },
    { id: "medium", name: "Medium" },
    { id: "high", name: "High" },
    { id: "critical", name: "Critical" },
  ];

  const sortOptions = [
    { id: "createdAt", name: "Created At" },
    { id: "occurrenceCount", name: "Occurrences" },
    { id: "lastOccurredAt", name: "Last Occurred" },
  ];

  const isResolvedOptions = [
    {id: true, name: "Resolved"},
    {id: false, name: "Not Resolved"}
  ];

  const environmentOptions = [
    {id:"development", name: "Development"},
    {id: "production", name:"Production"}
  ];

  const fetchErrors = async (page = 1) => {
    const toastId = toast.loading(
      "Fetching error logs..."
    );

    try {
      setLoading(true);
      console.log(filters)

      const response =
        await ErrorLogService.getErrorLogs({
          page,
          limit: 12,
          search: filters.search,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          severity: filters.severity,
          environment:filters.environment,
          isResolved:filters.isResolved
        });

        console.log(response.data);
      setErrors(response.data);

      setPagination(response.pagination);

      toast.success(
        "Error logs fetched successfully",
        {
          id: toastId,
        }
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to fetch error logs",
        {
          id: toastId,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    const toastId = toast.loading(
      "Resolving error..."
    );

    try {
      await ErrorLogService.resolveError(id);

      setErrors((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                isResolved: true,
              }
            : item
        )
      );

      toast.success(
        "Error resolved successfully",
        {
          id: toastId,
        }
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to resolve error",
        {
          id: toastId,
        }
      );
    }
  };

  const handleDelete = async (id) => {
    const toastId = toast.loading(
      "Deleting error log..."
    );

    try {
      await ErrorLogService.deleteErrorLog(id);

      setErrors((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      toast.success(
        "Error log deleted successfully",
        {
          id: toastId,
        }
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to delete error log",
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
      severity: "",
      environment: "",
      isResolved: ""
    });

  };

  const getSeverityClasses = (severity) => {
    switch (severity) {
      case "critical":
      case "high":
        return "bg-error-bg text-error";

      case "medium":
        return "bg-warning-bg text-warning";

      default:
        return "bg-info-bg text-info";
    }
  };

  useEffect(() => {
    fetchErrors();
  }, []);

  return (
    <div className="bg-bg min-h-[calc(100vh-64px)] p-0 sm:p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-6">

        {/* Header */}

        <div className="flex justify-between items-center bg-surface p-6 rounded-2xl border border-border shadow-card">

          <div>
            <h1 className="text-2xl font-bold text-text">
              Error Logs
            </h1>

            <p className="mt-2 text-text-secondary">
              Monitor and manage
              application errors.
            </p>
          </div>

        </div>

        {/* Filters */}

        <div className="bg-surface p-6 rounded-2xl border border-border shadow-card">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

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
                placeholder="Error name, message..."
                className=" w-full p-2.5 border  border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus " />
            </div>

            <FilterSelect
              label="Severity"
              value={filters.severity}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  severity: value,
                }))
              }
              options={severityOptions}
            />

            <FilterSelect
              label="Resolved"
              value={filters.isResolved}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  isResolved: value,
                }))
              }
              options={isResolvedOptions}
            />

            <FilterSelect
              label="Environment"
              value={filters.environment}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  environment: value,
                }))
              }
              options={environmentOptions}
            />

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
                {
                  id: "desc",
                  name: "Descending",
                },
                {
                  id: "asc",
                  name: "Ascending",
                },
              ]}
            />
          </div>

          <div className="flex gap-3 mt-6">

            <button
              onClick={clearFilters}
              className=" inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-text-secondary hover:bg-surface-3" >
              <RotateCcw size={16} />
              Clear Filters
            </button>

            <button
              onClick={() =>
                fetchErrors(1)
              }
              className=" inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-text-on-primary hover:bg-primary-hover ">
              <Search size={16} />
              Show Errors
            </button>

          </div>
        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 min-h-[80vh]">

          {!loading &&
            errors.map((error) => (
              <div
                key={error._id}
                className=" bg-card border border-border rounded-2xl p-5 shadow-card transition-colors h-fit">
                <div className="flex justify-between items-start gap-3">

                  <div>
                    <h3 className="font-bold text-text">
                      {error.errorName}
                    </h3>

                    <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                      {error.message}
                    </p>
                  </div>

                  <AlertTriangle
                    size={18}
                    className="text-error"
                  />

                </div>

                <div className="mt-4 text-sm text-text-secondary">
                  {error.method}{" "}
                  {error.path}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">

                  <span
                    className={`
                      px-2 py-1 rounded-md text-xs font-medium
                      ${getSeverityClasses(
                        error.severity
                      )}
                    `}
                  >
                    {error.severity}
                  </span>

                  <span className=" px-2 py-1 rounded-md text-xs bg-surface-2 text-text ">
                    {error.occurrenceCount} times
                    
                  </span>

                  {error.isResolved && (
                    <span
                      className=" px-2 py-1 rounded-md text-xs bg-success-bg text-success"
                    >
                      Resolved
                    </span>
                  )}
                </div>

                <div className="mt-4 text-xs text-muted">
                  {new Date(
                    error.createdAt
                  ).toLocaleString()}
                </div>

                <div className="flex gap-2 mt-5">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/error-logs/${error._id}`
                      );
                    }}
                    className=" flex-1 inline-flex justify-center items-center gap-2 py-2 rounded-xl bg-primary-subtle text-primary hover:cursor-pointer hover:bg-primary-subtle/70"
                  >
                    <Eye size={16} />
                    View
                  </button>

                  {!error.isResolved && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolve(
                          error._id
                        );
                      }}
                      className=" inline-flex justify-center items-center px-3 rounded-xl bg-success-bg text-success hover:cursor-pointer hover:bg-success-bg/70"
                    >

                      Mark as Resolved
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(
                        error._id8
                      );
                    }}
                    className=" inline-flex justify-center items-center px-3 rounded-xl bg-error-bg text-error hover:cursor-pointer hover:bg-error-bg/70"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>
              </div>
            ))}


            {!loading && errors.length === 0 && (
                <div className="bg-surface border w-full md:col-span-2 xl:col-span-3 h-fit border-border rounded-2xl p-12 text-center">
                <AlertTriangle
                    size={48}
                    className="mx-auto text-muted mb-4"
                />

                <h3 className="text-lg font-semibold text-text">
                    No Error Logs Found
                </h3>

                <p className="text-text-secondary mt-2">
                    No errors match the
                    selected filters.
                </p>
                </div>
            )}
        </div>



        {/* Pagination */}

        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center bg-surface border border-border rounded-2xl p-4">

            <button
              disabled={
                pagination.currentPage <= 1
              }
              onClick={() =>
                fetchErrors(
                  pagination.currentPage - 1
                )
              }
              className=" p-2 rounded-xl border border-border text-text disabled:opacity-50
              "
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-text-secondary">
              Page{" "}
              {pagination.currentPage}
              {" "}of{" "}
              {pagination.totalPages}
            </span>

            <button
              disabled={
                pagination.currentPage >=
                pagination.totalPages
              }
              onClick={() =>
                fetchErrors(
                  pagination.currentPage + 1
                )
              }
              className=" p-2 rounded-xl border border-border text-text disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default ErrorLogsPage;