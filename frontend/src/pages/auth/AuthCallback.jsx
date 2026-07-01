import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axios/axios";
import { useAuth } from "../../context/AuthContext";
import { getFCMToken } from "../../utils/createFcmToken";
import { initSocket } from "../../socket/socket.js";
import toast from "react-hot-toast";
import { setupNotificationListener } from "../../socket/socketNotification.js";
import axios from "axios";


const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
        console.log("inside initAuth")
      try {
        const res = await api.get("/user/me", { skipAuthRefresh: true });
        const user = res.data.user;
        console.log(user)

        if(!user){
          navigate("/login", { replace: true });
        }

        setUser(user);

        const ENV=import.meta.env.VITE_ENV;

        const API_URL = ENV == "production" ? "/api" :  import.meta.env.VITE_API_URL;


        // const response = await axios.post(
        //   `${API_URL}/auth/refresh-token`,
        //   {},
        //   { withCredentials: true }
        // );
        // console.log(response)

        // localStorage.setItem("accessToken", response?.data?.accessToken);

        // initialize authenticated socket
        initSocket();

        setupNotificationListener((data) => {
          console.log("inside notification listener")
          console.log(data)
          toast.success(`${data.notification.title} - ${data.notification.body}`);
        });




        // if (token) {
        //   await api.post("/user/fcm-token", {
        //     fcmToken: token,
        //     device,
        //   });
        // }

        try {
          const token = await getFCMToken();
          const device = navigator.userAgent;

          if (token) {
            await api.post("/user/fcm-token", {
              fcmToken: token,
              device,
            });
          }
        } catch (err) {
          console.error("FCM registration failed", err);
        }

        if (user.role === "admin") {
          navigate("/admin-dashboard", { replace: true });

        } else if (user.role === "member") {
          if (user.familyId) {
            navigate("/dashboard/family", { replace: true });
          } else {
            navigate("/family/setup", { replace: true });
          }

        } else {
          navigate("/dashboard/family", { replace: true });
        }
      } catch (err) {
        console.log(err)
        navigate("/login", { replace: true });
      }
    };

    initAuth();
  }, [navigate, setUser]);

  return <div>Logging you in. Please wait.....</div>;
};

export default AuthCallback;