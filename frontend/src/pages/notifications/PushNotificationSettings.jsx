import { useEffect, useState } from "react";
import { getFCMToken } from "../../utils/createFcmToken";
import api from "../../axios/axios";

const PushNotificationSettings = () => {
  const [status, setStatus] = useState("default"); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(Notification.permission);
  }, []);

  const enableNotifications = async () => {
    try {
      setLoading(true);

      const token = await getFCMToken();
      const device = navigator.userAgent;

      if (!token) {
        return;
      }

      await api.post("/user/fcm-token", { fcmToken: token, device });

      setStatus("granted");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const disableNotifications = async () => {
    try {
      setLoading(true);

      // optional: remove token from backend
      await api.post("/user/remove-fcm-token");

      setStatus("denied"); // UI state only
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Notification Settings</h1>

      <p className="mb-4">
        Status:{" "}
        <span className="font-semibold">
          {status === "granted"
            ? "Enabled 🔔"
            : status === "denied"
            ? "Blocked ❌"
            : "Not Enabled"}
        </span>
      </p>

      {status !== "granted" && (
        <button
          onClick={enableNotifications}
          disabled={loading}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg"
        >
          {loading ? "Enabling..." : "Enable Notifications"}
        </button>
      )}

      {status === "granted" && (
        <button
          onClick={disableNotifications}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          {loading ? "Disabling..." : "Disable Notifications"}
        </button>
      )}
    </div>
  );
};

export default PushNotificationSettings;