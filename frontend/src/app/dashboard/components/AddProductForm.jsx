"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Badge, Button } from "flowbite-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { userColors } from "@/config/colors";

export default function AddProductForm({ onSuccess }) {
  const [form, setForm] = useState({
    product_id: "",
    name: "",
    batch: "",
    manufacturer: "",
    saffron_region: "",
    harvest_season: "",
  });
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txMessage, setTxMessage] = useState("");
  const [txStatus, setTxStatus] = useState("idle"); // idle | pending | confirmed

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTxStatus("pending");
    setTxHash("");
    setTxMessage("");
    try {
      // simple required validation
      if (!form.product_id || !form.name || !form.batch || !form.manufacturer || !form.saffron_region || !form.harvest_season) {
        toast.error("Please fill all fields in order");
        setLoading(false);
        setTxStatus("idle");
        return;
      }
      const payload = {
        product_id: form.product_id,
        name: form.name,
        batch: form.batch,
        manufacturer: form.manufacturer,
        saffron_region: form.saffron_region,
        harvest_season: form.harvest_season ? new Date(form.harvest_season).getTime() : 0,
      };
      const res = await api.post("/add-spice", payload);
      const hash = res?.data?.tx_hash || "";
      const msg = res?.data?.message || "Product registered successfully";
      setTxHash(hash);
      setTxMessage(msg);

      // Etherscan link (Sepolia)
      const hash0x = hash ? (hash.startsWith("0x") ? hash : `0x${hash}`) : "";
      const link = hash0x ? `https://sepolia.etherscan.io/tx/${hash0x}` : "";

      // Toast with Etherscan link
      toast.custom(
        (t) => (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg text-sm text-gray-900 dark:text-gray-200">
            <div className="font-medium text-gray-900 dark:text-white mb-1">{msg}</div>
            {hash && (
              <a href={link} target="_blank" rel="noreferrer" className="text-accent hover:underline break-all">
                View on Etherscan: {hash}
              </a>
            )}
          </div>
        ),
        { duration: 6000 }
      );

      // Simulate pending -> confirmed
      setTimeout(() => setTxStatus("confirmed"), 3000);

      // Reset form
      setForm({ product_id: "", name: "", batch: "", manufacturer: "", saffron_region: "", harvest_season: "" });
      onSuccess?.();
    } catch (err) {
      console.error(err);
      const apiMsg = err?.response?.data?.detail || err?.response?.data?.message || "Failed to register product";
      toast.error(apiMsg);
      setTxStatus("idle");
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
          <Plus className="h-5 w-5" style={{ color: userColors.primary }} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Register Product</h3>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="product_id" value={form.product_id} onChange={onChange} required placeholder="Product ID" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" />
          <input name="name" value={form.name} onChange={onChange} required placeholder="Name" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="batch" value={form.batch} onChange={onChange} required placeholder="Batch" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" />
          <select name="manufacturer" value={form.manufacturer} onChange={onChange} required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 dark:text-white transition-all">
            <option value="">Select Manufacturer</option>
            <option value="GoldenSpice Ltd">GoldenSpice Ltd</option>
            <option value="Kerala Organics">Kerala Organics</option>
            <option value="SpiceWorks">SpiceWorks</option>
            <option value="FarmGrow">FarmGrow</option>
            <option value="Turmerica">Turmerica</option>
            <option value="FreshHarvest">FreshHarvest</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="saffron_region" value={form.saffron_region} onChange={onChange} required placeholder="Saffron Region" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" />
          <input type="date" name="harvest_season" value={form.harvest_season} onChange={onChange} required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 dark:text-white transition-all" />
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          disabled={loading} 
          type="submit" 
          className="px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          style={{
            background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
            color: 'white',
          }}
        >
          {loading ? "Submitting..." : "Add Product"}
        </motion.button>
      </form>

      {/* Transaction status / confirmation card */}
      <AnimatePresence>
        {txStatus !== "idle" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-4">
            <Card className="bg-white/5 border border-white/10 text-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Blockchain Transaction</p>
                  <h4 className="text-lg font-semibold text-white">{txMessage || "Submitting to network"}</h4>
                </div>
                <Badge color={txStatus === "confirmed" ? "success" : "warning"}>
                  {txStatus === "confirmed" ? "Confirmed" : "Pending"}
                </Badge>
              </div>
              {txHash && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400">Tx Hash</p>
                  <p className="text-sm break-all">
                    {txHash}
                  </p>
                </div>
              )}
              {txHash && (
                <div className="mt-3">
                  <a href={`https://sepolia.etherscan.io/tx/${txHash && (txHash.startsWith("0x") ? txHash : `0x${txHash}`)}`} target="_blank" rel="noreferrer">
                    <Button color="light" className="bg-white/10 hover:bg-white/20 text-gray-100">
                      View on Etherscan
                    </Button>
                  </a>
                </div>
              )}
              {txStatus === "pending" && (
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3 }} className="h-1 bg-accent rounded mt-3" />
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

