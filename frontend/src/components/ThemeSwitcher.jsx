"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";
import { colorPresets } from "@/config/colors";
import { useTheme } from "./ThemeProvider";

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('mint');
  const { applyPreset } = useTheme();

  const themes = [
    { id: 'mint', name: 'Mint', icon: '🌿' },
    { id: 'ocean', name: 'Ocean', icon: '🌊' },
    { id: 'forest', name: 'Forest', icon: '🌲' },
    { id: 'lavender', name: 'Lavender', icon: '💜' },
    { id: 'coral', name: 'Coral', icon: '🪸' },
    { id: 'sunset', name: 'Sunset', icon: '🌅' },
    { id: 'saffron', name: 'Saffron', icon: '🌼' },
    { id: 'amber', name: 'Amber', icon: '🍂' },
    { id: 'emerald', name: 'Emerald', icon: '💎' },
    { id: 'sapphire', name: 'Sapphire', icon: '💠' },
    { id: 'roseGold', name: 'Rose Gold', icon: '🌹' },
    { id: 'midnight', name: 'Midnight', icon: '🌙' },
    { id: 'peach', name: 'Peach', icon: '🍑' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('selectedTheme');
    if (saved && colorPresets[saved]) {
      setCurrentTheme(saved);
    }
  }, []);

  const applyTheme = (themeId) => {
    setCurrentTheme(themeId);
    applyPreset(themeId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
        title="Change Theme"
      >
        <Palette className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </motion.button>

      {/* Theme Selector Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Theme Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Choose Theme
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Select a color palette for your dashboard
                </p>
              </div>

              {/* Theme Grid */}
              <div className="p-4 grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {themes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => applyTheme(theme.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      currentTheme === theme.id
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    style={{
                      background: currentTheme === theme.id 
                        ? `linear-gradient(135deg, ${colorPresets[theme.id]?.bgLight}40, ${colorPresets[theme.id]?.bgAccent}40)`
                        : undefined
                    }}
                  >
                    {/* Color Preview */}
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg shadow-md"
                        style={{ backgroundColor: colorPresets[theme.id]?.primary }}
                      />
                      <div
                        className="w-4 h-8 rounded-lg shadow-md"
                        style={{ backgroundColor: colorPresets[theme.id]?.primaryHover }}
                      />
                    </div>

                    {/* Theme Info */}
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                        <span>{theme.icon}</span>
                        {theme.name}
                      </p>
                    </div>

                    {/* Selected Indicator */}
                    {currentTheme === theme.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 bg-green-500 rounded-full p-1"
                      >
                        <Check className="h-3 w-3 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Footer Info */}
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  Theme changes apply instantly to all pages
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
