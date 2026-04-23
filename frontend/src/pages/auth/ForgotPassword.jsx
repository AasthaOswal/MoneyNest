import React, { useState } from "react";
import AuthService from "../../services/authService";

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

    try {
      const res = await AuthService.forgotPassword(email);
      setMessage(res.message || "Reset link sent");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-xl border border-border">

        <h2 className="text-3xl font-bold mb-6 text-center text-text">
          Forgot Password
        </h2>

        {message && (
          <div className="bg-income/10 border border-income text-income px-4 py-2 rounded mb-4 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-expense/10 border border-expense text-expense px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ForgotPassword;