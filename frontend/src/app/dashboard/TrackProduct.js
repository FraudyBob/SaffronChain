"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, MapPin, Calendar, User, Activity, AlertCircle, CheckCircle } from "lucide-react";
import { Button, Card, Label, TextInput, Alert, Badge } from "flowbite-react";
import toast from "react-hot-toast";

export default function TrackProduct() {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!productId.trim()) {
      setError("Please enter a product ID");
      return;
    }

    setIsLoading(true);
    setError("");
    setProduct(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/verify/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        toast.success("Product found successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Product not found");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Created": return "blue";
      case "Processing": return "yellow";
      case "In Transit": return "purple";
      case "Delivered": return "green";
      case "Farm": return "green";
      case "Factory": return "yellow";
      case "Store": return "blue";
      default: return "gray";
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
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
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Track Product
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a product ID to view its details and supply chain information
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="productId" value="Product ID" />
              <TextInput
                id="productId"
                type="text"
                placeholder="e.g., TUR001"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              />
            </div>
            <div className="flex items-end">
              <Button
                color="blue"
                onClick={handleTrack}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Track Product</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert color="failure" icon={AlertCircle}>
              {error}
            </Alert>
          )}

          {product && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                    Product Found
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Product Name</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Manufacturer</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{product.manufacturer}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Batch Number</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{product.batch}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Current Status</p>
                        <Badge color={getStatusColor(product.status)} size="sm">
                          {product.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Registration Date</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formatDate(product.timestamp)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Product ID</p>
                        <p className="font-mono font-semibold text-gray-900 dark:text-white">{productId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supply Chain Progress */}
                <div className="mt-6 pt-6 border-t border-green-200 dark:border-green-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Supply Chain Progress
                  </h4>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        product.status === "Farm" ? "bg-green-500 w-1/4" :
                        product.status === "Factory" ? "bg-yellow-500 w-1/2" :
                        product.status === "Store" ? "bg-blue-500 w-full" :
                        "bg-gray-400 w-0"
                      }`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>Farm</span>
                    <span>Factory</span>
                    <span>Store</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
