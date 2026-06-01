import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { initSocket } from "../../socket/socket";
import { getFCMToken } from "../../utils/createFcmToken";
import api from "../../axios/axios";
import { setupNotificationListener } from "../../socket/socketNotification";
import toast from "react-hot-toast";

const AuthInitializer = () => {
  const { user } = useAuth();

  const initialized = useRef(false);

  useEffect(() => {
    if (!user) {
      initialized.current = false;
      return;
    }

    if (initialized.current) return;

    initialized.current = true;

    const init = async () => {
      initSocket();

      setupNotificationListener((data) => {
        toast.success(
          `${data.notification.title} - ${data.notification.body}`
        );
      });

      const token = await getFCMToken();

      if (token) {
        await api.post("/user/fcm-token", {
          fcmToken: token,
          device: navigator.userAgent,
        });
      }
    };

    init();
  }, [user]);

  return null;
};

export default AuthInitializer;