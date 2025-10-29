"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  delay = 0,
  gradient = "from-accent/10 to-accentHover/10",
  iconColor = "text-accent-600 dark:text-accent-400"
}) {
  const isPositiveTrend = trend === "up";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        boxShadow: "0 20px 40px rgba(212, 160, 23, 0.15)"
      }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group`}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accentHover/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />

      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent to-accentHover rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1, duration: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
          >
            {value}
          </motion.h3>
          {trendValue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.2 }}
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositiveTrend
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isPositiveTrend ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{trendValue}</span>
            </motion.div>
          )}
        </div>

        {/* Icon with animated background */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: delay + 0.15, 
            duration: 0.5, 
            type: "spring",
            stiffness: 200
          }}
          whileHover={{ rotate: 360, scale: 1.1 }}
          className={`p-3 rounded-xl bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-700/30 shadow-lg ${iconColor}`}
        >
          <Icon className="h-6 w-6" />
        </motion.div>
      </div>

      {/* Animated bottom border */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accentHover to-accent origin-left"
      />
    </motion.div>
  );
}
