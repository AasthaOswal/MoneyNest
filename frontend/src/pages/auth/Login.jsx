import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/authService"; 
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 ADD THIS

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = () => {
    AuthService.loginWithGoogle();
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const user = await AuthService.login(credentials);
    console.log(user)

    // login(data.user); // 🔥 THIS IS THE MISSING 
    await login(user)

    if (user.role === "admin") {
      navigate("/admin-dashboard");
    } else if (user.role === "member") {
      if(user.familyId != null){
        navigate("/dashboard");
      }else{
        navigate("/family/onboarding");
      }
    }else {
      navigate("/dashboard");
    }
  } catch (err) {
    console.log(err);
    setError(err.response?.data?.message || "Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
  <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-xl border border-border">
    
    <h2 className="text-3xl font-bold mb-6 text-center text-text">
      Welcome Back
    </h2>

    {error && (
      <div className="bg-expense/10 border border-expense text-expense px-4 py-2 rounded mb-4 text-sm">
        {error}
      </div>
    )}

    <form onSubmit={handleLogin} className="space-y-5">

      <div>
        <label className="block text-sm font-medium mb-1 text-muted">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full px-4 py-2 border border-border rounded-lg 
          bg-surface text-text
          focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="name@example.com"
          value={credentials.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          className="w-full px-4 py-2 border border-border rounded-lg 
          bg-surface text-text
          focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="••••••••"
          value={credentials.password}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-colors shadow-md disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Sign In"}
      </button>

    </form>

    <p className="mt-6 text-center text-muted text-sm">
      Don't have an account?{" "}
      <Link to="/signup" className="text-primary hover:underline font-semibold">
        Create Account
      </Link>
    </p>

    <button
      onClick={handleGoogleLogin}
      className="w-full py-2 rounded-lg border border-border bg-bg hover:bg-surface transition flex items-center justify-center gap-2"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
      />
      Continue with Google
    </button>

  </div>
</div>
  );
};

export default Login;

