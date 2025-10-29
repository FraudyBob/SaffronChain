"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Factory,
  ShoppingCart,
  Package,
  Layers,
  Plus,
  Truck,
  QrCode,
  Search,
  Menu,
  X,
  Bell,
  User,
  ChevronRight,
  Home,
  Sun,
  Moon,
  BarChart2,
} from "lucide-react";
import { userColors } from "@/config/colors";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useTheme } from "@/components/ThemeProvider";

export default function UserDashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const role = user?.role?.toLowerCase() || "consumer";

  // Role-based icons
  const roleIcons = {
    producer: Factory,
    consumer: ShoppingCart,
    seller: Package,
  };

  const RoleIcon = roleIcons[role] || Factory;

  // Sidebar navigation by role
  const sidebarLinks = {
    admin: [
      { name: "System Overview", href: "/dashboard/", icon: BarChart2 },
      { name: "All Products", href: "/verify", icon: Package },
    ],
    producer: [
      { name: "My Batches", href: "/dashboard/producer", icon: Layers },
      { name: "Register Product", href: "/dashboard/producer#register", icon: Plus },
      { name: "Update Status", href: "/dashboard/producer#products", icon: Truck },
      { name: "Add Trace", href: "/dashboard/producer#trace", icon: QrCode },
    ],
    seller: [
      { name: "Incoming Shipments", href: "/dashboard/seller", icon: Truck },
      { name: "Update Status", href: "/update-status", icon: Package },
      { name: "Add Trace Log", href: "/dashboard/seller#trace", icon: QrCode },
    ],
    consumer: [
      { name: "Verify Product", href: "/dashboard/consumer", icon: Search },
    ],
  };

  const links = sidebarLinks[role] || [];

  // Breadcrumb generation
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, index) => ({
      name: path.charAt(0).toUpperCase() + path.slice(1),
      href: "/" + paths.slice(0, index + 1).join("/"),
      isLast: index === paths.length - 1,
    }));
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="min-h-screen w-full bg-[#f9f6ef] dark:bg-[#121212]">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm"
        style={{
          borderBottomColor: `${userColors.primary}20`,
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Logo + Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div 
                className="p-2 rounded-lg shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                }}
              >
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="hidden md:block text-lg font-bold text-gray-900 dark:text-white">
                SaffronChain
              </span>
            </Link>
          </div>

          {/* Center: Breadcrumbs */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <Home className="h-4 w-4 text-gray-400" />
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <Link
                  href={crumb.href}
                  className={`${
                    crumb.isLast
                      ? "font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  } transition-colors`}
                  style={crumb.isLast ? { color: userColors.primary } : {}}
                >
                  {crumb.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Right: Theme controls + Notifications + User */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span 
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: userColors.primary }}
              />
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.email?.split("@")[0] || "User"}
              </span>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Sidebar - Desktop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25 }}
            className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 shadow-lg z-40"
            style={{
              borderRightColor: `${userColors.primary}20`,
            }}
          >
            <div className="flex flex-col h-full p-4">
              {/* Role Badge */}
              <div 
                className="mb-6 p-4 rounded-xl shadow-md bg-white/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                    }}
                  >
                    <RoleIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Role</p>
                    <p className="font-semibold capitalize text-gray-900 dark:text-white">
                      {role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className={`flex-1 ${role === "admin" ? "space-y-3" : "space-y-2"}`}>
                {links.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link key={`${link.href}-${index}`} href={link.href}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? "shadow-md"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        style={
                          isActive
                            ? {
                                background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                                color: "white",
                              }
                            : {}
                        }
                      >
                        <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-600 dark:text-gray-400"}`} />
                        <span className={`font-medium ${isActive ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
                          {link.name}
                        </span>
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="mt-4 w-full px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 top-16"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-2xl z-50"
            >
              <div className="flex flex-col h-full p-4">
                <div 
                  className="mb-6 p-4 rounded-xl shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${userColors.bgAccent}, ${userColors.bgLight})`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                      }}
                    >
                      <RoleIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Role</p>
                      <p className="font-semibold capitalize text-gray-900 dark:text-white">
                        {role}
                      </p>
                    </div>
                  </div>
                </div>

                <nav className={`flex-1 ${role === "admin" ? "space-y-3" : "space-y-2"}`}>
                  {links.map((link, index) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link key={`${link.href}-${index}`} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                        <div
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? "shadow-md"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                          style={
                            isActive
                              ? {
                                  background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                                  color: "white",
                                }
                              : {}
                          }
                        >
                          <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-600 dark:text-gray-400"}`} />
                          <span className={`font-medium ${isActive ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
                            {link.name}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>

                <button
                  onClick={logout}
                  className="mt-4 w-full px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 pt-6 ${
          sidebarOpen ? "lg:pl-64" : "lg:pl-0"
        }`}
      >
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
