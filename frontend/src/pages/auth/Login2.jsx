import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/auth.service"; 
import { useAuth } from "../../hooks/useAuth.js";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
const Login2 = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login,user } = useAuth(); // 👈 ADD THIS

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = () => {
    AuthService.loginWithGoogle();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    
    const toastId = toast.loading("Please wait while we are logging you in...");


    try {
      const loggedInUser = await login(credentials);
      console.log(loggedInUser)

      toast.success("Successful login.", {id:toastId});

      if (loggedInUser?.role === "admin") {
      navigate("/admin-dashboard", { replace: true });

      } else if (loggedInUser?.role === "member") {

          if (loggedInUser?.familyId) {
              navigate("/dashboard/family", { replace: true });
          } else {
              navigate("/family/setup", { replace: true });
          }

      } else {
          navigate("/dashboard/family", { replace: true });
      }
    } catch (err) {

      console.log(err.response)
      toast.error(err.response?.data?.message ||"Some error occured.", {id:toastId});
      console.log(err)
      setError(err.response?.data?.message || "Invalid email or password");
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-bg flex  justify-center py-6 p-2 sm:p-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 h-120 w-96 rounded-full bg-primary-subtle blur-3xl opacity-70"></div>
      <div className="absolute -bottom-40 -right-40 h-128 w-lg rounded-full bg-investment-bg blur-3xl opacity-60"></div>

      {/* Balanced Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-card border border-border py-6 px-6 sm:px-8 shadow-(--shadow-card) mt-[10vh] h-fit">
        
        {/* Title */}
        <div className="text-center mb-5 mt-3">
          <h2 className="text-2xl font-bold text-text tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-1 mb-3 text-sm text-text-secondary">
            Sign in to manage your family's finances.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              value={credentials.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-input-border bg-input-bg px-3 py-2.5 text-sm text-text placeholder:text-placeholder transition-all duration-200 focus:border-input-focus focus:ring-2 focus:ring-primary-subtle focus:outline-none hover:border-border-hover"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium text-text-secondary">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary transition-colors hover:text-primary-hover"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-input-border bg-input-bg px-3 py-2.5 pr-10 text-sm text-text placeholder:text-placeholder transition-all duration-200 focus:border-input-focus focus:ring-2 focus:ring-primary-subtle focus:outline-none hover:border-border-hover"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Primary Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-text-on-primary transition-all duration-200 hover:bg-primary-hover hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        {/* Thin Divider */}
        <div className="my-5 flex items-center">
          <div className="h-px flex-1 bg-divider"></div>
          <span className="px-3 text-xs text-muted">OR</span>
          <div className="h-px flex-1 bg-divider"></div>
        </div>

        {/* Google OAuth Button - Full Width */}
        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface-2 py-2.5 text-sm text-text transition-all duration-200 hover:border-border-hover hover:bg-surface-3 hover:cursor-pointer"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-4 w-4"
          />
          <span className="font-medium">Continue with Google</span>
        </button>

        {/* Signup Link - Separate Line */}
        <div className="mt-5 text-center">
          <p className="text-xs text-text-secondary">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login2;

