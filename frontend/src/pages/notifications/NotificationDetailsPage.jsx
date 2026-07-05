import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Trash2,
  CheckCircle2,
  Circle,
  Database,
  Mail
} from "lucide-react";

import NotificationService from "../../services/notification.service";

const NotificationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNotification = async () => {
    try {
      const res = await NotificationService.getNotificationById(id);

      setNotification(res.data);

      if (!res.data.isRead) {
        const updated = await NotificationService.markAsRead(id);
        setNotification(updated.data);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await NotificationService.markAsRead(id);

      setNotification(res.data);
      

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, [id]);

  const handleDelete = async (id) => {
    try {
      const res = await NotificationService.deleteNotification(id);

      
      navigate("/notifications");

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-muted">
        Loading notification...
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-muted">
        Notification not found.
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-bg text-text">
    <div className="max-w-4xl mx-auto px-6 py-12">


      {/* Card */}
      <div className="bg-card border border-border rounded-3xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="border-b border-divider p-8">
          <div className="flex items-start justify-between gap-6">
            <h1 className="text-3xl font-semibold text-text">
                  {notification.title}
                </h1>

            
          </div>

          
        </div>

        {/* Details */}
        <div className="border-b border-divider px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-subtle flex items-center justify-center">
                <Bell size={18} className="text-primary" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-text-secondary">
                  Type
                </p>
                <p className="text-text capitalize">
                  {notification.type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-subtle flex items-center justify-center">
                <Calendar size={18} className="text-primary" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-text-secondary">
                  Date
                </p>
                <p className="text-text">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-subtle flex items-center justify-center">
                <Calendar size={18} className="text-primary" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-text-secondary">
                  Time
                </p>
                <p className="text-text">
                  {new Date(notification.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-subtle flex items-center justify-center">
                {notification.isRead ? (
                  <CheckCircle2 size={18} className="text-success" />
                ) : (
                  <Circle size={18} className="text-warning" />
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-text-secondary">
                  Status
                </p>
                <p className="text-text">
                  {notification.isRead ? "Read" : "Unread"}
                </p>
              </div>
            </div>
          </div>
        </div>



        {/* Content */}
        <div className="p-8 space-y-8">

          
          {/* Message */}
          <section>
            <div className="flex items-center gap-2 mb-4">
                  <Mail
                    size={18}
                    className="text-text-secondary"
                  />

                  <h2 className="uppercase text-xs tracking-[0.2em] text-text-secondary">
                    Message
                  </h2>
                </div>

            <div className="rounded-2xl bg-surface-2 border border-border p-6 leading-8 whitespace-pre-wrap text-text">
              {notification.body}
            </div>
          </section>

          {/* Additional Data */}
          {notification.data &&
            Object.keys(notification.data).length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Database
                    size={18}
                    className="text-text-secondary"
                  />

                  <h2 className="uppercase text-xs tracking-[0.2em] text-text-secondary">
                    Additional Data
                  </h2>
                </div>

                <div className="rounded-2xl bg-bg border border-border overflow-hidden">
                  <pre className="p-6 text-sm text-text-secondary overflow-x-auto font-mono">
                    {JSON.stringify(notification.data, null, 2)}
                  </pre>
                </div>
              </section>
            )}
        </div>

        {/* Footer */}
        <div className="border-t border-divider p-6 flex items-center  flex-wrap gap-6">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl bg-surface-2 border border-border hover:bg-surface-3 transition"
          >
            Back
          </button>

          <div className="flex items-center gap-3">
            {/* {!notification.isRead && (
              <button
                onClick={() => handleMarkAsRead(notification._id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-text-on-primary hover:bg-primary-hover transition"
              >
                <CheckCircle2 size={18} />
                Mark as Read
              </button>
            )} */}

            <button
              onClick={() => handleDelete(notification._id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-error-bg text-error border border-error/50 hover:opacity-90 transition"
            >
              <Trash2 size={18} />
              Delete Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default NotificationDetailsPage;