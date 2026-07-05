import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../axios/axios";
import { useAuth } from "../../hooks/useAuth";
import { getFCMToken } from "../../utils/createFcmToken";
import { initSocket } from "../../socket/socket.js";
import toast from "react-hot-toast";
import { setupNotificationListener } from "../../socket/socketNotification.js";
import axios from "axios";
import { getSocketToken } from "../../socket/socketToken.js";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [searchParams] = useSearchParams();

  const messages = {
    INVALID_STATE: "Authentication failed. Please try again.",
    MISSING_CODE: "Authorization code was missing.",
    TOKEN_EXCHANGE_FAILED: "Couldn't complete Google sign in.",
    FAILED_TO_FETCH_GOOGLE_USER: "Couldn't retrieve your Google profile.",
    EMAIL_NOT_VERIFIED: "Your Google email address is not verified.",
    GOOGLE_ACCOUNT_HAS_NO_EMAIL: "Your Google account doesn't have an email address.",
    ACCOUNT_PENDING_DELETION: "Your account is pending deletion.",
    ACCOUNT_DELETED: "This account has been deleted.",
    GOOGLE_LOGIN_FAILED: "Google login failed. Please try again."
  };

  useEffect(() => {
    const initAuth = async () => {
        console.log("inside initAuth")
      try {
        const error = searchParams.get("error");

        if (error) {
          toast.error(messages[error] || "Some error occured. Please try again later.");

          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1000);

          return;
        }
        const res = await api.get("/user/me", { skipAuthRefresh: true, withCredentials:true });
        console.log(res);
        const user = res.data.user;
        console.log(user)

        if(!user){
          navigate("/login", { replace: true });
        }

        setUser(user);

        const ENV=import.meta.env.VITE_ENV;

        const API_URL = ENV == "production" ? "/api" :  import.meta.env.VITE_API_URL;

        const socketRes = await getSocketToken();

        let token = localStorage.getItem("socketToken");
        console.log("Socket token:",token)

        console.log(socketRes);


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
  }, [navigate, setUser, searchParams]);

  return <div>We are processing your request.Please wait.....</div>;
};

export default AuthCallback;