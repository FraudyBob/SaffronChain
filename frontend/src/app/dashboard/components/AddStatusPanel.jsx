"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import UpdateStatusModal from "@/app/dashboard/components/UpdateStatusModal";

export default function AddStatusPanel({ initialProductId = "", onSuccess }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Update Status</h3>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setOpen(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent to-accentHover text-white font-semibold">
          Open
        </motion.button>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Open the modal to update a product status.</p>
      <UpdateStatusModal open={open} onClose={() => setOpen(false)} initialProductId={initialProductId} onSuccess={onSuccess} />
    </div>
  );
}
