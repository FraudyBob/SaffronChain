"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { userColors } from "@/config/colors";

const pillars = [
  {
    title: "Heritage Sourcing",
    description: "We partner with lineage farmers in Pampore, Pulwama, Kishtwar, and Budgam to preserve centuries-old saffron cultivation practices.",
  },
  {
    title: "Blockchain Assurance",
    description: "Each batch is notarized with provenance proof, quality metadata, and transport checkpoints verified by a decentralized ledger.",
  },
  {
    title: "Luxury Experience",
    description: "Retailers and consumers access a living story behind every saffron thread through immersive dashboards and QR storytelling.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative w-full py-24 md:py-32">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${userColors.bgAccent}15 60%, transparent 100%)`,
          }}
        />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Imagery */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-3xl bg-white/50 dark:bg-gray-900/50 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-2xl">
              <Image
                src="/images/saffron-fields.jpg"
                alt="Saffron farmers cultivating fields"
                width={640}
                height={480}
                className="object-cover"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white px-6 py-6 space-y-2">
                <p className="text-sm uppercase tracking-wider text-white/70">Founded 2023 · Kashmir</p>
                <h3 className="text-xl font-semibold">Empowering Saffron Communities</h3>
                <p className="text-xs text-white/80">
                  98% of producers on SaffronChain report higher margins through transparency-driven trust.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-white/80 dark:bg-gray-900/70 border border-white/60 dark:border-gray-700/60 shadow-sm">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              A Transparent Marketplace for the World’s Rarest Spice
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              SaffronChain was born to protect the heritage of Kashmiri saffron. We blend earth-friendly cultivation, ethical trade, and digital transparency to build trust across every hand that touches a saffron stigma.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 shadow-lg backdrop-blur-xl p-6"
                >
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 px-6 py-5 text-sm text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-900/60">
              We collaborate with cooperatives, regulators, and boutique retailers to ensure saffron excellence is celebrated globally.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
