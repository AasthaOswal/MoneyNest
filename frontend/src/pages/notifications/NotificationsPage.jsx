import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationService from "../../services/notification.service";
import FilterSelect from "../../components/reusable/FilterSelect";
import toast from "react-hot-toast";
import {
  Bell,
  CheckSquare,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RotateCcw,
  SlidersHorizontal,
  Inbox
} from "lucide-react";

const NotificationsPage = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const [filters, setFilters] = useState({
    unreadOnly: "false",
  });

  const fetchNotifications = async (page = 1) => {
    const toastId = toast.loading("Fetching notifications...");
    try {
      setLoading(true);
      
      // Convert filter text parameter to backend query payload expectation
      const unreadParam = filters.unreadOnly === "true" ? "true" : undefined;

      const response = await NotificationService.getNotifications({
        page,
        limit: 10,
        unread: unreadParam,
      });

      // Adjust structural mapping if your service returns data wrapped differently (e.g., response.data.data)
      setNotifications(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
      
      toast.success("Notifications updated", { id: toastId });
    } catch (error) {
      toast.error(error.message || "Failed to fetch notifications", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    const toastId = toast.loading("Marking notification as read...");
    try {
      await NotificationService.markAsRead(id);
      toast.success("Marked as read", { id: toastId });
      fetchNotifications(pagination.page);
    } catch (error) {
      toast.error(error.message || "Failed to update notification", { id: toastId });
    }
  };

  const handleMarkAll = async () => {
    const toastId = toast.loading("Marking all notifications as read...");
    try {
      await NotificationService.markAllAsRead();
      toast.success("All notifications marked as read", { id: toastId });
      fetchNotifications(1);
    } catch (error) {
      toast.error(error.message || "Action failed", { id: toastId });
    }
  };

  const clearFilters = () => {
    setFilters({ unreadOnly: "false" });
  };

  useEffect(() => {
    fetchNotifications(1);
  }, [filters.unreadOnly]); // Auto-fetches when toggling status filters

  return (
    <div className="bg-bg min-h-[calc(100vh-64px)] p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-6">


        {/* Header & Filters Unified Panel */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-card space-y-6">
          
          {/* Top Row: Title & Global Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Bell className="text-primary" size={24} />
                <h1 className="text-2xl font-bold text-text">Notifications</h1>
              </div>
              <p className="mt-1 text-text-secondary text-sm">
                Stay updated with system activities, transactional updates, and account logs.
              </p>
            </div>

            <button
              onClick={handleMarkAll}
              disabled={notifications.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-text-on-primary font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <CheckSquare size={16} />
              Mark All as Read
            </button>
          </div>

          {/* Decorative Separator Line */}
          <hr className="border-border" />

          {/* Bottom Row: Filters & Feed Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <SlidersHorizontal size={18} className="text-muted shrink-0" />
              <div className="w-full sm:w-64">
                <FilterSelect
                  label=""
                  value={filters.unreadOnly}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, unreadOnly: value }))
                  }
                  options={[
                    { id: "false", name: "All Notifications" },
                    { id: "true", name: "Unread Only" },
                  ]}
                />
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={clearFilters}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-surface-2 border border-border text-text-secondary hover:bg-surface-3 hover:cursor-pointer transition-colors text-sm font-medium"
              >
                <RotateCcw size={14} />
                Reset
              </button>
              <button
                onClick={() => fetchNotifications(1)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary-subtle text-primary hover:bg-primary-subtle/80 transition-colors text-sm font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
        


        {/* Notifications Listing View */}
        <div className="space-y-4 min-h-[50vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm">Syncing feed parameters...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center shadow-card">
              <Inbox size={48} className="mx-auto text-muted mb-4" />
              <h3 className="text-lg font-semibold text-text">No Notifications</h3>
              <p className="text-text-secondary mt-1 text-sm">
                Your clean slate is clear! We will inform you when matching activities update.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`group bg-card border rounded-2xl p-5 shadow-card transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-border-hover ${
                  !n.isRead ? "border-primary-subtle bg-surface-3" : "border-border"
                }`}
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="font-semibold text-text group-hover:text-primary transition-colors">
                      {n.title}
                    </h2>
                    {!n.isRead && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-primary text-text-on-primary">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed wrap-break-word">
                    {n.body}
                  </p>
                  
                  {n.createdAt && (
                    <div className="flex items-center gap-1.5 text-xs text-muted pt-1">
                      <Calendar size={12} />
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Control Callout Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 border-t border-divider sm:border-0 pt-3 sm:pt-0">
                  <button
                    onClick={() => navigate(`/notifications/${n._id}`)}
                    className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 py-2 px-4 rounded-xl bg-primary-subtle text-primary transition-colors text-sm font-medium  hover:cursor-pointer hover:bg-primary/40 hover:border-primary/80 active:scale-[0.98]"
                  >
                    <Eye size={15} />
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Unified Pagination Control Bar */}
        {!loading && pagination.pages > 1 && (
          <div className="flex justify-between items-center bg-surface border border-border rounded-2xl p-4 shadow-card">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchNotifications(pagination.page - 1)}
              className="p-2 rounded-xl border border-border text-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-2 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-text-secondary text-sm font-medium">
              Page {pagination.page} of {pagination.pages}
            </span>

            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchNotifications(pagination.page + 1)}
              className="p-2 rounded-xl border border-border text-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-2 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default NotificationsPage;