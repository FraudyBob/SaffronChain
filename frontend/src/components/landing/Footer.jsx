"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Sprout } from "lucide-react";
import { userColors } from "@/config/colors";

const quickLinks = [
  { label: "Producer Dashboard", href: "/dashboard/producer" },
  { label: "Seller Dashboard", href: "/dashboard/seller" },
  { label: "Consumer Verification", href: "/dashboard/consumer" },
  { label: "Admin Console", href: "/dashboard/admin" },
];

const contactInfo = [
  { icon: Mail, label: "hello@saffronchain.io" },
  { icon: Phone, label: "+91 7000 123 456" },
  { icon: MapPin, label: "Pampore, Kashmir" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative w-full border-t border-gray-200/70 dark:border-gray-800/70 py-12"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, ${userColors.bgLight}40 0%, transparent 60%)`,
        }}
      />

      <div className="container mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-3">
              <span
                className="p-2.5 rounded-xl shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                }}
              >
                <Sprout className="h-5 w-5 text-white" />
              </span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                SaffronChain
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-sm">
              Powering saffron transparency with ethical sourcing, blockchain verification, and immersive storytelling across the entire supply chain.
            </p>
            <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>© {new Date().getFullYear()} SaffronChain</span>
              <span>•</span>
              <span>All rights reserved</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="space-y-4"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <nav className="grid gap-2 text-sm text-gray-600 dark:text-gray-300">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-gray-900 dark:hover:text-white transition"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {contactInfo.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-gray-400" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
