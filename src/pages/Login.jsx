import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // ← added useLocation
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import logo from "../assets/logo.png";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ← captures where user came from

  // If kicked here from /admin, remember that page. Otherwise default to home.
  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);

      // Admin → go back to the admin page they tried, or /admin
      if (data.role === "admin") {
        navigate(from.startsWith("/admin") ? from : "/admin");
      } else {
        // Regular user → go back to where they came from, or home
        navigate(from === "/login" ? "/" : from);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogle = async (credentialResponse) => {
    try {
      const { data } = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      login(data);

      if (data.role === "admin") {
        navigate(from.startsWith("/admin") ? from : "/admin");
      } else {
        navigate(from === "/login" ? "/" : from);
      }
    } catch (err) {
      alert("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="JobSphere" className="h-12 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => alert("Google Login Failed")}
              theme="filled_blue"
              size="large"
              text="signin_with"
              shape="pill"
            />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
