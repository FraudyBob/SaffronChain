"use client";
import { motion } from "framer-motion";

export default function TraceTimeline({ items = [] }) {
  if (!items?.length) {
    return (
      <div className="text-gray-400 text-sm">No trace records found.</div>
    );
  }

  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-white/10" />
      <ul className="space-y-4">
        {items.map((t, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="relative"
          >
            <div className="absolute -left-[9px] top-1 w-3 h-3 rounded-full bg-accent" />
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-gray-200 text-sm font-medium">{t.stage || t.event || "Stage"}</p>
              <div className="text-gray-400 text-xs mt-1 space-y-0.5">
                {t.company && <p>Company: {t.company}</p>}
                {t.location && <p>Location: {t.location}</p>}
              </div>
              {t.timestamp && (
                <p className="text-gray-500 text-xs mt-2">{new Date(t.timestamp).toLocaleString()}</p>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
