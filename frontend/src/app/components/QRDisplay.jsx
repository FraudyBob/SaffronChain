"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Copy, Share, QrCode, AlertCircle, CheckCircle } from "lucide-react";
import { Button, Card, Label, TextInput, Alert, Badge } from "flowbite-react";
import toast from "react-hot-toast";

export function QRDisplay({ productId }) {
  const [qrData, setQrData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (productId) {
      generateQR(productId);
    }
  }, [productId]);

  const generateQR = async (id = productId) => {
    if (!id) return;

    setIsLoading(true);
    setError("");
    setQrData(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/generate-qr`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: id,
          frontend_url: window.location.origin
        })
      });

      if (response.ok) {
        const data = await response.json();
        setQrData(data);
        toast.success("QR code generated successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate QR code");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrData) return;
    
    const canvas = document.querySelector('#qr-canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `qr-code-${productId}.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success("QR code downloaded!");
    }
  };

  const copyLink = () => {
    if (!qrData) return;
    
    navigator.clipboard.writeText(qrData.verify_url).then(() => {
      toast.success("Verification link copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  const shareQR = () => {
    if (!qrData) return;
    
    if (navigator.share) {
      navigator.share({
        title: `QR Code for ${productId}`,
        text: `Verify this product: ${productId}`,
        url: qrData.verify_url
      }).then(() => {
        toast.success("QR code shared!");
      }).catch(() => {
        toast.error("Failed to share");
      });
    } else {
      copyLink();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
            <QrCode className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Generate QR Code
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create a QR code for product verification and sharing
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {error && (
            <Alert color="failure" icon={AlertCircle}>
              {error}
            </Alert>
          )}

          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2">Generating QR code...</span>
            </div>
          )}

          {qrData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700">
                <div className="flex items-center space-x-2 mb-6">
                  <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                    QR Code Generated
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* QR Code Display */}
                  <div className="text-center">
                    <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                      <QRCodeCanvas
                        id="qr-canvas"
                        value={qrData.verify_url}
                        size={200}
                        level="M"
                        includeMargin={true}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                      Scan to verify product
                    </p>
                  </div>

                  {/* QR Code Info */}
                  <div className="space-y-4">
                    <div>
                      <Label value="Product ID" />
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="font-mono font-semibold text-gray-900 dark:text-white">
                          {qrData.product_id}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label value="Verification URL" />
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                          {qrData.verify_url}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        color="light"
                        size="sm"
                        onClick={downloadQR}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </Button>
                      <Button
                        color="light"
                        size="sm"
                        onClick={copyLink}
                        className="flex items-center space-x-2"
                      >
                        <Copy className="h-4 w-4" />
                        <span>Copy Link</span>
                      </Button>
                      <Button
                        color="purple"
                        size="sm"
                        onClick={shareQR}
                        className="flex items-center space-x-2"
                      >
                        <Share className="h-4 w-4" />
                        <span>Share</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Usage Instructions */}
                <div className="mt-6 pt-6 border-t border-purple-200 dark:border-purple-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    How to Use This QR Code:
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• <strong>Print:</strong> Attach to product packaging for easy verification</li>
                    <li>• <strong>Share:</strong> Send to customers or partners for product verification</li>
                    <li>• <strong>Scan:</strong> Use any QR code scanner to verify product authenticity</li>
                    <li>• <strong>Track:</strong> Monitor product verification activity</li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
