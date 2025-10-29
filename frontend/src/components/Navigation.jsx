"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, Moon, Menu, X, Package, LogOut, User } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { userColors } from "@/config/colors";
import { useAuth } from "@/context/AuthContext";
import ThemeSwitcher from "./ThemeSwitcher";
import BrandHeader from "@/components/ui/BrandHeader";

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Role-based navigation links (synced with your file structure)
  const roleLinks = {
    admin: [
      { href: "/dashboard/admin", label: "Dashboard" },
      { href: "/verify", label: "Verify Products" },
    ],
    producer: [
      { href: "/dashboard/producer", label: "Dashboard" },
      { href: "/dashboard/producer", label: "My Batches" },
    ],
    seller: [
      { href: "/dashboard/seller", label: "Dashboard" },
      { href: "/verify", label: "Verify Product" },
    ],
    consumer: [{ href: "/verify", label: "Verify Product" }],
  };

  const navItems = roleLinks[user?.role?.toLowerCase()] || [];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm"
      style={{ borderBottomColor: `${userColors.primary}20` }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <BrandHeader showBrandOnly={true} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="px-3 py-2 rounded-lg text-gray-300 hover:text-accent hover:bg-white/10 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* Theme Switcher */}
            <ThemeSwitcher />
            
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </motion.button>

            {/* User Info + Logout */}
            {user && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-2 bg-accent/20 rounded-lg">
                  <User className="h-4 w-4 text-accent" />
                  <span className="text-sm text-accent capitalize">
                    {user.role}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </motion.button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 text-gray-300"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10"
          >
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-accent hover:bg-white/10 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={logout}
                className="flex items-center px-4 py-3 w-full text-left rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
