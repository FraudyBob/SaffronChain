"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  Search, 
  Plus, 
  TrendingUp, 
  Users, 
  Activity,
  RefreshCw,
  Filter,
  Download
} from "lucide-react";
import { Button, Card, Badge } from "flowbite-react";
import toast from "react-hot-toast";
import TimelineChart from "./TimelineChart";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    verifiedProducts: 0,
    totalTraces: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ email: payload.sub, role: payload.role });
    } catch (error) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // For demo purposes, create mock data since the backend doesn't have a real products endpoint
        const mockProducts = [
          {
            id: "TUR001",
            name: "Organic Turmeric",
            batch: "BATCH-2024-001",
            manufacturer: "Green Farms Co.",
            status: "Delivered",
            timestamp: Date.now() - 86400000,
            traces: 3
          },
          {
            id: "TUR002", 
            name: "Premium Turmeric",
            batch: "BATCH-2024-002",
            manufacturer: "Spice Masters",
            status: "In Transit",
            timestamp: Date.now() - 172800000,
            traces: 2
          },
          {
            id: "TUR003",
            name: "Golden Turmeric",
            batch: "BATCH-2024-003", 
            manufacturer: "Herb Garden",
            status: "Processing",
            timestamp: Date.now() - 259200000,
            traces: 1
          }
        ];
        
        setProducts(mockProducts);
        setStats({
          totalProducts: mockProducts.length,
          activeProducts: mockProducts.filter(p => p.status !== "Delivered").length,
          verifiedProducts: mockProducts.filter(p => p.status === "Delivered").length,
          totalTraces: mockProducts.reduce((sum, p) => sum + p.traces, 0)
        });
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      toast.error("Network error while fetching products");
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
      default: return "gray";
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const exportData = () => {
    const csvContent = [
      "Product ID,Name,Batch,Manufacturer,Status,Date Added,Traces",
      ...products.map(p => `${p.id},${p.name},${p.batch},${p.manufacturer},${p.status},${formatDate(p.timestamp)},${p.traces}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.role}! Manage your supply chain products.
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button
            color="light"
            onClick={fetchProducts}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Button
            color="light"
            onClick={exportData}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Products", value: stats.totalProducts, icon: Package, color: "blue" },
          { title: "Active Products", value: stats.activeProducts, icon: Activity, color: "green" },
          { title: "Verified Products", value: stats.verifiedProducts, icon: TrendingUp, color: "purple" },
          { title: "Total Traces", value: stats.totalTraces, icon: Users, color: "yellow" }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Timeline Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Supply Chain Timeline
            </h3>
            <Badge color="blue" size="sm">
              Farm → Factory → Store
            </Badge>
          </div>
          <TimelineChart products={products} />
        </Card>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Products Overview
            </h3>
            <div className="flex space-x-2">
              <Button color="light" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button color="blue" size="sm" href="/register-product">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Manufacturer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date Added</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Traces</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{product.batch}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{product.manufacturer}</td>
                    <td className="px-6 py-4 text-sm"><Badge color={getStatusColor(product.status)}>{product.status}</Badge></td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDate(product.timestamp)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{product.traces} records</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <Button color="light" size="xs" href={`/verify-product?product_id=${product.id}`}>
                          <Search className="h-3 w-3" />
                        </Button>
                        <Button color="light" size="xs" href={`/update-status?product_id=${product.id}`}>
                          <Activity className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No products found. Add your first product to get started.
              </p>
              <Button color="blue" className="mt-4" href="/register-product">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}