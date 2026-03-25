import axios from "axios";

const API_URL = "http://localhost:5000/api";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

// ✅ Notify all waiting requests after refresh success
const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token, null));
  refreshSubscribers = [];
};

// ❌ Notify all waiting requests if refresh fails
const onRefreshFailed = (error) => {
  refreshSubscribers.forEach((cb) => cb(null, error));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb) => {
  refreshSubscribers.push(cb);
};

// 🔴 Logout helper (keep axios independent)
const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  delete instance.defaults.headers.common["Authorization"];
  window.location.href = "/login";
};

// =======================
// 🔹 REQUEST INTERCEPTOR
// =======================
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// 🔹 RESPONSE INTERCEPTOR
// =======================
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Inside interceptors:");

    // 🌐 Network error (server down, no response)
    if (!error.response) {
      console.error("Network/Server error");
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const code = error.response?.data?.code;

    // =======================
    // 🔴 ACCESS TOKEN EXPIRED
    // =======================
    if (error.response.status === 401 && code === "ACCESS_TOKEN_EXPIRED") {

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await axios.post(
            `${API_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          const accessToken = res.data.accessToken;

          // ✅ Store new token
          localStorage.setItem("accessToken", accessToken);
          instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

          // ✅ Resolve all pending requests
          onRefreshed(accessToken);

          isRefreshing = false;

        } catch (refreshError) {
          isRefreshing = false;

          // ❌ Reject all pending requests
          onRefreshFailed(refreshError);

          const refreshCode = refreshError.response?.data?.code;

          if (
            refreshCode === "REFRESH_TOKEN_EXPIRED" ||
            refreshCode === "INVALID_REFRESH_TOKEN"
          ) {
            logoutUser();
          }

          if (refreshCode === "TOKEN_REUSE_DETECTED") {
            alert("Security issue detected. Logged out from all devices.");
            logoutUser();
          }

          return Promise.reject(refreshError);
        }
      }

      // ⏳ Queue requests while refreshing
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((token, err) => {
          if (err) return reject(err);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(instance(originalRequest));
        });
      });
    }

    // =======================
    // 🔴 INVALID ACCESS TOKEN
    // =======================
    if (code === "INVALID_TOKEN" || code === "AUTH_FAILED") {
      logoutUser();
    }

    return Promise.reject(error);
  }
);

export default instance;