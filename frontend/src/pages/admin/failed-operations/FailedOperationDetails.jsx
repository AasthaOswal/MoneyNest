import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database
} from "lucide-react";
import toast from "react-hot-toast";

// Assuming you have exported these from your service file. 
// You'll need to add a getFailedOperationById method to it!
import {
  getFailedOperationById,
  retryFailedOperation,
  deleteFailedOperation
} from "../../../services/admin/failedOperation.service";

const FailedOperationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [operation, setOperation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    fetchOperation();
  }, [id]);

  const fetchOperation = async () => {
    setLoading(true);
    try {
      const res = await getFailedOperationById(id);
      console.log(res)
      setOperation(res.data);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to fetch operation details");
      setLoading(false)
      navigate("/failed-operations");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    try {
      setRetrying(true);
      const response = await retryFailedOperation(id);
      toast.success(response?.message || "Operation retried successfully");
      
      // Update state directly or refetch. Assuming response.data returns the updated operation.
      await fetchOperation();
    } catch (error) {
      console.log(error.response)
      toast.error(error?.response?.data?.message || "Failed to retry operation");
    } finally {
      setRetrying(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this failed operation?");
    if (!confirmed) return;

    try {
      const response = await deleteFailedOperation(id);
      toast.success(response?.message || "Operation deleted successfully");
      navigate("/failed-operations");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to delete operation");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  const InfoRow = ({ label, value }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-3 border-b border-(--color-border) last:border-b-0">
      <p className="text-text-secondary text-sm">{label}</p>
      <div className="md:col-span-2 text-text wrap-break-word">
        {value || "-"}
      </div>
    </div>
  );

  const SectionCard = ({ title, children }) => (
    <div className="bg-(--color-card) border border-(--color-border) rounded-xl p-5 shadow-(--shadow-card)">
      <h2 className="text-lg font-semibold text-text mb-4">{title}</h2>
      {children}
    </div>
  );

  if (loading) {
    return <div className="p-6 text-text">Loading operation details...</div>;
  }

  if (!operation) {
    return <div className="p-6 text-text">Failed operation not found</div>;
  }

  // Derived status for UI toggles
  const isResolved =
  operation.status?.toLowerCase() === "resolved" ||
  operation.status?.toLowerCase() === "success";

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-lg text-text-secondary hover:bg-(--color-surface-2) transition-colors hover:cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-text">Failed Operation Details</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isResolved && (
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-primary-subtle) text-(--color-primary) border border-(--color-primary-subtle) hover:cursor-pointer hover:bg-(--color-primary)/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw size={18} className={retrying ? "animate-spin" : ""} />
              {retrying ? "Retrying..." : "Retry Operation"}
            </button>
          )}

          {isResolved && (
            <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-success-bg) text-(--color-success) border border-(--color-border)">
              <CheckCircle size={18} />
              Operation Resolved
            </span>
          )}

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-error-bg) text-(--color-error) border border-(--color-border) hover:cursor-pointer hover:bg-(--color-error-bg)/80 transition-colors"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex flex-wrap gap-3">
        {isResolved ? (
          <span className="px-3 py-1 rounded-full bg-(--color-success-bg) text-(--color-success) text-sm flex items-center gap-1 font-medium">
            <CheckCircle size={14} />
            Resolved
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-(--color-error-bg) text-(--color-error) text-sm flex items-center gap-1 font-medium">
            <AlertTriangle size={14} />
            Failed
          </span>
        )}
        
        <span className="px-3 py-1 rounded-full bg-surface-3 text-text text-sm border border-(--color-border)">
          Type: {operation.operationType || "UNKNOWN"}
        </span>

        {operation.retryCount > 0 && (
          <span className="px-3 py-1 rounded-full bg-warning-bg text-warning text-sm border border-warning-bg">
            Retries: {operation.retryCount}
          </span>
        )}
      </div>

      {/* Primary Operation Information */}
      <SectionCard title="Operation Overview">
        <InfoRow label="Operation ID" value={operation.id || operation._id} />
        <InfoRow label="Operation Type" value={operation.operationType} />
        <InfoRow label="Target Entity ID" value={operation.entityId || "N/A"} />
        <InfoRow label="Target Entity Type" value={operation.entityType || "N/A"} />
      </SectionCard>

      {/* Tracking and Timeline */}
      <SectionCard title="Tracking & Timeline">
        <InfoRow label="Current Status" value={operation.status} />
        <InfoRow label="Retry Count" value={`${operation.retryCount || 0} / ${operation.maxRetries || '∞'}`} />
        <InfoRow label="First Attempted At" value={formatDate(operation.createdAt)} />
        <InfoRow label="Last Attempted At" value={formatDate(operation.updatedAt || operation.lastAttemptedAt)} />
        {operation.nextRetryAt && !isResolved && (
          <InfoRow label="Scheduled Next Retry" value={formatDate(operation.nextRetryAt)} />
        )}
      </SectionCard>


      {/* Payload Data */}
      <SectionCard title="Operation Payload">
        <div className="flex items-center gap-2 mb-3 text-text-secondary">
          <Database size={16} />
          <span className="text-sm">Data passed during the initial operation</span>
        </div>
        <pre className="bg-(--color-input-bg) border border-(--color-border) rounded-lg p-4 text-sm overflow-auto text-text whitespace-pre-wrap font-mono">
          {operation.payload 
            ? JSON.stringify(operation.payload, null, 2) 
            : "No payload data stored."}
        </pre>
      </SectionCard>



      {/* Error Details */}
      <SectionCard title="Failure Details">
        <InfoRow label="Last Error Message" value={operation.error?.message} />
        
        <div className="pt-4">
          <p className="text-sm text-text-secondary mb-2">Error Stack / Details</p>
          <pre className="bg-(--color-input-bg) border border-(--color-border) rounded-lg p-4 text-sm overflow-auto text-text whitespace-pre-wrap font-mono">
            {operation.error?.stack || "No additional error details available."}
          </pre>
        </div>
      </SectionCard>



      {/* Retry History (If your schema supports it) */}
      {operation.retryHistory && operation.retryHistory.length > 0 && (
        <SectionCard title="Retry History">
          <div className="space-y-4">
            {operation.retryHistory.map((history, index) => (
              <div key={index} className="border border-(--color-border) rounded-lg p-4 bg-(--color-surface-2)">
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-(--color-primary) mt-1" />
                  <div>
                    <p className="text-text font-medium">
                      Attempt #{history.attemptNumber || index + 1}
                    </p>
                    <p className="text-sm text-(--color-error) mt-1">
                      {history.errorMessage || "Failed"}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      {formatDate(history.attemptedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}


          </div>
        </SectionCard>

        
      )}

    </div>
  );
};

export default FailedOperationDetails;