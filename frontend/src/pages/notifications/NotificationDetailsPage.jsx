import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

      // auto mark as read when opened
      if (!res.data.isRead) {
        await NotificationService.markAsRead(id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, [id]);

  const handleDelete = async () => {
    await NotificationService.deleteNotification(id);
    navigate("/notifications");
  };

  if (loading) return <p className="text-center mt-10 text-muted">Loading...</p>;

  if (!notification)
    return <p className="text-center mt-10 text-muted">Not found</p>;

  return (
    <div className="p-6 bg-bg min-h-screen text-text">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-primary"
      >
        ← Back
      </button>

      <div className="bg-surface p-6 rounded-xl border border-border shadow">
        <h1 className="text-2xl font-bold mb-2">
          {notification.title}
        </h1>

        <p className="text-muted mb-4">
          {notification.body}
        </p>

        {notification.data && (
          <div className="text-sm text-muted bg-bg p-3 rounded">
            <pre>{JSON.stringify(notification.data, null, 2)}</pre>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-expense text-white rounded-lg"
          >
            Delete Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailsPage;