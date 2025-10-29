"use client";
import { useEffect, useState } from "react";
import "flowbite";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigation } from "@/components/Navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

function LayoutContent({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);


  useEffect(() => {
    console.log("📍 [Layout] Auth state:", {
      mounted,
      loading,
      isAuthenticated,
      user,
      pathname,
    });
  }, [mounted, loading, isAuthenticated, user, pathname]);
  

  // Redirect logged-in users away from /login and /
  useEffect(() => {
    if (!mounted || loading) return;

    // Not authenticated: guard dashboard routes
    if (!isAuthenticated && pathname.startsWith("/dashboard")) {
      router.replace("/login");
      return;
    }

    // Authenticated: redirect away from /login
    if (isAuthenticated && (pathname === "/" || pathname === "/login")) {
      const role = user?.role?.toLowerCase?.();
      if (role) router.replace(`/dashboard/${role}`);
    }
  }, [mounted, loading, isAuthenticated, pathname, router, user]);
  

  if (!mounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#f9f6ef] dark:bg-[#121212]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full mb-4"
        />
        <span className="text-accent text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  const isAuthPage = ["/", "/login"].includes(pathname);
  const showGlobalNav = isAuthenticated && !isAuthPage && !pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen w-full bg-[#f9f6ef] dark:bg-[#121212] text-gray-900 dark:text-white transition-colors duration-300">
      {/* Global Navigation only for non-dashboard authenticated pages */}
      {showGlobalNav && <Navigation />}

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full w-full">
      <body className={`${inter.className} min-h-screen w-full m-0 p-0`}>
        <AuthProvider>
          <ThemeProvider>
            <LayoutContent>{children}</LayoutContent>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { background: "#1F2833", color: "#fff" },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
