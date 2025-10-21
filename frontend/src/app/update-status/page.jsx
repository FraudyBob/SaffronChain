"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  RefreshCw, 
  Package, 
  ArrowLeft,
  Save,
  CheckCircle,
  Truck,
  Factory,
  Store
} from "lucide-react";
import { Button, Card, Label, Select, Badge } from "flowbite-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function UpdateStatus() {
  const [productId, setProductId] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const statusOptions = [
    { value: "Created", label: "Created", icon: Package, color: "blue" },
    { value: "Processing", label: "Processing", icon: Factory, color: "yellow" },
    { value: "In Transit", label: "In Transit", icon: Truck, color: "purple" },
    { value: "Delivered", label: "Delivered", icon: Store, color: "green" }
  ];

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
      
      // Check if user has permission to update status
      if (!['admin', 'producer', 'seller'].includes(payload.role)) {
        toast.error("You don't have permission to update product status");
        window.location.href = "/dashboard";
        return;
      }
    } catch (error) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Check for product_id in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const urlProductId = urlParams.get('product_id');
    if (urlProductId) {
      setProductId(urlProductId);
      fetchProductStatus(urlProductId);
    }
  }, []);

  const fetchProductStatus = async (id = productId) => {
    if (!id.trim()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/verify/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setCurrentStatus(data.status);
        setNewStatus(data.status); // Initialize with current status
        toast.success("Product status loaded successfully!");
      } else {
        toast.error(data.detail || "Product not found");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    
    if (!productId.trim()) {
      toast.error("Please enter a product ID");
      return;
    }

    if (newStatus === currentStatus) {
      toast.error("Please select a different status");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/update-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: productId,
            status: newStatus
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setCurrentStatus(newStatus);
        toast.success(`Status updated to ${newStatus}! TX: ${data.tx_hash.slice(0, 10)}...`);
      } else {
        toast.error(data.detail || "Failed to update status");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.icon : Package;
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : "gray";
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
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Update Product Status
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Track and update product status throughout the supply chain
          </p>
        </div>
      </motion.div>

      {/* User Permission Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-8"
      >
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Permission: {user?.role}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
            <div className="text-right">
              <Badge color="green" size="lg">
                Can Update Status
              </Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Product ID Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <div className="space-y-4">
            <div>
              <Label htmlFor="product_id" value="Product ID" />
              <div className="flex space-x-2">
                <input
                  id="product_id"
                  type="text"
                  placeholder="Enter product ID (e.g., TUR001)"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button
                  color="blue"
                  onClick={() => fetchProductStatus()}
                  disabled={isLoading || !productId.trim()}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Package className="h-4 w-4" />
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
                      fetchProductStatus(id);
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

      {/* Status Update Form */}
      {currentStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-6"
        >
          {/* Current Status */}
          <Card>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Current Status
            </h4>
            <div className="flex items-center space-x-3">
              {React.createElement(getStatusIcon(currentStatus), { 
                className: `h-6 w-6 text-${getStatusColor(currentStatus)}-500` 
              })}
              <Badge color={getStatusColor(currentStatus)} size="lg">
                {currentStatus}
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Product ID: {productId}
              </span>
            </div>
          </Card>

          {/* Status Update Form */}
          <Card>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Update Status
            </h4>
            <form onSubmit={handleStatusUpdate} className="space-y-6">
              <div>
                <Label htmlFor="new_status" value="New Status" />
                <Select
                  id="new_status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Status Flow Visualization */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Supply Chain Flow
                </h5>
                <div className="flex items-center justify-between">
                  {statusOptions.map((option, index) => {
                    const Icon = option.icon;
                    const isActive = option.value === newStatus;
                    const isCompleted = statusOptions.findIndex(s => s.value === currentStatus) >= index;
                    
                    return (
                      <div key={option.value} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          isActive 
                            ? `bg-${option.color}-500 text-white` 
                            : isCompleted 
                              ? `bg-${option.color}-100 dark:bg-${option.color}-900 text-${option.color}-600 dark:text-${option.color}-400`
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className={`text-xs font-medium ${
                          isActive ? `text-${option.color}-600 dark:text-${option.color}-400` : 'text-gray-500'
                        }`}>
                          {option.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  color="blue"
                  disabled={isLoading || newStatus === currentStatus}
                  className="flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Update Status</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Status History */}
          <Card>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Status History
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentStatus}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Current
                </span>
              </div>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Status history will be available after implementing trace records
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* No Product Loaded */}
      {!currentStatus && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card>
            <div className="text-center py-12">
              <RefreshCw className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Load Product Status
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Enter a product ID above to load its current status and update it
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
