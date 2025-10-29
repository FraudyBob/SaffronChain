"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Factory, MapPin, Calendar, ExternalLink, TrendingUp, QrCode } from "lucide-react";
import TraceTimeline from "@/components/TraceTimeline";
import { userColors } from "@/config/colors";

export default function ProductDetailModal({ product, open, onClose, onGenerateQR }) {
  if (!open || !product) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-2xl pointer-events-auto"
            >
              {/* Header */}
              <div className="relative border-b border-gray-200 dark:border-gray-700 p-6">
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: `linear-gradient(to right, ${userColors.primary}, ${userColors.primaryHover}, ${userColors.primary})`,
                  }}
                />
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-3 rounded-xl shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                      }}
                    >
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {product.name}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
                        {product.product_id}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {onGenerateQR && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onGenerateQR(product.product_id, product.tx_hash)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                        style={{
                          background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                          color: 'white',
                        }}
                      >
                        <QrCode className="h-4 w-4" />
                        Generate QR
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-8">
                {/* Product Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                  >
                    <Factory className="h-5 w-5 mb-2" style={{ color: userColors.primary }} />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Manufacturer</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {product.manufacturer}
                    </p>
                  </motion.div>

                  {product.batch && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                    >
                      <Package className="h-5 w-5 mb-2" style={{ color: userColors.primary }} />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Batch</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {product.batch}
                      </p>
                    </motion.div>
                  )}

                  {product.saffron_region && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                    >
                      <MapPin className="h-5 w-5 mb-2" style={{ color: userColors.primary }} />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Region</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {product.saffron_region}
                      </p>
                    </motion.div>
                  )}

                  {product.harvest_season && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                    >
                      <Calendar className="h-5 w-5 mb-2" style={{ color: userColors.primary }} />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Harvest Date</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {new Date(Number(product.harvest_season) * 1000).toLocaleDateString()}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Status Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Current Status</p>
                      <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
                        {product.status || "Pending"}
                      </p>
                    </div>
                  </div>
                  
                  {product.tx_hash && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={`https://sepolia.etherscan.io/tx/${product.tx_hash.startsWith("0x") ? product.tx_hash : `0x${product.tx_hash}`}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="hidden sm:inline">View on Blockchain</span>
                    </motion.a>
                  )}
                </motion.div>

                {/* Trace Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900/50 p-6"
                >
                  <TraceTimeline productId={product.product_id} autoRefresh={true} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
