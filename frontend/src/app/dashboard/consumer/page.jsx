"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserDashboardLayout from "@/components/UserDashboardLayout";
import TraceTimeline from "@/components/TraceTimeline";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { 
  ShoppingCart, Search, Package, MapPin, Calendar, Factory, 
  CheckCircle, Clock, ExternalLink, ChevronDown, ChevronUp, Shield, QrCode
} from "lucide-react";
import { userColors } from "@/config/colors";
import QRModal from "@/components/QRModal";

export default function ConsumerDashboard() {
  const [pid, setPid] = useState("");
  const [product, setProduct] = useState(null);
  const [traces, setTraces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [traceLoading, setTraceLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrProductId, setQrProductId] = useState(null);

  const onVerify = async () => {
    if (!pid) {
      toast.error("Please enter a Product ID");
      return;
    }
    setProduct(null);
    setTraces([]);
    setLoading(true);
    try {
      const res = await api.get(`/verify/${encodeURIComponent(pid)}`);
      setProduct(res.data || null);
      setTraceLoading(true);
      const tr = await api.get(`/get-traces/${encodeURIComponent(pid)}`);
      const data = tr.data;
      const normalized = Array.isArray(data) ? data : (data?.traces || data?.items || []);
      setTraces(normalized || []);
      toast.success("Product verified successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify product. Please check the Product ID.");
    } finally {
      setLoading(false);
      setTraceLoading(false);
    }
  };

  const isVerified = product && ((product.status || "").toLowerCase() === "verified" || (product.status || "").toLowerCase() === "delivered");

  return (
    <UserDashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-8 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60"
        >
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
            style={{ backgroundColor: `${userColors.primary}20` }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="p-3 rounded-xl shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                }}
              >
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Verify Product Authenticity
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Check origin, quality, and supply chain history
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl">
              Enter a Product ID to verify its authenticity and trace its journey from farm to your hands.
            </p>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Search className="h-5 w-5 text-accent-600 dark:text-accent-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product Verification</h2>
          </div>
          <div className="flex gap-3">
            <input
              value={pid}
              onChange={(e) => setPid(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onVerify()}
              placeholder="Enter Product ID (e.g., SAFF-2024-001)"
              className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onVerify}
              disabled={loading}
              className="px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                color: 'white',
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Verify</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-gradient-to-br from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-800/50" />
              ))}
            </motion.div>
          ) : product ? (
            <motion.div
              key="product"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Product Card */}
              <div className="relative group">
                <div 
                  className="absolute -inset-0.5 rounded-2xl opacity-30 blur-lg"
                  style={{
                    background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                  }}
                />
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-2xl overflow-hidden">
                  {/* Top gradient accent */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{
                      background: `linear-gradient(to right, ${userColors.primary}, ${userColors.primaryHover}, ${userColors.primary})`,
                    }}
                  />
                  
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                      {/* Status Badge */}
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
                        isVerified
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {isVerified ? (
                          <>
                            <CheckCircle className="h-5 w-5" />
                            <span>Verified Authentic</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-5 w-5" />
                            <span>{product.status || "Pending"}</span>
                          </>
                        )}
                      </div>

                      {/* Product Info */}
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mb-4">
                        ID: {product.product_id}
                      </p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                          <Factory className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Manufacturer</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.manufacturer}</p>
                          </div>
                        </div>
                        {product.saffron_region && (
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <MapPin className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Region</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.saffron_region}</p>
                            </div>
                          </div>
                        )}
                        {product.batch && (
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <Package className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Batch</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.batch}</p>
                            </div>
                          </div>
                        )}
                        {product.harvest_season && (
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <Calendar className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Harvest Date</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {new Date(Number(product.harvest_season) * 1000).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      {product.tx_hash && (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={`https://sepolia.etherscan.io/tx/${product.tx_hash.startsWith("0x") ? product.tx_hash : `0x${product.tx_hash}`}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>View on Blockchain</span>
                        </motion.a>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setQrProductId(product.product_id);
                          setQrOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d8a24f] to-[#c89540] text-white font-medium shadow-lg hover:shadow-xl transition-all"
                      >
                        <QrCode className="h-4 w-4" />
                        <span>Generate QR</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setExpanded((v) => !v)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                      >
                        {expanded ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            <span>Hide Timeline</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            <span>View Timeline</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Expandable Timeline Section */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <div 
                            className="h-6 w-1 rounded-full"
                            style={{
                              background: `linear-gradient(to bottom, ${userColors.primary}, ${userColors.primaryHover})`,
                            }}
                          />
                          Supply Chain Timeline
                        </h4>
                        {traceLoading ? (
                          <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <div key={i} className="h-20 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
                            ))}
                          </div>
                        ) : (
                          <TraceTimeline productId={pid} />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Info Card */}
        {!product && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
          >
            <Package className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Enter a Product ID above to verify authenticity
            </p>
          </motion.div>
        )}
        {/* QR Modal */}
        <QRModal
          productId={qrProductId}
          open={qrOpen}
          onClose={() => setQrOpen(false)}
        />
      </div>
    </UserDashboardLayout>
  );
}
