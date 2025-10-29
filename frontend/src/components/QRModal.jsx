"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Copy, Share2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function QRModal({ 
  productId, 
  open, 
  onClose, 
  autoFetchAfterRegistration = false,
  txHash = null 
}) {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const modalRef = useRef(null);

  // Clear QR data when modal closes
  useEffect(() => {
    if (!open) {
      setQrData(null);
      setError(null);
      setCopied(false);
      setCurrentProductId(null);
    }
  }, [open]);

  // Fetch QR code when modal opens or productId changes
  useEffect(() => {
    if (open && productId && productId !== currentProductId) {
      setCurrentProductId(productId);
      fetchQRCode();
    }
  }, [open, productId]);

  // Focus trap and ESC handler
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    const handleFocusTrap = (e) => {
      if (!modalRef.current) return;
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleFocusTrap);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleFocusTrap);
    };
  }, [open, onClose]);

  const fetchQRCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const etherscanBase = "https://sepolia.etherscan.io/tx/"; // match existing explorer usage
      const normalizedTx = txHash ? (txHash.startsWith("0x") ? txHash : `0x${txHash}`) : null;
      const target_url = normalizedTx ? `${etherscanBase}${normalizedTx}` : undefined;

      const response = await api.post(
        "/generate-qr",
        {
          product_id: productId,
          frontend_url: window.location.origin,
          ...(target_url ? { target_url } : {}),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQrData(response.data);
      toast.success("QR Code generated successfully!");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to generate QR code";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrData?.qr_code_data) return;

    const link = document.createElement("a");
    link.href = `data:image/png;base64,${qrData.qr_code_data}`;
    link.download = `saffronchain-qr-${productId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code downloaded!");
  };

  const handleCopy = async () => {
    if (!qrData?.verify_url) return;

    try {
      await navigator.clipboard.writeText(qrData.verify_url);
      setCopied(true);
      toast.success("Verify URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const handleShare = async () => {
    if (!qrData?.verify_url) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Verify Saffron Product",
          text: `Verify this authentic saffron product: ${productId}`,
          url: qrData.verify_url,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        if (err.name !== "AbortError") {
          handleCopy(); // Fallback to copy
        }
      }
    } else {
      handleCopy(); // Fallback if Share API not supported
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md pointer-events-auto"
            >
              <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#d8a24f]/20 overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#d8a24f]/10 via-transparent to-[#4a2c2a]/10 pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Product QR Code
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {productId}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 space-y-6">
                  {/* Transaction Hash Badge */}
                  {txHash && autoFetchAfterRegistration && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                          Registered on Blockchain
                        </p>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${txHash.startsWith("0x") ? txHash : `0x${txHash}`}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-green-700 dark:text-green-300 hover:underline flex items-center gap-1"
                        >
                          View on Etherscan
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </motion.div>
                  )}

                  {/* Loading State */}
                  {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 border-4 border-[#d8a24f] border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">Generating QR Code...</p>
                    </div>
                  )}

                  {/* Error State */}
                  {error && !loading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 space-y-4"
                    >
                      <AlertCircle className="h-16 w-16 text-red-500" />
                      <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchQRCode}
                        className="px-6 py-2 rounded-xl bg-[#d8a24f] text-white font-medium shadow-lg hover:bg-[#c89540] transition-colors"
                      >
                        Retry
                      </motion.button>
                    </motion.div>
                  )}

                  {/* QR Code Display */}
                  {qrData && !loading && !error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15, type: "spring" }}
                      className="space-y-4"
                    >
                      {/* QR Image with glow effect */}
                      <div className="flex justify-center">
                        <motion.div
                          whileHover={{ scale: 1.04 }}
                          className="relative p-4 rounded-2xl bg-white shadow-2xl"
                        >
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#d8a24f]/30 to-[#4a2c2a]/30 blur-xl animate-pulse-glow"></div>
                          <img
                            src={`data:image/png;base64,${qrData.qr_code_data}`}
                            alt="Product QR Code"
                            className="relative z-10 w-64 h-64 rounded-xl"
                          />
                        </motion.div>
                      </div>

                      {/* Verify URL */}
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Verify URL</p>
                        <p className="text-sm text-gray-900 dark:text-white font-mono break-all">
                          {qrData.verify_url}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleDownload}
                          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-[#d8a24f] to-[#c89540] text-white shadow-lg hover:shadow-xl transition-all"
                        >
                          <Download className="h-5 w-5" />
                          <span className="text-xs font-medium">Download</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCopy}
                          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
                        >
                          {copied ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                          <span className="text-xs font-medium">
                            {copied ? "Copied!" : "Copy URL"}
                          </span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleShare}
                          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all"
                        >
                          <Share2 className="h-5 w-5" />
                          <span className="text-xs font-medium">Share</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
