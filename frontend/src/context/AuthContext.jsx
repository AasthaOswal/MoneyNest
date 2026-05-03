// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//     return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//     // For demonstration, simulating an authenticated user. 
//     // In a real app, this should check tokens or local storage.
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Mock checking auth status on mount
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//             try {
//                 setUser(JSON.parse(storedUser));
//             } catch (error) {
//                 console.error("Failed to parse stored user", error);
//             }
//         }
//         setLoading(false);
//     }, []);

//     const login = (userData) => {
//         // userData should include role: 'member', 'admin', or 'familyAdmin'
//         setUser(userData);
//         localStorage.setItem('user', JSON.stringify(userData));
//     };

//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem('user');
//     };

//     const value = {
//         user,
//         login,
//         logout,
//         loading
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// };

// import React, { createContext, useContext, useState, useEffect } from "react";
// import api from "../axios/axios";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// import { useLocation } from "react-router-dom";
// import { useNavigate } from "react-router-dom";




// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);


//   const location = useLocation();
//   const navigate = useNavigate();

//   // ✅ Fetch user from backend
//   const fetchUser = async () => {
//   try {
//     const res = await api.get("/user/me");
//     setUser(res.data.user);
//   } catch (err) {
//     console.log("Auth error:", err.response?.data || err.message);
//     setUser(null);
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   const isPublicRoute =
//     location.pathname === "/login" ||
//     location.pathname === "/signup" ||
//     location.pathname === "/forgot-password" ||
//     location.pathname.startsWith("/reset-password");

//   if (!isPublicRoute) {
//     fetchUser();
//   } else {
//     setLoading(false);
//   }
// }, [location.pathname]);


//   const login = async () => {
//     await fetchUser(); // after login
//   };

//   const logout = async () => {
//   try {
//     await api.post("/auth/logout");
//   } catch (err) {
//     console.log("Logout error:", err.message);
//   } finally {
//     setUser(null);
//     setLoading(false);
//     navigate("/login", { replace: true });
//   }
// };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../axios/axios";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data.user);
    } catch (err) {
      console.log("Auth error:", err.response?.data || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname === "/auth/callback") {
  setLoading(false); // ✅ allow UI to render
  return;
}
    const isPublicRoute =
      location.pathname === "/login" ||
      location.pathname === "/signup" ||
      location.pathname === "/forgot-password" ||
      location.pathname.startsWith("/reset-password") ||
      location.pathname === "/auth/callback";

    if (!isPublicRoute) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log("Logout error:", err.message);
    } finally {
      setUser(null);
      setLoading(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};