import React, { useState } from "react";
import toast from "react-hot-toast";
import AuthService from "../../services/auth.service";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const toastId = toast.loading("Please wait while we email you the reset link.");

    try {
      const res = await AuthService.forgotPassword(email);
      // setMessage(res.message || "Reset link sent");
      toast.success(res.message || "Reset link sent", {id:toastId});

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      toast.error(err.response?.data?.message || "Something went wrong", {id:toastId});
    } finally {
      setLoading(false);
    }
  };

    return (
  <div className="min-h-screen w-full bg-bg flex justify-center py-6 p-2 sm:p-6 relative overflow-hidden">

    {/* Background Glow */}
    <div className="absolute -top-40 -left-40 h-120 w-96 rounded-full bg-primary-subtle blur-3xl opacity-70"></div>
    <div className="absolute -bottom-40 -right-40 h-128 w-lg rounded-full bg-investment-bg blur-3xl opacity-60"></div>

    <div className="relative z-10 w-full h-fit max-w-lg rounded-3xl mt-12 bg-card border border-border p-6 sm:p-10 shadow-(--shadow-card)">

      {/* Heading */}
      <h2 className="text-xl sm:text-3xl mt-4 font-bold text-center text-text">
        Forgot Password
      </h2>

      <p className="mt-2 text-center text-text-secondary">
        Enter your email address and we'll send you a password reset link.
      </p>

      {/* Success */}
      {/* {message && (
        <div className="mt-6 rounded-xl border border-success bg-success-bg px-4 py-3 text-sm text-success">
          {message}
        </div>
      )} */}

      {/* Error */}
      {/* {error && (
        <div className="mt-6 rounded-xl border border-error bg-error-bg px-4 py-3 text-sm text-error">
          {error}
        </div>
      )} */}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-3 sm:space-y-6">

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            Email Address
          </label>

          <input
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-text placeholder:text-placeholder transition-all duration-200 focus:border-input-focus focus:ring-2 focus:ring-primary-subtle focus:outline-none hover:border-border-hover"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3 font-semibold text-text-on-primary transition-all duration-200 hover:bg-primary-hover hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

      </form>

    </div>
  </div>
);
};

export default ForgotPassword;