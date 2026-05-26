
import api from "../axios/axios";
import { getFCMToken } from "../utils/createFcmToken";
import { disconnectSocket } from "../socket/socket";

// export const handlePostLogin = async () => {
//   try {
//     const res = await api.get("/user/me");
//     const user = res.data.user;

//     const token = await getFCMToken();
//     const device = navigator.userAgent;

//     if (token) {
//       await api.post("/user/fcm-token", {
//         fcmToken: token,
//         device,
//       });
//     }

//     return user;
//   } catch (error) {
//     console.error("Post login failed:", error);
//     throw error;
//   }
// };


const goToAuthCallback = () => {
  window.location.href = "/auth/callback";
};

export const handlePostLogin = async () => {
  const res = await api.get("/user/me", { skipAuthRefresh: true });
  const user = res.data.user;

  const token = await getFCMToken();
  const device = navigator.userAgent;

  if (token) {
    await api.post("/user/fcm-token", {
      fcmToken: token,
      device,
    });
  }

  return user;
};


// =======================
// 🔹 AUTH FUNCTIONS
// =======================


const signup = async (userData) => {
  await api.post("/auth/signup", userData);
  goToAuthCallback();
};

const login = async (credentials) => {
  try{
    await api.post("/auth/login", credentials);
    goToAuthCallback();
  }catch(err){
    console.error(err)
  }
};

const loginWithGoogle = async () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};


// const signup = async (userData) => {
//   await api.post("/auth/signup", userData);
//   return await handlePostLogin();
// };

// const login = async (credentials) => {
//   await api.post("/auth/login", credentials);
//   return await handlePostLogin();
// };

// // --- Added Google Login ---
// const loginWithGoogle = async () => {
//   // this axios fails because redirect cannot be done using AJAX(which axios uses)
//   // await api.get("/auth/google");

//   //instead we should do a full browser level page reload
//   window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
// };




const logout = async () => {
  disconnectSocket();

  await api.post("/auth/logout");
  window.location.href = "/login";
};

// =======================
// 🔹 PASSWORD RESET
// =======================

// 📩 Forgot Password (send email)
const forgotPassword = async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

// 🔐 Reset Password (using token from URL)
const resetPassword = async (token, password) => {
  const res = await api.post(`/auth/reset-password/${token}`, {
    password,
  });
  return res.data;
};

const AuthService = {
  signup,
  login,
  loginWithGoogle, // Added
  logout,
  handlePostLogin,
  forgotPassword,
  resetPassword,
};

export default AuthService;