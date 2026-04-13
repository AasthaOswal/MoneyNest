import api from "../axios/axios";
import { getFCMToken } from "../utils/createFcmToken";

const signup = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  if (response.data.accessToken) {
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  console.log(response.data)

  // if  we get accccessToken in response data then the login is successful
  if (response.data.accessToken) {
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    // STEP 1: Get FCM token
    const token = await getFCMToken();

    // STEP 2: Send it to backend
    if (token) {
      await api.post("/user/fcm-token", { fcmToken: token });
    }
  }
  return response.data;
};

const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  signup,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
