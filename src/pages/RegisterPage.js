import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/irt-logo.png';
import background from '../assets/login-bg.jpg';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { t } = useTranslation();
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      return toast.error(t('Please fill in all fields'));
    }
    if (!isValidEmail(formData.email)) {
      return toast.error(t('Please enter a valid email address'));
    }
    if (formData.password.length < 6) {
      return toast.error(t('Password must be at least 6 characters long'));
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error(t('Passwords do not match'));
    }

    setLoading(true);

    try {
      await axios.post(`${baseURL}/api/auth/register`, {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      toast.success(t('Registration successful!'), {
        position: 'top-center',
      });

      setTimeout(() => {
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
        navigate('/login');
      }, 2500);
    } catch (error) {
      toast.error(`❌ ${error.response?.data?.message || t('Something went wrong. Please try again.')}`);
    }

    setLoading(false);
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
            <img src={logo} alt="IRT University Logo" className="w-24 h-24 mb-4 rounded-full shadow-lg" />
            <h1 className="text-2xl font-bold text-blue-800">{t("IRT University")}</h1>
            <p className="text-sm text-gray-600 mt-1">{t("Create your account below")}</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("Full Name")}
                aria-label={t("Full Name")}
                required
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("Email Address")}
                aria-label={t("Email Address")}
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("Create Password")}
                aria-label={t("Password")}
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

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("Confirm Password")}
                aria-label={t("Confirm Password")}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 rounded-lg transition duration-200 ease-in-out ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-105 transform'
              }`}
            >
              {loading ? t("Registering...") : t("Register")}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {t("Already have an account?")}{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              {t("Login")}
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegisterPage;