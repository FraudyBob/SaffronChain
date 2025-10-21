"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  QrCode, 
  Download, 
  Copy, 
  Share2, 
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  Package
} from "lucide-react";
import { Button, Card, Badge } from "flowbite-react";
import Link from "next/link";
import toast from "react-hot-toast";

export function QRDisplay() {
  const [productId, setProductId] = useState("");
  const [qrData, setQrData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      window.location.href = "/login";
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ email: payload.sub, role: payload.role });
    } catch (error) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Check for product_id in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const urlProductId = urlParams.get('product_id');
    if (urlProductId) {
      setProductId(urlProductId);
      generateQR(urlProductId);
    }
  }, []);

  const generateQR = async (id = productId) => {
    if (!id.trim()) {
      toast.error("Please enter a product ID");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/generate-qr`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: id,
            frontend_url: window.location.origin
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setQrData(data);
        toast.success("QR code generated successfully!");
      } else {
        toast.error(data.detail || "Failed to generate QR code");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrData) return;
    
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${qrData.qr_code_data}`;
    link.download = `qr-code-${productId}.png`;
    link.click();
    toast.success("QR code downloaded!");
  };

  const copyQRData = () => {
    if (!qrData) return;
    
    navigator.clipboard.writeText(qrData.verify_url);
    toast.success("Verification URL copied to clipboard!");
  };

  const shareQR = async () => {
    if (!qrData) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Product Verification - ${productId}`,
          text: `Verify product ${productId} using blockchain technology`,
          url: qrData.verify_url
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      copyQRData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/dashboard">
            <Button color="light" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
            <QrCode className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            QR Code Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Generate QR codes for product verification and easy sharing
          </p>
        </div>
      </motion.div>

      {/* Product ID Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-8"
      >
        <Card>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product ID
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter product ID (e.g., TUR001)"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button
                  color="blue"
                  onClick={() => generateQR()}
                  disabled={isLoading || !productId.trim()}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <QrCode className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Demo Product IDs */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try these demo products:</p>
              <div className="flex flex-wrap gap-2">
                {["TUR001", "TUR002", "TUR003"].map((id) => (
                  <Button
                    key={id}
                    color="light"
                    size="sm"
                    onClick={() => {
                      setProductId(id);
                      generateQR(id);
                    }}
                    className="text-xs"
                  >
                    {id}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* QR Code Display */}
      {qrData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6"
        >
          {/* QR Code Card */}
          <Card>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg inline-block shadow-lg mb-4">
                <img
                  src={`data:image/png;base64,${qrData.qr_code_data}`}
                  alt={`QR Code for ${productId}`}
                  className="w-64 h-64 mx-auto"
                />
              </div>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  QR Code Generated
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Verification URL:</p>
                <p className="text-xs font-mono text-gray-900 dark:text-white break-all">
                  {qrData.verify_url}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  color="blue"
                  onClick={downloadQR}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
                
                <Button
                  color="light"
                  onClick={copyQRData}
                  className="flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy URL</span>
                </Button>
                
                <Button
                  color="green"
                  onClick={shareQR}
                  className="flex items-center space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* QR Code Information */}
          <Card>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              QR Code Information
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Product ID</span>
                  <Badge color="blue" size="sm">{qrData.product_id}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Generated</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Type</span>
                  <span className="text-sm text-gray-900 dark:text-white">Verification QR</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Size</span>
                  <span className="text-sm text-gray-900 dark:text-white">256x256px</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Format</span>
                  <span className="text-sm text-gray-900 dark:text-white">PNG</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                  <Badge color="green" size="sm">Active</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Usage Instructions */}
          <Card>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              How to Use This QR Code
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Print or Display
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Print the QR code on product packaging or display it digitally
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 dark:text-green-400 font-bold">2</span>
                </div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Scan with Phone
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Consumers can scan the QR code with their smartphone camera
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
                </div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Verify Product
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Instantly verify product authenticity and view blockchain data
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* No QR Code Generated */}
      {!qrData && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card>
            <div className="text-center py-12">
              <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Generate QR Code
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Enter a product ID above to generate a verification QR code
              </p>
              <div className="flex justify-center space-x-4">
                <Button color="blue" href="/dashboard">
                  <Package className="h-4 w-4 mr-2" />
                  View Products
                </Button>
                <Button color="light" href="/verify-product">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Product
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
