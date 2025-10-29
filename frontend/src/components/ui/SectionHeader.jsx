"use client";
import { motion } from "framer-motion";

export default function SectionHeader({ title, subtitle }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold gradient-text">{title}</h2>
      {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
    </motion.div>
  );
}
