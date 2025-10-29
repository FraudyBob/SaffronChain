"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BarChart4, Leaf, Users, Sparkles, Fingerprint } from "lucide-react";
import { userColors } from "@/config/colors";

const features = [
  {
    icon: ShieldCheck,
    title: "Immutable Proof",
    description: "Every saffron batch is sealed on-chain with tamper-proof traceability across harvest, processing, and delivery stages.",
  },
  {
    icon: BarChart4,
    title: "Real-time Insights",
    description: "Track batch quality, origin, and verification metrics with responsive dashboards designed for each stakeholder.",
  },
  {
    icon: Leaf,
    title: "Sustainable Farming",
    description: "Empower local farmers with transparent data on cultivation practices, fair pricing, and certified organic verification.",
  },
  {
    icon: Users,
    title: "Collaborative Network",
    description: "Connect producers, sellers, and consumers through a unified platform that keeps everyone aligned and informed.",
  },
  {
    icon: Sparkles,
    title: "Premium Quality",
    description: "Automated grade validation and curated checks ensure every saffron thread meets luxury standards before shipment.",
  },
  {
    icon: Fingerprint,
    title: "QR Authentication",
    description: "Instantly verify authenticity via QR scan, complete with blockchain transaction hash and provenance trail.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative w-full py-24 md:py-32">
      <div className="absolute inset-0 -z-10" style={{ background: `${userColors.bgLight}30` }} />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-white/80 dark:bg-gray-900/70 border border-white/60 dark:border-gray-700/60 shadow-sm">
            Core Advantages
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            A Transparent Journey from Field to Flavor
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            We built SaffronChain to secure the world’s most precious spice with verifiable data, collaborative workflows, and elegant design.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="relative h-full"
              >
                <div className="absolute inset-0 rounded-3xl bg-white/70 dark:bg-gray-900/70 border border-gray-200/60 dark:border-gray-700/60 shadow-lg backdrop-blur-xl" />
                <div className="relative p-8 space-y-5 rounded-3xl h-full">
                  <div
                    className="inline-flex items-center justify-center p-3 rounded-2xl shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${userColors.primary}20, ${userColors.primaryHover}30)`,
                      color: userColors.primaryHover,
                    }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
