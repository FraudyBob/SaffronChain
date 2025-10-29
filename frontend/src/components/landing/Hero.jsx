"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sprout } from "lucide-react";
import { userColors } from "@/config/colors";

const heroStats = [
  { label: "Verified Batches", value: "12,840+" },
  { label: "Trusted Farmers", value: "2,150" },
  { label: "Global Sellers", value: "480" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-screen w-full flex items-center"
    >
      {/* Background gradients */}
      <div
        className="absolute inset-0 -z-10 w-full h-full"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${userColors.bgAccent}40, transparent 60%), linear-gradient(135deg, ${userColors.bgLight}, ${userColors.bgAccent})`,
        }}
      />

      <div className="container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-white/80 dark:bg-gray-900/70 border border-white/60 dark:border-gray-700/60 shadow-sm">
              <Sprout className="h-4 w-4" style={{ color: userColors.primary }} />
              Saffron Supply Chain Transparency
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Track Every Thread of <span style={{ color: userColors.primary }}>Authentic Saffron</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl">
              Seamlessly trace each saffron batch from Pampore fields to luxury boutiques worldwide. Powered by blockchain, trusted by farmers, sellers, and discerning consumers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition duration-300"
                style={{
                  background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                }}
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="#how"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-600 transition"
              >
                Explore the Journey
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              {heroStats.map((stat) => (
                <div key={stat.label} className="min-w-[140px]">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Illustration card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/40 dark:bg-gray-900/40 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-6 w-60 h-60 bg-white/30 dark:bg-gray-900/30 rounded-full blur-3xl" />

            <div className="relative rounded-3xl border border-white/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Latest Verified Batch</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">SAF-2025-104</p>
                </div>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100/80 dark:text-green-300 dark:bg-green-900/20"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-500 dark:text-gray-400">Variety</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Kashmiri Mongra</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 dark:text-gray-400">Region</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Pampore, Kashmir</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 dark:text-gray-400">Harvest</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Autumn 2024</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 dark:text-gray-400">Grade</p>
                  <p className="font-semibold text-gray-900 dark:text-white">A+</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Journey Snapshot
                </p>
                <div className="mt-3 grid grid-cols-4 gap-3 text-xs font-medium text-gray-600 dark:text-gray-300">
                  {['Farm', 'Processing', 'Quality', 'Delivered'].map((stage, index) => (
                    <div key={stage} className="flex flex-col items-start gap-2">
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(index + 1) * 25}%`,
                            background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                          }}
                        />
                      </div>
                      <span>{stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
