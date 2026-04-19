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

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../axios/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

import { useLocation } from "react-router-dom";





export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const location = useLocation();

  // ✅ Fetch user from backend
  const fetchUser = async () => {
  try {
    const res = await api.get("/user/me");
    setUser(res.data.user);
  } catch (err) {
    console.log(err)
    setUser(null);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  if (location.pathname !== "/login" && location.pathname !== "/signup") {
    fetchUser();
  } else {
    setLoading(false);
  }
}, [location.pathname]);  

  const login = async () => {
    await fetchUser(); // after login
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};