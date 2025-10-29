"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function UpdateStatusModal({ open, onClose, initialProductId = "", onSuccess }) {
  const [form, setForm] = useState({ product_id: initialProductId, status: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setForm({ product_id: initialProductId || "", status: "" });
  }, [initialProductId, open]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.product_id || !form.status) {
        toast.error("Product ID and Status are required");
        setLoading(false);
        return;
      }
      await api.post("/update-status", {
        product_id: form.product_id,
        status: form.status,
      });
      toast.success("Status updated successfully");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-200 dark:border-gray-700 relative">
            <h3 className="text-xl font-semibold mb-4">Update Status</h3>
            <form onSubmit={onSubmit} className="space-y-4">
              <input name="product_id" value={form.product_id} onChange={onChange} placeholder="Product ID" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
              <select name="status" value={form.status} onChange={onChange} className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white">
                <option value="">Select Status</option>
                <option value="Farm">Farm</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition">Cancel</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} type="submit" className="px-6 py-2 rounded-lg bg-gradient-to-r from-accent to-accentHover text-white font-semibold disabled:opacity-60">
                  {loading ? "Updating..." : "Update"}
                </motion.button>
              </div>
            </form>
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">✕</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
