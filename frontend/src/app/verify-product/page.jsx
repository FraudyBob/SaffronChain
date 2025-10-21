"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Package, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Building2,
  Hash,
  ArrowLeft,
  RefreshCw,
  Copy,
  ExternalLink
} from "lucide-react";
import { Button, Card, Badge, TextInput, Label } from "flowbite-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function VerifyProduct() {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: payload.sub, role: payload.role });
      } catch (error) {
        localStorage.removeItem("token");
      }
    }

    // Check for product_id in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const urlProductId = urlParams.get('product_id');
    if (urlProductId) {
      setProductId(urlProductId);
      handleVerify(urlProductId);
    }
  }, []);

  const handleVerify = async (id = productId) => {
    if (!id.trim()) {
      toast.error("Please enter a product ID");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/verify/${id}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProduct(data);
        toast.success("Product verified successfully!");
      } else {
        setProduct(null);
        toast.error(data.detail || "Product not found");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Created": return "blue";
      case "Processing": return "yellow";
      case "In Transit": return "purple";
      case "Delivered": return "green";
      default: return "gray";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered": return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Package className="h-5 w-5 text-blue-500" />;
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
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Verify Product
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Authenticate and verify product information using blockchain technology
          </p>
        </div>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-8"
      >
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="product_id" value="Product ID" />
              <div className="flex space-x-2">
                <TextInput
                  id="product_id"
                  placeholder="Enter product ID (e.g., TUR001)"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button
                  type="submit"
                  color="blue"
                  disabled={isLoading}
                  className="px-6"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Demo Product IDs */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try these demo products:</p>
            <div className="flex flex-wrap gap-2">
              {["TUR001", "TUR002", "TUR003"].map((id) => (
                <Button
                  key={id}
                  color="light"
                  size="sm"
                  onClick={() => {
                    setProductId(id);
                    handleVerify(id);
                  }}
                  className="text-xs"
                >
                  {id}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Product Details */}
      {product && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Product Status Card */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getStatusIcon(product.status)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Product Verified
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Authentic product found on blockchain
                  </p>
                </div>
              </div>
              <Badge color={getStatusColor(product.status)} size="lg">
                {product.status}
              </Badge>
            </div>
          </Card>

          {/* Product Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Product Information
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Product ID</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm text-gray-900 dark:text-white">{productId}</span>
                    <Button
                      color="light"
                      size="xs"
                      onClick={() => copyToClipboard(productId)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</span>
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">{product.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Batch</span>
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">{product.batch}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Manufacturer</span>
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">{product.manufacturer}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Blockchain Details
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Registered</span>
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatDate(product.timestamp)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Verification</span>
                  </div>
                  <Badge color="green" size="sm">
                    Verified
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                  </div>
                  <Badge color={getStatusColor(product.status)} size="sm">
                    {product.status}
                  </Badge>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    This product has been verified on the Ethereum blockchain
                  </p>
                  <Button
                    color="light"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(`https://sepolia.etherscan.io/`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    View on Etherscan
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <Card>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Available Actions
            </h4>
            <div className="flex flex-wrap gap-3">
              <Button color="blue" href={`/qr-display?product_id=${productId}`}>
                <Package className="h-4 w-4 mr-2" />
                Generate QR Code
              </Button>
              {user && (user.role === 'admin' || user.role === 'producer') && (
                <Button color="yellow" href={`/update-status?product_id=${productId}`}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
              )}
              <Button color="light" onClick={() => copyToClipboard(window.location.href)}>
                <Copy className="h-4 w-4 mr-2" />
                Share Link
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* No Product Found */}
      {!product && !isLoading && productId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card>
            <div className="text-center py-8">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Product Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The product ID "{productId}" was not found on the blockchain.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please check the product ID and try again, or contact the manufacturer.
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
