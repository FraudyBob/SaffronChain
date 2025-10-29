"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { colorPresets } from "@/config/colors";

const ThemeContext = createContext();

function applyCssVars(preset) {
  if (!preset) return;
  const root = document.documentElement;
  root.style.setProperty("--color-primary", preset.primary);
  root.style.setProperty("--color-primary-hover", preset.primaryHover);
  root.style.setProperty("--color-bg-light", preset.bgLight);
  root.style.setProperty("--color-bg-accent", preset.bgAccent);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark"); // dark | light
  const [mounted, setMounted] = useState(false);

  // Initialize theme mode and preset from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialMode = savedMode || (prefersDark ? "dark" : "light");
    setTheme(initialMode);
    document.documentElement.classList.toggle("dark", initialMode === "dark");

    // Apply saved color preset or default to 'mint'
    const savedPresetKey = localStorage.getItem("selectedTheme") || "mint";
    const preset = colorPresets[savedPresetKey] || colorPresets.mint;
    applyCssVars(preset);

    setMounted(true);
  }, []);

  // Persist theme mode changes
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const applyPreset = (presetKey) => {
    const preset = colorPresets[presetKey] || colorPresets.mint;
    applyCssVars(preset);
    localStorage.setItem("selectedTheme", presetKey);
  };

  if (!mounted) return null; // prevent hydration mismatch

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, applyPreset }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
