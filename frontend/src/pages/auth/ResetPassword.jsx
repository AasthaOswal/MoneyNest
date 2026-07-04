import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthService from "../../services/authService";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const toastId = toast.loading("Please wait while we reset your password.");

    try {
      const res = await AuthService.resetPassword(token, password);
      // setMessage(res.message);

      toast.success("Password reset successfully. Redirecting you to login page....", {id:toastId});

      // redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      // setError(err.response?.data?.message || "Reset failed");
      toast.error(err.response?.data?.message || "Some error occured.", {id:toastId});
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen w-full bg-bg flex  justify-center py-6 p-2 sm:p-6 relative overflow-hidden">

    {/* Background Glow */}
    <div className="absolute -top-40 -left-40 h-120 w-96 rounded-full bg-primary-subtle blur-3xl opacity-70"></div>
    <div className="absolute -bottom-40 -right-40 h-128 w-lg rounded-full bg-investment-bg blur-3xl opacity-60"></div>

    <div className="relative z-10 w-full h-fit max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-10 shadow-(--shadow-card) mt-12">

      {/* Heading */}
      <h2 className="text-xl sm:text-3xl mt-4 font-bold text-center text-text">
        Reset Password
      </h2>

      <p className="mt-2 text-center text-text-secondary">
        Enter your new password to regain access to your account.
      </p>

      {/* Success Message */}
      {/* {message && (
        <div className="mt-6 rounded-xl border border-success bg-success-bg px-4 py-3 text-sm text-success">
          {message}
        </div>
      )} */}

      {/* Error Message */}
      {/* {error && (
        <div className="mt-6 rounded-xl border border-error bg-error-bg px-4 py-3 text-sm text-error">
          {error}
        </div>
      )} */}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-3 sm:space-y-6">

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            New Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 pr-12 text-text placeholder:text-placeholder transition-all duration-200 focus:border-input-focus focus:ring-2 focus:ring-primary-subtle focus:outline-none hover:border-border-hover"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-secondary hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Reset Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3 font-semibold text-text-on-primary transition-all duration-200 hover:bg-primary-hover hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </form>
    </div>
  </div>
);
};

export default ResetPassword;