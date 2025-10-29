"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { formApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Lock, Mail, Flower2, ArrowLeft, Sparkles, Sun, Moon } from "lucide-react";
import { userColors } from "@/config/colors";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useTheme } from "@/components/ThemeProvider";

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      router.replace(`/dashboard/${user.role.toLowerCase()}`);
    }
  }, [isAuthenticated, user, router]);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = new URLSearchParams({
        username: formData.email,
        password: formData.password,
        grant_type: "password",
        scope: "",
      });
      const url = `${formApi.defaults.baseURL}/login`;
      const response = await axios.post(url, body, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
      const { access_token, role } = response.data;
      if (access_token && role) {
        login(access_token, role);
      } else {
        toast.error("Invalid response from server.");
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.detail || err?.response?.data?.message || "Invalid credentials or server error.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-[#f9f6ef] dark:bg-[#121212] text-gray-900 dark:text-white">
      {/* Top controls */}
      {/* <div className="sticky top-0 z-20 w-full flex justify-end p-3">
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </div>
      </div> */}

      {/* Main content */}
      <div className="flex-1 w-full flex">
        {/* Left Column - Illustration */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12"
          style={{ background: `linear-gradient(135deg, ${userColors.primary}20, ${userColors.primaryHover}40)` }}
        >
          {/* Decorative orbs */}
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ backgroundColor: `${userColors.primary}55` }} />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ backgroundColor: `${userColors.primaryHover}55` }} />

          {/* Content */}
          <div className="relative z-10 text-center max-w-md">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mb-8 inline-flex p-6 rounded-full"
              style={{ background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`, boxShadow: `0 20px 60px ${userColors.primary}40` }}
            >
              <Flower2 className="h-20 w-20 text-white" />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
              SaffronChain
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-lg text-white/80 leading-relaxed">
              Trace every thread of saffron from farm to you with blockchain-powered authenticity
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 flex items-center justify-center gap-2 text-white/60 text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Secure • Transparent • Traceable</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-white/60 dark:bg-gray-900/60">
          <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="w-full max-w-md">
            {/* Back to Home Link */}
            <Link href="/">
              <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:text-accent">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </motion.button>
            </Link>

            {/* Welcome Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg" style={{ background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})` }}>
                  <Flower2 className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Sign in to access your dashboard</p>
            </motion.div>

            {/* Login Form Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative rounded-3xl p-8 shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60">
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: `linear-gradient(to right, ${userColors.primary}, ${userColors.primaryHover})` }} />

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === 'email' ? 'text-accent' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all duration-200 focus:outline-none bg-white dark:bg-gray-900/60 text-gray-900 dark:text-white ${focusedField === 'email' ? 'border-accent' : 'border-gray-300 dark:border-gray-700'}`}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Password</label>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${focusedField === 'password' ? 'text-accent' : 'text-gray-400'}`} />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all duration-200 focus:outline-none bg-white dark:bg-gray-900/60 text-gray-900 dark:text-white ${focusedField === 'password' ? 'border-accent' : 'border-gray-300 dark:border-gray-700'}`}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: `0 20px 40px ${userColors.primary}40` }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-white"
                  style={{ background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})` }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Demo Credentials */}
            {/* <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-700/60">
              <p className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Demo Accounts:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { role: "Admin", email: "admin@example.com", pass: "adminpassword" },
                  { role: "Producer", email: "producer@example.com", pass: "producer123" },
                  { role: "Seller", email: "seller@example.com", pass: "seller123" },
                  { role: "Consumer", email: "consumer@example.com", pass: "consumer123" },
                ].map((account) => (
                  <div key={account.role} className="p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    <p className="font-semibold mb-1" style={{ color: userColors.primary }}>
                      {account.role}
                    </p>
                    <p className="truncate">{account.email}</p>
                    <p className="text-gray-500">{account.pass}</p>
                  </div>
                ))}
              </div>
            </motion.div> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

