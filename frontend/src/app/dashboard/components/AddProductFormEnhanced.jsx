"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Plus, Sparkles, Package, MapPin, Calendar, RefreshCw } from "lucide-react";
import { userColors } from "@/config/colors";

// Curated Options
const SAFFRON_VARIETIES = [
  { value: "mongra_saffron", label: "Mongra Saffron", icon: "🌺" },
  { value: "lacha_saffron", label: "Lacha Saffron", icon: "🌸" },
  { value: "gucchi_saffron", label: "Gucchi Saffron", icon: "🍄" },
  { value: "zarda_saffron", label: "Zarda Saffron", icon: "🌼" },
];

const REGIONS = [
  { value: "pampore", label: "Pampore", icon: "🏔️" },
  { value: "pulwama", label: "Pulwama", icon: "⛰️" },
  { value: "kishtwar", label: "Kishtwar", icon: "🗻" },
  { value: "budgam", label: "Budgam", icon: "🏞️" },
];

const MANUFACTURERS = [
  { value: "kashmir_valley_farms", label: "Kashmir Valley Farms" },
  { value: "saffron_co", label: "Saffron Co." },
  { value: "himalayan_spices", label: "Himalayan Spices" },
  { value: "pampore_agro", label: "Pampore Agro" },
];

export default function AddProductFormEnhanced({ onSuccess }) {
  const [form, setForm] = useState({
    product_id: "",
    name: "",
    batch: "",
    manufacturer: "",
    region: "",
    harvest_season: "",
  });
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txMessage, setTxMessage] = useState("");

  // Auto-generate Batch ID
  const generateBatchId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const batchId = `SAF-${year}-${randomNum}`;
    setForm({ ...form, batch: batchId });
    toast.success(`Batch ID Generated: ${batchId}`, { icon: "✨" });
  };

  // Auto-generate Product ID
  useEffect(() => {
    if (!form.product_id) {
      const shortId = Math.random().toString(36).substring(2, 8).toUpperCase();
      setForm(f => ({ ...f, product_id: `PRD-${shortId}` }));
    }
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validation
      const required = ['product_id', 'name', 'batch', 'manufacturer', 'region', 'harvest_season'];
      const missing = required.filter(field => !form[field]);
      
      if (missing.length > 0) {
        toast.error(`Please fill all required fields: ${missing.join(', ')}`);
        setLoading(false);
        return;
      }

      const payload = {
        product_id: form.product_id,
        name: form.name,
        batch: form.batch,
        manufacturer: form.manufacturer,
        saffron_region: form.region,
        harvest_season: Math.floor(new Date(form.harvest_season).getTime() / 1000),
      };

      const res = await api.post("/add-spice", payload);
      const hash = res?.data?.tx_hash || "";
      const rawMsg = res?.data?.message || "Product registered successfully";
      const msg = rawMsg.replace(/spice product/gi, "Saffron product");
      
      setTxHash(hash);
      setTxMessage(msg);

      // Etherscan link
      const hash0x = hash ? (hash.startsWith("0x") ? hash : `0x${hash}`) : "";
      const link = hash0x ? `https://sepolia.etherscan.io/tx/${hash0x}` : "";

      // Success toast
      toast.custom(
        (t) => (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg text-sm">
            <div className="font-medium text-gray-900 dark:text-white mb-1">{msg}</div>
            {hash && (
              <a href={link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline break-all">
                View on Etherscan: {hash}
              </a>
            )}
          </div>
        ),
        { duration: 6000 }
      );

      // Reset form but keep generated Product ID pattern
      const shortId = Math.random().toString(36).substring(2, 8).toUpperCase();
      setForm({
        product_id: `PRD-${shortId}`,
        name: "",
        batch: "",
        manufacturer: "",
        region: "",
        harvest_season: "",
      });
      
      onSuccess?.();
    } catch (err) {
      console.error(err);
      const apiMsg = err?.response?.data?.detail || err?.response?.data?.message || "Failed to register product";
      toast.error(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Decorative gradient border */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-80"
        style={{
          background: `linear-gradient(to right, ${userColors.primary}, ${userColors.primaryHover})`,
        }}
      />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="p-2.5 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
            }}
          >
            <Plus className="h-6 w-6 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Register New Product
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Fill in the details to register a new saffron product on the blockchain
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Product ID & Batch ID Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product ID (Auto-generated, Read-only) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Package className="h-4 w-4" style={{ color: userColors.primary }} />
              Product ID
            </label>
            <input
              type="text"
              name="product_id"
              value={form.product_id}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-mono text-sm cursor-not-allowed"
            />
          </div>

          {/* Batch ID with Generator */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Sparkles className="h-4 w-4" style={{ color: userColors.primary }} />
              Batch ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="batch"
                value={form.batch}
                onChange={onChange}
                placeholder="SAF-2025-XXX"
                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-offset-0 text-gray-900 dark:text-white outline-none transition-all"
                style={{ focusRing: userColors.primary }}
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateBatchId}
                className="px-4 py-3 rounded-xl text-white shadow-md hover:shadow-lg transition-all"
                style={{
                  background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                }}
              >
                <RefreshCw className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Product Name (Dropdown of saffron types) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Package className="h-4 w-4" style={{ color: userColors.primary }} />
            Product Name
          </label>
          <select
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-offset-0 text-gray-900 dark:text-white outline-none transition-all"
          >
            <option value="">Select Saffron Type</option>
            {SAFFRON_VARIETIES.map(v => (
              <option key={v.value} value={v.label}>{v.icon} {v.label}</option>
            ))}
          </select>
        </div>

        {/* Manufacturer (Dropdown of predefined companies) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Manufacturer / Producer
          </label>
          <select
            name="manufacturer"
            value={form.manufacturer}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-offset-0 text-gray-900 dark:text-white outline-none transition-all"
          >
            <option value="">Select Manufacturer</option>
            {MANUFACTURERS.map(m => (
              <option key={m.value} value={m.label}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Removed separate variety field; name selects type */}

        {/* Region & Harvest Season Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Region */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="h-4 w-4" style={{ color: userColors.primary }} />
              Region
            </label>
            <select
              name="region"
              value={form.region}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-offset-0 text-gray-900 dark:text-white outline-none transition-all"
            >
              <option value="">Select Region</option>
              {REGIONS.map(r => (
                <option key={r.value} value={r.value}>
                  {r.icon} {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Harvest Season (Date Picker) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="h-4 w-4" style={{ color: userColors.primary }} />
              Harvest Season
            </label>
            <input
              type="date"
              name="harvest_season"
              value={form.harvest_season}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-offset-0 text-gray-900 dark:text-white outline-none transition-all"
            />
          </div>
        </div>

        {/* Removed Quality Grade and Packaging sections */}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full px-6 py-4 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            background: loading 
              ? '#9ca3af' 
              : `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
          }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Registering on Blockchain...
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Register Product
            </>
          )}
        </motion.button>

        {/* Transaction Hash Display */}
        <AnimatePresence>
          {txHash && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            >
              <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                ✅ {txMessage}
              </p>
              {txHash && (
                <p className="text-xs text-green-700 dark:text-green-400 font-mono break-all">
                  TX: {txHash}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
