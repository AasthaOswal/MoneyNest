import React, { useState } from "react";
import AuthService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const {signup} = useAuth();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const toastId = toast.loading("Please wait while we are logging you in...");

    try {
      const loggedInUser = await signup(form);
      console.log("From signup.jsx, loggedInUser: ", loggedInUser);

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
  <div className="min-h-screen w-full bg-bg flex items-center justify-center py-6 p-2 sm:p-6 relative overflow-hidden">

    {/* Background Glow */}
    <div className="absolute -top-40 -left-40 h-120 w-96 rounded-full bg-primary-subtle blur-3xl opacity-70"></div>
    <div className="absolute -bottom-40 -right-40 h-128 w-lg rounded-full bg-investment-bg blur-3xl opacity-60"></div>

    <div className="relative z-10 w-full h-fit max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-10 shadow-(--shadow-card) my-12">

      {/* Heading */}
      <h2 className="text-xl sm:text-3xl mt-4 font-bold text-center text-text">
        Create Account
      </h2>

      <p className="mt-2 text-center text-text-secondary">
        Create your account and start managing your family's finances.
      </p>

      {/* Error */}
      {/* {error && (
        <div className="mt-6 rounded-xl border border-error bg-error-bg px-4 py-3 text-sm text-error">
          {error}
        </div>
      )} */}

      {/* Form */}
      <form onSubmit={handleSignup} className="mt-8 space-y-3 sm:space-y-6">

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            required
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-text placeholder:text-placeholder transition-all duration-200 focus:border-input-focus focus:ring-2 focus:ring-primary-subtle focus:outline-none hover:border-border-hover"
          />
        </div>

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
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-text placeholder:text-placeholder transition-all duration-200 focus:border-input-focus focus:ring-2 focus:ring-primary-subtle focus:outline-none hover:border-border-hover"
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="••••••••"
              value={form.password}
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
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3 font-semibold text-text-on-primary transition-all duration-200 hover:bg-primary-hover hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-4 sm:my-8 flex items-center">
        <div className="h-px flex-1 bg-divider"></div>
        <span className="px-2 sm:px-4 text-sm text-muted">OR</span>
        <div className="h-px flex-1 bg-divider"></div>
      </div>

      {/* Google Signup */}
      <button
        onClick={handleGoogleSignup}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface-2 py-3 text-text transition-all duration-200 hover:border-border-hover hover:bg-surface-3 hover:cursor-pointer"
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

      {/* Login */}
      <div className="mt-4 sm:mt-8 border-t border-divider pt-6 text-center">
        <p className="text-text-secondary">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Sign In
          </Link>
        </p>
      </div>

    </div>
  </div>
);
};

export default Signup;