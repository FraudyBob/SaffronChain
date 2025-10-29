"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sprout, Sun, Moon } from "lucide-react";
import { userColors } from "@/config/colors";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useTheme } from "@/components/ThemeProvider";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How It Works" },
  { href: "#about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (id) => (e) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Quick slide animation cue
    el.classList.add('section-slide-in');
    window.setTimeout(() => el.classList.remove('section-slide-in'), 450);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 h-full backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/60 dark:border-gray-800/80" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[auto,1fr,auto] items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.span
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 15 }}
              className="p-2 rounded-xl shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
              }}
            >
              <Sprout className="h-5 w-5 text-white" />
            </motion.span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              SaffronChain
            </span>
          </Link>

          {/* Centered nav links */}
          <nav className="hidden md:flex items-center justify-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={scrollToSection(link.href)}
                className="hover:text-gray-900 dark:hover:text-white transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center justify-end gap-3">
            <ThemeSwitcher />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-white shadow-md hover:shadow-lg transition"
              style={{
                background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
              }}
            >
              Launch Dashboard
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg"
          >
            <div className="max-w-6xl mx-auto px-4 py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { setOpen(false); scrollToSection(link.href)(e); }}
                  className="block px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {link.label}
                </Link>
              ))}
              {/* Theme controls (mobile) */}
              <div className="flex items-center gap-2 px-3">
                <ThemeSwitcher />
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Toggle dark mode"
                >
                  {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>
              </div>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-3 rounded-xl text-white font-semibold shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                }}
              >
                Launch Dashboard
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
