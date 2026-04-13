import { useState, useEffect } from "react";
import { getFCMToken } from "../../utils/createFcmToken";
import api from "../../axios/axios"; // adjust path if needed

const NotificationButton = () => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

//   Check if already enabled (optional basic check)
  useEffect(() => {
    if (Notification.permission === "granted") {
      setEnabled(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    try {
      setLoading(true);

      const token = await getFCMToken();

      if (!token) {
        alert("Permission denied or token not generated");
        return;
      }

      await api.post("/user/fcm-token", { fcmToken: token });

      setEnabled(true);
      alert("Notifications enabled 🔔");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEnableNotifications}
      disabled={enabled || loading}
      className="p-1 sm:px-4 sm:py-2 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {loading
        ? "Enabling..."
        : enabled
        ? "Notifications Enabled ✅"
        : "Enable Notifications 🔔"}
    </button>
  );
};

export default NotificationButton;