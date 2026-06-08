import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

import ErrorLogService from "../../../services/admin/errorLog.service";

const ErrorLogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [errorLog, setErrorLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    fetchErrorLog();
  }, [id]);

  const fetchErrorLog = async () => {
    try {
      setLoading(true);

      const data = await ErrorLogService.getErrorLogById(id);

      setErrorLog(data);
    } catch (error) {
      toast.error(
        error?.message || "Failed to fetch error log"
      );

      navigate("/admin/error-logs");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    try {
      setResolving(true);

      const response =
        await ErrorLogService.resolveError(id);

      toast.success(
        response?.message || "Error resolved"
      );

    //   fetchErrorLog();

    setErrorLog(response.data);

    } catch (error) {
      toast.error(
        error?.message || "Failed to resolve error"
      );
    } finally {
      setResolving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this error log?"
    );

    if (!confirmed) return;

    try {
      const response =
        await ErrorLogService.deleteErrorLog(id);

      toast.success(
        response?.message || "Error deleted"
      );

      navigate("/error-logs");
    } catch (error) {
      toast.error(
        error?.message || "Failed to delete error"
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  const InfoRow = ({ label, value }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-3 border-b border-(--color-border) last:border-b-0">
      <p className="text-text-secondary text-sm">
        {label}
      </p>

      <div className="md:col-span-2 text-text wrap-break-word">
        {value || "-"}
      </div>
    </div>
  );

  const SectionCard = ({ title, children }) => (
    <div className="bg-(--color-card) border border-(--color-border) rounded-xl p-5 shadow-(--shadow-card)">
      <h2 className="text-lg font-semibold text-text mb-4">
        {title}
      </h2>

      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 text-text">
        Loading...
      </div>
    );
  }

  if (!errorLog) {
    return (
      <div className="p-6 text-text">
        Error log not found
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>


          <h1 className="text-2xl font-bold text-text">
            Error Log Details
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">

          {!errorLog.isResolved && (
            <button
              onClick={handleResolve}
              disabled={resolving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-success-bg) text-(--color-success) border border-(--color-border) hover:cursor-pointer hover:bg-success-bg/80"
            >
              <ShieldCheck size={18} />
              Resolve
            </button>
          )}

          {errorLog.isResolved && errorLog.isResolved==true && (
            <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-success-bg) text-(--color-success) border border-(--color-border)">Already Resolved</span>
          )}

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-error-bg) text-(--color-error) border border-(--color-border) hover:cursor-pointer hover:bg-error-bg/80"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Status */}

      <div className="flex flex-wrap gap-3">

        <span className="px-3 py-1 rounded-full bg-warning-bg text-warning text-sm">
          Severity: {errorLog.severity}
        </span>

        <span className="px-3 py-1 rounded-full bg-(--color-info-bg) text-(--color-info) text-sm">
          {errorLog.environment}
        </span>

        {errorLog.isResolved ? (
          <span className="px-3 py-1 rounded-full bg-(--color-success-bg) text-(--color-success) text-sm flex items-center gap-1">
            <CheckCircle size={14} />
            Resolved
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-(--color-error-bg) text-(--color-error) text-sm flex items-center gap-1">
            <AlertTriangle size={14} />
            Unresolved
          </span>
        )}
      </div>

      {/* Error Information */}

      <SectionCard title="Error Information">
        <InfoRow
          label="Error Name"
          value={errorLog.errorName}
        />

        <InfoRow
          label="Message"
          value={errorLog.message}
        />

        <div className="pt-4">
          <p className="text-sm text-text-secondary mb-2">
            Stack Trace
          </p>

          <pre className="bg-(--color-input-bg) border border-(--color-border) rounded-lg p-4 text-sm overflow-auto text-text whitespace-pre-wrap">
            {errorLog.stack || "-"}
          </pre>
        </div>
      </SectionCard>

      {/* Request Information */}

      <SectionCard title="Request Information">
        <InfoRow
          label="Request ID"
          value={errorLog.requestId}
        />

        <InfoRow
          label="Method"
          value={errorLog.method}
        />

        <InfoRow
          label="Path"
          value={errorLog.path}
        />

        <InfoRow
          label="IP Address"
          value={errorLog.ip}
        />

        <InfoRow
          label="User ID"
          value={errorLog.userId}
        />
      </SectionCard>

      {/* System Information */}

      <SectionCard title="System Information">
        <InfoRow
          label="Severity"
          value={errorLog.severity}
        />

        <InfoRow
          label="Environment"
          value={errorLog.environment}
        />

        <InfoRow
          label="Fingerprint"
          value={errorLog.errorFingerprint}
        />
      </SectionCard>

      {/* Tracking Information */}

      <SectionCard title="Tracking Information">
        <InfoRow
          label="Occurrence Count"
          value={errorLog.occurrenceCount}
        />

        <InfoRow
          label="First Occurred"
          value={formatDate(
            errorLog.firstOccurredAt
          )}
        />

        <InfoRow
          label="Last Occurred"
          value={formatDate(
            errorLog.lastOccurredAt
          )}
        />

        <InfoRow
          label="Created At"
          value={formatDate(
            errorLog.createdAt
          )}
        />

        <InfoRow
          label="Updated At"
          value={formatDate(
            errorLog.updatedAt
          )}
        />
      </SectionCard>

      {/* Resolution Information */}

      <SectionCard title="Resolution Information">
        <InfoRow
          label="Resolved"
          value={
            errorLog.isResolved
              ? "Yes"
              : "No"
          }
        />

        <InfoRow
          label="Resolved At"
          value={formatDate(
            errorLog.resolvedAt
          )}
        />

        <InfoRow
          label="Resolved By"
          value={
            errorLog.resolvedBy
              ? `${errorLog.resolvedBy.name} (${errorLog.resolvedBy.email})`
              : "-"
          }
        />
      </SectionCard>

      {/* Resolution History */}

      <SectionCard title="Resolution History">
        {errorLog.resolutionHistory?.length ? (
          <div className="space-y-4">
            {errorLog.resolutionHistory.map(
              (history, index) => (
                <div
                  key={index}
                  className="border border-(--color-border) rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <Clock
                      size={18}
                      className="text-(--color-primary) mt-1"
                    />

                    <div>
                      <p className="text-text">
                        Resolved by{" "}
                        <span className="font-medium">
                          {
                            history.resolvedBy
                              ?.name
                          }
                        </span>
                      </p>

                      <p className="text-sm text-text-secondary">
                        {
                          history.resolvedBy
                            ?.email
                        }
                      </p>

                      <p className="text-sm text-text-secondary mt-1">
                        {formatDate(
                          history.resolvedAt
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-text-secondary">
            No resolution history available.
          </p>
        )}
      </SectionCard>
    </div>
  );
};

export default ErrorLogDetails;