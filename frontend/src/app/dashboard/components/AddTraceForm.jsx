"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { MapPin } from "lucide-react";
import { userColors } from "@/config/colors";

export default function AddTraceForm({ onSuccess }) {
  const [form, setForm] = useState({ product_id: "", stage: "", company: "", location: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.product_id || !form.stage || !form.company || !form.location) {
        toast.error("Please fill all fields in order");
        setLoading(false);
        return;
      }
      const payload = {
        product_id: form.product_id,
        stage: form.stage,
        company: form.company,
        location: form.location,
      };
      await api.post("/add-trace", payload);
      toast.success("Trace added successfully");
      setForm({ product_id: "", stage: "", company: "", location: "" });
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add trace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="relative group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Top gradient accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{
          background: `linear-gradient(to right, ${userColors.primary}, ${userColors.primaryHover}, ${userColors.primary})`,
        }}
      />
      
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="p-2 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${userColors.primary}33, ${userColors.primaryHover}33)`,
          }}
        >
          <MapPin className="h-5 w-5" style={{ color: userColors.primary }} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Trace Log</h3>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="product_id" value={form.product_id} onChange={onChange} required placeholder="Product ID" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select name="stage" value={form.stage} onChange={onChange} required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 dark:text-white transition-all">
            <option value="">Select Stage</option>
            <option value="Processing">Processing</option>
            <option value="Packaging">Packaging</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
          </select>
          <select name="company" value={form.company} onChange={onChange} required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 dark:text-white transition-all">
            <option value="">Select Company</option>
            <option value="Kashmir Valley Farms">Kashmir Valley Farms</option>
            <option value="Pampore Agro">Pampore Agro</option>
            <option value="Himalayan Spices">Himalayan Spices</option>
            <option value="Saffron Co.">Saffron Co.</option>
            <option value="Valley Logistics">Valley Logistics</option>
          </select>
          <input name="location" value={form.location} onChange={onChange} required placeholder="Location" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" />
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          disabled={loading} 
          type="submit" 
          className="px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 w-full md:w-auto"
          style={{
            background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
            color: 'white',
          }}
        >
          {loading ? "Submitting..." : "Add Trace"}
        </motion.button>
      </form>
    </motion.div>
  );
}
