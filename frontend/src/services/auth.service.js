
import api from "../axios/axios";
import { getFCMToken } from "../utils/createFcmToken";
import { disconnectSocket } from "../socket/socket";




const goToAuthCallback = () => {
  window.location.href = "/auth/callback";
};


// =======================
// 🔹 AUTH FUNCTIONS
// =======================


const signup = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    return response.data;
    
  } catch (error) {
    console.log(error);
    console.log(error.response);
    throw error;
  }
};

const login = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    console.log(error);
    console.log(error.response);
    throw error;
  }
};


//isme useNavigate() and Navigate to="/" replace dono approcahes baadme laganke dekkhna hai
const loginWithGoogle = async () => {
  const isProduction = import.meta.env.VITE_ENV === "production";
  const apiBase = isProduction ? "/api" : import.meta.env.VITE_API_URL;
  window.location.href = `${apiBase}/auth/google`;
};





const logout = async () => {
  disconnectSocket();

  const res = await api.post("/auth/logout");
  return res.data;
};

// =======================
// 🔹 PASSWORD RESET
// =======================

// 📩 Forgot Password (send email)
const forgotPassword = async (email) => {
  try {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 🔐 Reset Password (using token from URL)
const resetPassword = async (token, password) => {
  try {
        const res = await api.post(`/auth/reset-password/${token}`, {
        password,
    });
    return res.data;
  } catch (error) {
        console.error(error);
    throw error;
    
  }
};

const AuthService = {
  signup,
  login,
  loginWithGoogle, // Added
  logout,
  forgotPassword,
  resetPassword,
};

export default AuthService;