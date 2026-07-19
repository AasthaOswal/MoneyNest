import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/auth.service"; 
import { useAuth } from "../../hooks/useAuth.js";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
const Login = () => {
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
  <div className="min-h-screen w-full bg-bg flex items-center justify-center py-6 p-2 sm:p-6 relative overflow-hidden">

    {/* Background Glow */}
    <div className="absolute -top-40 -left-40 h-120 w-96 rounded-full bg-primary-subtle blur-3xl opacity-70"></div>
    <div className="absolute -bottom-40 -right-40 h-128 w-lg rounded-full bg-investment-bg blur-3xl opacity-60"></div>

    <div
      className="relative z-10 w-full h-fit max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-10 shadow-(--shadow-card) my-12"
    >


      {/* Heading */}
      <h2 className="text-xl sm:text-3xl mt-4 font-bold text-center text-text">
        Login
      </h2>

      <p className="mt-2 text-center text-text-secondary">
        Sign in to continue managing your family's finances.
      </p>

      {/* Error */}
      {/* {error && (
        <div className="mt-6 rounded-xl border border-error bg-error-bg px-4 py-3 text-sm text-error">
          {error}
        </div>
      )} */}

      {/* Form */}
      <form onSubmit={handleLogin} className="mt-8 space-y-3 sm:space-y-6">

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            required
            placeholder="name@example.com"
            value={credentials.email}
            onChange={handleChange}
            className=" w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-text placeholder:text-placeholder transition-all duration-200 focus:border-input-focus focus:ring-2 focus:ring-primary-subtle focus:outline-none hover:border-border-hover"
          />
        </div>

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-text-secondary">
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-primary transition-colors hover:text-primary-hover"
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
              className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 pr-12 text-text placeholder:text-placeholder transition-all duration-200 focus:border-input-focus focus:ring-2 focus:ring-primary-subtle focus:outline-none hover:border-border-hover"
            />

            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-secondary hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <p className="mt-2 text-xs text-text-secondary">
          Must contain 8–14 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.
          </p>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className=" w-full rounded-xl bg-primary py-3 font-semibold text-text-on-primary transition-all duration-200 hover:bg-primary-hover hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
        >
          {loading ? "Logging in..." : "Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-4 sm:my-8 flex items-center">
        <div className="h-px flex-1 bg-divider"></div>
        <span className="px-2 sm:px-4 text-sm text-muted">OR</span>
        <div className="h-px flex-1 bg-divider"></div>
      </div>

      {/* Google */}
      <button
        onClick={handleGoogleLogin}
        className=" flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface-2 py-3 text-text transition-all duration-200 hover:border-border-hover hover:bg-surface-3 hover:cursor-pointer"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="h-5 w-5"
        />

        <span className="font-medium">
          Continue with Google
        </span>
      </button>



      {/* Signup */}
      <div className="mt-4 sm:mt-8 border-t border-divider pt-6 text-center">
        <p className="text-text-secondary">
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

export default Login;

