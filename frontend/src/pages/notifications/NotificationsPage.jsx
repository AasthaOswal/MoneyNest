import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationService from "../../services/notification.service";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await NotificationService.getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    await NotificationService.markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAll = async () => {
    await NotificationService.markAllAsRead();
    fetchNotifications();
  };

  const handleDelete = async (id) => {
    await NotificationService.deleteNotification(id);
    fetchNotifications();
  };

  if (loading) return <p className="text-center mt-10 text-muted">Loading...</p>;

  return (
    <div className="p-6 bg-bg min-h-screen text-text">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>

        <button
          onClick={handleMarkAll}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
        >
          Mark All as Read
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-muted">No notifications found</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-xl border cursor-pointer transition 
              ${
                n.isRead
                  ? "bg-surface border-border"
                  : "bg-primary/10 border-primary"
              }`}
            >
              <div onClick={() => navigate(`/notifications/${n._id}`)}>
                <h2 className="font-semibold">{n.title}</h2>
                <p className="text-sm text-muted">{n.body}</p>
              </div>

              <div className="flex gap-3 mt-3">
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n._id)}
                    className="text-sm px-3 py-1 bg-primary text-white rounded"
                  >
                    Mark Read
                  </button>
                )}

                <button
                  onClick={() => handleDelete(n._id)}
                  className="text-sm px-3 py-1 bg-expense text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;