// import api from "../axios/axios";
// import { getFCMToken } from "../utils/createFcmToken";

// const signup = async (userData) => {
//   const response = await api.post("/auth/signup", userData);
//   if (response.data.accessToken) {
//     localStorage.setItem("accessToken", response.data.accessToken);
//     localStorage.setItem("user", JSON.stringify(response.data.user));
//   }
//   return response.data;
// };

// const login = async (credentials) => {
//   const response = await api.post("/auth/login", credentials);
//   console.log(response.data)

//   // if  we get accccessToken in response data then the login is successful
//   if (response.data.accessToken) {
//     localStorage.setItem("accessToken", response.data.accessToken);
//     localStorage.setItem("user", JSON.stringify(response.data.user));

//     // STEP 1: Get FCM token
//     const token = await getFCMToken();

//     const device = navigator.userAgent;

//     // STEP 2: Send it to backend
//     if (token) {
//       await api.post("/user/fcm-token", { fcmToken: token, device });
//     }
//   }
//   return response.data;
// };

// const logout = async () => {
//   try {
//     await api.post("/auth/logout");
//   } finally {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   }
// };

// const getCurrentUser = () => {
//   return JSON.parse(localStorage.getItem("user"));
// };

// const AuthService = {
//   signup,
//   login,
//   logout,
//   getCurrentUser,
// };

// export default AuthService;


// import api from "../axios/axios";
// import { getFCMToken } from "../utils/createFcmToken";

// // ✅ COMMON FUNCTION (VERY IMPORTANT)
// export const handlePostLogin = async () => {
//   try {
//     // 1️⃣ Get user
//     const res = await api.get("/user/me");
//     const user = res.data.user;

//     // 2️⃣ Get FCM token
//     const token = await getFCMToken();
//     const device = navigator.userAgent;

//     // 3️⃣ Save FCM token
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

// // =======================
// // 🔹 AUTH FUNCTIONS
// // =======================

// const signup = async (userData) => {
//   await api.post("/auth/signup", userData);

//   // ✅ After signup → same flow
//   return await handlePostLogin();
// };

// const login = async (credentials) => {
//   await api.post("/auth/login", credentials);

//   // ✅ After login → same flow
//   return await handlePostLogin();
// };

// const logout = async () => {
//   await api.post("/auth/logout");
//   window.location.href = "/login";
// };

// const AuthService = {
//   signup,
//   login,
//   logout,
//   handlePostLogin,
// };

// export default AuthService;



import api from "../axios/axios";
import { getFCMToken } from "../utils/createFcmToken";

export const handlePostLogin = async () => {
  try {
    const res = await api.get("/user/me");
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
  } catch (error) {
    console.error("Post login failed:", error);
    throw error;
  }
};

// =======================
// 🔹 AUTH FUNCTIONS
// =======================

const signup = async (userData) => {
  await api.post("/auth/signup", userData);
  return await handlePostLogin();
};

const login = async (credentials) => {
  await api.post("/auth/login", credentials);
  return await handlePostLogin();
};

// --- Added Google Login ---
const loginWithGoogle = async () => {
  // this axios fails because redirect cannot be done using AJAX(which axios uses)
  // await api.get("/auth/google");

  //instead we should do a full browser level page reload
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};

const logout = async () => {
  await api.post("/auth/logout");
  window.location.href = "/login";
};

const AuthService = {
  signup,
  login,
  loginWithGoogle, // Added
  logout,
  handlePostLogin,
};

export default AuthService;