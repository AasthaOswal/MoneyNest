import React, { useState } from "react";
import AuthService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {signup} = useAuth();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const toastId = toast.loading("Please wait while we are logging you in...");

    try {
      const loggedInUser = await signup(form);
      console.log(loggedInUser);

      toast.success("Successful singup.", {id:toastId});
      
      if (loggedInUser.role === "admin") {
      navigate("/admin-dashboard", { replace: true });

      } else if (loggedInUser.role === "member") {

          if (loggedInUser.familyId) {
              navigate("/dashboard/family", { replace: true });
          } else {
              navigate("/family/setup", { replace: true });
          }

      } else {
          navigate("/dashboard/family", { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message ||"Some error occured.", {id:toastId});
      console.log(err)
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    AuthService.loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-text px-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow p-6">
        
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Account
        </h2>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-expense text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-border rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-border rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-border rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-2 text-muted text-sm">
          <div className="flex-1 h-px bg-border" />
          OR
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          className="w-full py-2 rounded-lg border border-border bg-bg hover:bg-surface transition flex items-center justify-center gap-2"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Login Redirect */}
        <p className="mt-6 text-sm text-center text-muted">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-primary cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;