"use client";

import { motion } from "framer-motion";
import { Sprout, Factory, Package, Truck, ShieldCheck } from "lucide-react";
import { userColors } from "@/config/colors";

const steps = [
  {
    title: "Harvest & Batch Creation",
    description:
      "Farmers capture cultivation details, harvest season, and quality grade. Batch IDs are auto-generated and sealed with GPS markers.",
    icon: Sprout,
  },
  {
    title: "Processing & NFC Tagging",
    description:
      "Processing centers update curing, moisture checks, and packaging metadata. NFC/QR tags are assigned for seamless traceability.",
    icon: Factory,
  },
  {
    title: "Quality Verification",
    description:
      "Independent auditors review chemical and sensory tests. Certificates are logged with blockchain hashes for transparent reviews.",
    icon: ShieldCheck,
  },
  {
    title: "Distribution & Delivery",
    description:
      "Sellers update transport milestones. Consumers scan QR labels to view the full origin story and blockchain transaction proof.",
    icon: Truck,
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative w-full py-24 md:py-32">
      <div className="absolute inset-y-0 left-0 w-1/2 -z-10" style={{ background: `${userColors.bgAccent}20` }} />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-[380px,1fr] gap-16">
          {/* Intro card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 shadow-xl backdrop-blur-xl p-10 flex flex-col gap-6"
          >
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
              }}
            >
              <Package className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                How SaffronChain Works
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                A purposeful flow built for saffron artisans, distributors, and connoisseurs. Each stage is captured, verified, and shared.
              </p>
            </div>
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 px-6 py-5 text-sm text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-900/60">
              Blockchain events are recorded using tamper-proof smart contracts and can be independently audited in real time.
            </div>
          </motion.div>

          {/* Timeline */}
          <div className="space-y-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="relative pl-16"
                >
                  {/* Connector */}
                  {index < steps.length - 1 && (
                    <span
                      className="absolute left-6 top-16 w-0.5 h-full"
                      style={{
                        background: `linear-gradient(to bottom, ${userColors.primary}, transparent)`
                      }}
                    />
                  )}

                  {/* Icon */}
                  <span
                    className="absolute left-0 top-2 flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${userColors.primary}90, ${userColors.primaryHover}90)`,
                    }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </span>

                  {/* Content card */}
                  <div className="rounded-3xl border border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-900/80 shadow-lg backdrop-blur-xl p-6">
                    <p className="text-sm uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
