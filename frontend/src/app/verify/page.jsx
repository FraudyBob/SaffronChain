"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import TraceTimeline from "@/components/TraceTimeline";
import { Shield, ExternalLink, CheckCircle } from "lucide-react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [traces, setTraces] = useState([]);
  const [error, setError] = useState("");
  const [fromQR, setFromQR] = useState(false);

  // Auto-verify if product_id in URL (QR scan)
  useEffect(() => {
    const qrProductId = searchParams.get("product_id");
    if (qrProductId) {
      setProductId(qrProductId);
      setFromQR(true);
      // Auto-verify after a brief delay for UX
      setTimeout(() => {
        verifyProduct(qrProductId);
      }, 300);
    }
  }, [searchParams]);

  const verifyProduct = async (pid) => {
    const id = pid || productId;
    if (!id) return;
    setLoading(true);
    setError("");
    setProduct(null);
    setTraces([]);
    try {
      const res = await api.get(`/verify/${encodeURIComponent(id)}`);
      setProduct(res.data || null);
      try {
        const tr = await api.get(`/get-traces/${encodeURIComponent(id)}`);
        setTraces(tr.data || []);
      } catch {
        setTraces([]);
      }
    } catch (err) {
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (e) => {
    e?.preventDefault?.();
    verifyProduct();
  };

  return (
    <div className="w-full min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text">Verify Product</h1>
        <p className="text-gray-400 mt-2">
          {fromQR ? "Verifying product from QR scan..." : "Enter a product ID to verify authenticity and view its journey."}
        </p>
      </motion.div>

      <form onSubmit={onVerify} className="flex gap-3 mb-8">
        <input
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Enter or scan Product ID"
          className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
        />
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading || !productId} className="px-6 py-3 rounded-lg bg-gradient-to-r from-accent to-accentHover text-black font-semibold disabled:opacity-60">
          {loading ? "Verifying..." : "Verify"}
        </motion.button>
      </form>

      {error && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 mb-6">
          ❌ {error}
        </motion.div>
      )}

      {product && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Prominent Blockchain Verification Badge (for QR scans) */}
          {fromQR && product.tx_hash && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 shadow-xl border-2 border-green-500/30"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                      Verified on Blockchain
                    </h3>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                    This product is authentic and registered on the Ethereum blockchain.
                  </p>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${product.tx_hash.startsWith("0x") ? product.tx_hash : `0x${product.tx_hash}`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:underline font-medium"
                  >
                    View Transaction on Etherscan
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{product.name || product.product_name || "Product"}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">ID: {product.product_id}</p>
              {(product.manufacturer || product.manufacturer_name) && (
                <p className="text-gray-400 text-sm">Manufacturer: {product.manufacturer || product.manufacturer_name}</p>
              )}
            </div>
            <span className="px-3 py-1.5 rounded-full text-sm bg-green-500/20 text-green-400 border border-green-500/30">
              Verified Authentic
            </span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Supply Chain Journey</h4>
            <TraceTimeline productId={productId} autoRefresh={fromQR} />
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
}

