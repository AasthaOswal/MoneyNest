import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Trash2,
  Activity,
  Globe,
  User,
  Monitor,
  Database
} from "lucide-react";
import toast from "react-hot-toast";

import RequestLogService from "../../../services/admin/requestLog.service";

const RequestLogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [requestLog, setRequestLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestLog();
  }, [id]);

  const fetchRequestLog = async () => {
    try {
      setLoading(true);

      const response = await RequestLogService.getRequestLogById(id);
      
      // Handle the nested data structure from your backend { success: true, data: log }
      setRequestLog(response?.data || response);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch request log");
      navigate("/admin/request-logs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this request log?");

    if (!confirmed) return;

    try {
      const response = await RequestLogService.deleteRequestLog(id);

      toast.success(response?.message || "Request log deleted");
      navigate("/admin/request-logs");
    } catch (error) {
      toast.error(error?.message || "Failed to delete request log");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  const getStatusColor = (statusCode) => {
    if (!statusCode) return "bg-(--color-surface-3) text-(--color-text)";
    if (statusCode >= 200 && statusCode < 300) {
      return "bg-(--color-success-bg) text-(--color-success)";
    }
    if (statusCode >= 300 && statusCode < 400) {
      return "bg-(--color-info-bg) text-(--color-info)";
    }
    if (statusCode >= 400 && statusCode < 500) {
      return "bg-(--color-warning-bg) text-(--color-warning)";
    }
    return "bg-(--color-error-bg) text-(--color-error)";
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

  if (!requestLog) {
    return <div className="p-6 text-text">Request log not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">
            Request Log Details
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-error-bg) text-(--color-error) border border-(--color-border) hover:cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-3">
        <span className="px-3 py-1 rounded-full bg-surface-3 text-text text-sm font-medium border border-(--color-border)">
          {requestLog.method}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border border-(--color-border) ${getStatusColor(
            requestLog.statusCode
          )}`}
        >
          Status: {requestLog.statusCode}
        </span>

        <span className="px-3 py-1 rounded-full bg-(--color-info-bg) text-(--color-info) text-sm font-medium border border-(--color-border)">
          {requestLog.actorType === "authenticated"
            ? "Authenticated"
            : "Anonymous"}
        </span>

        <span className="px-3 py-1 rounded-full bg-surface-3 text-text-secondary text-sm border border-(--color-border)">
          {requestLog.responseTimeMs} ms
        </span>
      </div>

      {/* Grid Layout for details */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* General Information */}
          <SectionCard title="General Information" icon={Activity}>
            <InfoRow label="Request ID" value={requestLog.requestId} />
            <InfoRow label="Path" value={requestLog.path} />
            <InfoRow label="Method" value={requestLog.method} />
            <InfoRow label="Status Code" value={requestLog.statusCode} />
            <InfoRow
              label="Response Time"
              value={`${requestLog.responseTimeMs} ms`}
            />
            <InfoRow
              label="Response Size"
              value={`${requestLog.responseSizeKb} KB`}
            />
          </SectionCard>

          {/* User Details */}
          <SectionCard title="User Details" icon={User}>
            <InfoRow
              label="Actor Type"
              value={requestLog.actorType}
            />
            <InfoRow
              label="User ID"
              value={
                requestLog.userId?._id || requestLog.userId || "N/A"
              }
            />
            <InfoRow
              label="User Name"
              value={requestLog.userId?.name || "-"}
            />
            <InfoRow
              label="User Email"
              value={requestLog.userEmail || requestLog.userId?.email || "-"}
            />
            <InfoRow label="User Role" value={requestLog.userRole} />
          </SectionCard>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Client & Device Information */}
          <SectionCard title="Client Information" icon={Monitor}>
            <InfoRow label="IP Address" value={requestLog.ip} />
            <InfoRow label="Device Type" value={requestLog.deviceType} />
            <InfoRow
              label="Browser"
              value={
                requestLog.browser
                  ? `${requestLog.browser} ${requestLog.browserVersion || ""}`
                  : "-"
              }
            />
            <InfoRow
              label="Operating System"
              value={
                requestLog.os
                  ? `${requestLog.os} ${requestLog.osVersion || ""}`
                  : "-"
              }
            />
            <div className="py-3 border-b border-(--color-border) last:border-b-0">
              <p className="text-text-secondary text-sm mb-1">
                User Agent
              </p>
              <div className="bg-(--color-input-bg) border border-(--color-border) rounded p-3 text-sm text-text wrap-break-word">
                {requestLog.userAgent || "-"}
              </div>
            </div>
          </SectionCard>

          {/* Network Information */}
          <SectionCard title="Network & Source" icon={Globe}>
            <InfoRow label="Origin" value={requestLog.origin} />
            <InfoRow label="Origin Type" value={requestLog.originType} />
            <div className="py-3 border-b border-(--color-border) last:border-b-0">
              <p className="text-text-secondary text-sm mb-1">
                Referer
              </p>
              <div className="bg-(--color-input-bg) border border-(--color-border) rounded p-3 text-sm text-text wrap-break-word">
                {requestLog.referer || "-"}
              </div>
            </div>
          </SectionCard>

          {/* Timestamps */}
          <SectionCard title="System Tracking" icon={Database}>
            <InfoRow
              label="Created At"
              value={formatDate(requestLog.createdAt)}
            />
            <InfoRow
              label="Updated At"
              value={formatDate(requestLog.updatedAt)}
            />
          </SectionCard>
          
        </div>
      </div>
    </div>
  );
};

export default RequestLogDetails;