import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar/Navbar";
import logo from "../assets/irt-logo.png";
import background from "../assets/login-bg.jpg";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const baseURL = process.env.REACT_APP_API_URL || "link";

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${baseURL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const user = response.data.user;

      if (user.role === "admin") {
        toast.success(t("Login successful! Redirecting to admin panel..."), { position: "top-center" });
        setTimeout(() => navigate("/admin/posts"), 2000);
      } else {
        toast.success(t("Login successful! Redirecting to home..."), { position: "top-center" });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error(`❌ ${t("Login failed:")} ${err.response?.data?.message || t("Invalid credentials")}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <ToastContainer />
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="IRT Logo" className="w-24 h-24 mb-4 rounded-full shadow-lg" />
            <h1 className="text-2xl font-bold text-blue-800">{t("IRT University")}</h1>
            <p className="text-sm text-gray-600 mt-1">{t("Login to your account")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("Email Address")}
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("Password")}
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-3 text-gray-400"
                aria-label={showPassword ? t("Hide Password") : t("Show Password")}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg hover:scale-105 transform transition duration-200 ease-in-out ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? t("Logging in...") : t("Login")}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {t("Don't have an account?")}{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              {t("Register")}
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginForm;