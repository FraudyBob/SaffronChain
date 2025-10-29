"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { 
  Package, Plus, Search, Layers, BarChart2, LogOut, Truck, QrCode, 
  ChevronLeft, ChevronRight, Factory, ShoppingCart, Bell, User, 
  Menu, X, Home, ChevronRight as BreadcrumbArrow, Sun, Moon
} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useTheme } from "@/components/ThemeProvider";
import { userColors } from "@/config/colors";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const role = user?.role?.toLowerCase();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Role-based icons
  const roleIcons = {
    producer: Factory,
    consumer: ShoppingCart,
    seller: Package,
    admin: BarChart2,
  };

  const RoleIcon = roleIcons[role] || Factory;

  // Sidebar navigation by role
  const sidebarLinks = {
    admin: [
      { name: "System Overview", href: "/dashboard/admin", icon: BarChart2 },
      { name: "All Products", href: "/dashboard/admin", icon: Package },
    ],
    producer: [
      { name: "My Batches", href: "/dashboard/producer", icon: Layers },
      { name: "Register Product", href: "/register-product", icon: Plus },
      { name: "Update Status", href: "/update-status", icon: Truck },
      { name: "Add Trace", href: "/add-trace", icon: QrCode },
    ],
    seller: [
      { name: "Incoming Shipments", href: "/dashboard/seller", icon: Truck },
      { name: "Update Status", href: "/update-status", icon: Package },
      { name: "Add Trace Log", href: "/add-trace", icon: QrCode },
    ],
    consumer: [
      { name: "Verify Product", href: "/dashboard/consumer", icon: Search },
    ],
  };

  const links = sidebarLinks[role] || [];

  // Generate breadcrumb from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, idx) => ({
      name: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
      href: "/" + paths.slice(0, idx + 1).join("/"),
      isLast: idx === paths.length - 1,
    }));
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="flex min-h-screen w-full bg-[#f9f6ef] dark:bg-[#121212] text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 dark:border-gray-700/50 overflow-hidden relative"
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 px-4 py-6 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
          <motion.div 
            className="min-w-0 flex items-center gap-3"
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent to-accentHover shadow-lg">
              <RoleIcon className="h-6 w-6 text-black" />
            </div>

            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="text-xl font-bold bg-gradient-to-r from-accent-700 to-accent-500 bg-clip-text text-transparent">
                  {typeof role === "string" && role.length > 0
                    ? role.charAt(0).toUpperCase() + role.slice(1)
                    : "User"}
                </h1>

                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </motion.div>
          
        </div>

        <nav className="relative z-10 flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          {links.map((link, i) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-accent to-accentHover text-black shadow-lg shadow-accent/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 hover:shadow-md"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "animate-pulse" : ""}`} />
                  <span className={`transition-all duration-200 whitespace-nowrap overflow-hidden ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
                    {link.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 shadow-2xl z-50 lg:hidden flex flex-col"
            >
              <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent to-accentHover shadow-lg">
                    <RoleIcon className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-accent-700 to-accent-500 bg-clip-text text-transparent">
                      {role?.charAt(0).toUpperCase() + role?.slice(1)}
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
                {links.map((link, i) => {
                  const Icon = link.icon;
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={i}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "bg-gradient-to-r from-accent to-accentHover text-black shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
              {role !== 'admin' && (
                <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-medium shadow-lg"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navigation Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-30"
          style={{ borderBottomColor: `${userColors.primary}20` }}
        >
          <div className="px-4 md:px-8 py-4 flex items-center justify-between gap-4">
            {/* Desktop sidebar toggle and Mobile menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCollapsed((v) => !v)}
                className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Brand */}
            <Link href="/" className="hidden md:flex items-center gap-2">
              <div
                className="p-2 rounded-lg shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                }}
              >
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">SaffronChain</span>
            </Link>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm overflow-x-auto">
              <Link href="/" className="text-gray-500 hover:text-accent transition-colors flex items-center gap-1">
                <Home className="h-4 w-4" />
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <BreadcrumbArrow className="h-4 w-4 text-gray-400" />
                  <Link
                    href={crumb.href}
                    className={`transition-colors whitespace-nowrap ${crumb.isLast ? "font-semibold" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                    style={crumb.isLast ? { color: userColors.primary } : {}}
                  >
                    {crumb.name}
                  </Link>
                </div>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium shadow-md hover:bg-red-600"
              >
                Logout
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-accentHover/20"
              >
                <User className="h-5 w-5 text-accent-700 dark:text-accent-400" />
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
