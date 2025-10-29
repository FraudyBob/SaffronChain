"use client";
import { motion } from "framer-motion";
import { Package, MapPin, Calendar, Factory, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { userColors } from "@/config/colors";

export default function ProductTable({ products = [], loading = false, onRowClick, onAction, showActions = false, actionLabel = "Update", actionIcon: ActionIcon, showFull = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 w-full animate-pulse rounded-2xl bg-gradient-to-br from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-800/50" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, i) => {
        const isVerified = (product.status || "").toLowerCase() === "verified" || (product.status || "").toLowerCase() === "delivered";
        
        return (
          <motion.div
            key={product.product_id || i}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
            }}
            onClick={() => onRowClick?.(product)}
            className="relative group cursor-pointer"
          >
            {/* Glow effect */}
            <div 
              className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
              }}
            />
            
            {/* Card content */}
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              {/* Top gradient accent */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: `linear-gradient(to right, ${userColors.primary}, ${userColors.primaryHover}, ${userColors.primary})`,
                }}
              />
              
              {/* Status badge */}
              <div className="absolute top-4 right-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.05 * i + 0.2, type: "spring" }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    isVerified
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                  }`}
                >
                  {isVerified ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  {product.status || "Pending"}
                </motion.div>
              </div>

              {/* Product icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.05 * i + 0.1, type: "spring", stiffness: 200 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${userColors.primary}33, ${userColors.primaryHover}33)`,
                }}
              >
                <Package className="h-6 w-6" style={{ color: userColors.primary }} />
              </motion.div>

              {/* Product info */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate pr-20">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-mono">
                {product.product_id}
              </p>

              {/* Details grid */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Factory className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300 truncate">
                    {product.manufacturer}
                  </span>
                </div>
                
                {(showFull || product.saffron_region) && product.saffron_region && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300 truncate">
                      {product.saffron_region}
                    </span>
                  </div>
                )}

                {showFull && product.batch && (
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Batch: {product.batch}
                    </span>
                  </div>
                )}

                {showFull && product.harvest_season && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {new Date(Number(product.harvest_season) * 1000).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Action button */}
              {showActions && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction?.(product);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                    color: 'white',
                  }}
                >
                  {ActionIcon && <ActionIcon className="h-4 w-4" />}
                  <span>{actionLabel}</span>
                  {!ActionIcon && <ExternalLink className="h-4 w-4" />}
                </motion.button>
              )}

              {/* Hover indicator */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
                style={{
                  background: `linear-gradient(to right, ${userColors.primary}, ${userColors.primaryHover}, ${userColors.primary})`,
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
