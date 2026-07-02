import { useContext } from "react";
import { AuthContext } from "../context/AuthContextNew";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.log("Context not available");
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};