"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sprout, 
  Factory, 
  Store, 
  Truck, 
  Package, 
  CheckCircle2,
  MapPin,
  Building2,
  Calendar,
  Loader2
} from "lucide-react";
import { api } from "@/lib/api";

// Saffron-inspired color palette
const SAFFRON_COLORS = {
  primary: "#D4AF37", // Gold
  secondary: "#C19A6B", // Camel/tan
  accent: "#8B4513", // Saddle brown
  light: "#F5E6D3", // Cream
  glow: "rgba(212, 175, 55, 0.4)", // Gold glow
};

// Stage configuration with icons and colors
const STAGE_CONFIG = {
  Farm: {
    icon: Sprout,
    color: "#10B981", // Emerald green
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    borderLight: "border-emerald-200 dark:border-emerald-800",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  Harvest: {
    icon: Sprout,
    color: "#10B981",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    borderLight: "border-emerald-200 dark:border-emerald-800",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  Processing: {
    icon: Factory,
    color: "#F59E0B", // Amber
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
    borderLight: "border-amber-200 dark:border-amber-800",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  Factory: {
    icon: Factory,
    color: "#F59E0B",
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
    borderLight: "border-amber-200 dark:border-amber-800",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  Quality: {
    icon: CheckCircle2,
    color: "#8B5CF6", // Violet
    bgLight: "bg-violet-50 dark:bg-violet-900/20",
    borderLight: "border-violet-200 dark:border-violet-800",
    textColor: "text-violet-600 dark:text-violet-400",
  },
  Distribution: {
    icon: Truck,
    color: "#3B82F6", // Blue
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    borderLight: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  Store: {
    icon: Store,
    color: "#EC4899", // Pink
    bgLight: "bg-pink-50 dark:bg-pink-900/20",
    borderLight: "border-pink-200 dark:border-pink-800",
    textColor: "text-pink-600 dark:text-pink-400",
  },
  Retail: {
    icon: Store,
    color: "#EC4899",
    bgLight: "bg-pink-50 dark:bg-pink-900/20",
    borderLight: "border-pink-200 dark:border-pink-800",
    textColor: "text-pink-600 dark:text-pink-400",
  },
  Delivered: {
    icon: Package,
    color: "#059669", // Green
    bgLight: "bg-green-50 dark:bg-green-900/20",
    borderLight: "border-green-200 dark:border-green-800",
    textColor: "text-green-600 dark:text-green-400",
  },
};

// Floating saffron petal animation
const FloatingPetal = ({ delay = 0 }) => (
  <motion.div
    initial={{ y: -20, x: 0, opacity: 0, rotate: 0 }}
    animate={{
      y: [0, 100, 200],
      x: [0, 30, -20, 40],
      opacity: [0, 0.6, 0.4, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute w-3 h-3 rounded-full"
    style={{
      background: `radial-gradient(circle, ${SAFFRON_COLORS.primary}, ${SAFFRON_COLORS.secondary})`,
      filter: "blur(1px)",
    }}
  />
);

export default function TraceTimeline({ productId, autoRefresh = false, refreshInterval = 10000 }) {
  const [traces, setTraces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTraces = async () => {
    if (!productId) {
      setError("Product ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/get-traces/${productId}`);
      setTraces(response.data.traces || []);
    } catch (err) {
      console.error("Error fetching traces:", err);
      setError(err?.response?.data?.detail || "Failed to load trace data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraces();
  }, [productId]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchTraces();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, productId]);

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && traces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading trace timeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-8 text-center">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (traces.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 p-8 text-center">
        <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No trace records found for this product yet.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Floating saffron petals background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(5)].map((_, i) => (
          <FloatingPetal key={i} delay={i * 1.5} />
        ))}
      </div>

      {/* Timeline header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Saffron Journey Timeline
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track every step from farm to your hands
        </p>
      </motion.div>

      {/* Timeline container */}
      <div className="relative">
        {/* Desktop: Horizontal timeline */}
        <div className="hidden md:block">
          <div className="relative flex items-start justify-between gap-4 px-4">
            {traces.map((trace, index) => {
              const stageConfig = STAGE_CONFIG[trace.stage] || STAGE_CONFIG.Processing;
              const Icon = stageConfig.icon;
              const isLast = index === traces.length - 1;

              return (
                <div key={index} className="relative flex-1">
                  {/* Connecting line */}
                  {!isLast && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="absolute top-12 left-1/2 w-full h-1 origin-left"
                      style={{
                        background: `linear-gradient(to right, ${stageConfig.color}, ${
                          STAGE_CONFIG[traces[index + 1]?.stage]?.color || stageConfig.color
                        })`,
                        boxShadow: `0 0 10px ${SAFFRON_COLORS.glow}`,
                      }}
                    />
                  )}

                  {/* Stage node */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative z-10 flex flex-col items-center"
                  >
                    {/* Icon circle */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`relative w-24 h-24 rounded-full ${stageConfig.bgLight} ${stageConfig.borderLight} border-2 shadow-lg flex items-center justify-center mb-4`}
                      style={{
                        boxShadow: `0 4px 20px ${stageConfig.color}40`,
                      }}
                    >
                      <Icon className="h-10 w-10" style={{ color: stageConfig.color }} />
                      
                      {/* Pulse animation */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-full border-2"
                        style={{ borderColor: stageConfig.color }}
                      />
                    </motion.div>

                    {/* Stage details */}
                    <div className="text-center space-y-1 max-w-[140px]">
                      <h4 className={`text-sm font-bold ${stageConfig.textColor}`}>
                        {trace.stage}
                      </h4>
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{trace.company}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{trace.location}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span className="truncate">{formatDate(trace.timestamp)}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="md:hidden space-y-6">
          {traces.map((trace, index) => {
            const stageConfig = STAGE_CONFIG[trace.stage] || STAGE_CONFIG.Processing;
            const Icon = stageConfig.icon;
            const isLast = index === traces.length - 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex gap-4"
              >
                {/* Vertical connecting line */}
                {!isLast && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                    className="absolute left-8 top-16 w-1 h-full origin-top"
                    style={{
                      background: `linear-gradient(to bottom, ${stageConfig.color}, ${
                        STAGE_CONFIG[traces[index + 1]?.stage]?.color || stageConfig.color
                      })`,
                    }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`relative z-10 w-16 h-16 rounded-full ${stageConfig.bgLight} ${stageConfig.borderLight} border-2 shadow-md flex items-center justify-center flex-shrink-0`}
                  style={{
                    boxShadow: `0 2px 12px ${stageConfig.color}40`,
                  }}
                >
                  <Icon className="h-7 w-7" style={{ color: stageConfig.color }} />
                </motion.div>

                {/* Details card */}
                <div className="flex-1 pb-6">
                  <div className={`rounded-xl ${stageConfig.bgLight} ${stageConfig.borderLight} border p-4 shadow-sm`}>
                    <h4 className={`text-base font-bold ${stageConfig.textColor} mb-2`}>
                      {trace.stage}
                    </h4>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3 w-3" />
                        <span>{trace.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{trace.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(trace.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Summary footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: traces.length * 0.15 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800">
          <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
            {traces.length} stage{traces.length !== 1 ? "s" : ""} tracked
          </span>
        </div>
      </motion.div>
    </div>
  );
}
