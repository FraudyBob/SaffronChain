"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Plus, Save, X } from "lucide-react";
import { Button, Card, Label, TextInput, Select } from "flowbite-react";
import toast from "react-hot-toast";

export function AddProductForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    product_id: "",
    name: "",
    batch: "",
    manufacturer: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/add-spice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(`Product registered successfully! TX: ${data.tx_hash.slice(0, 10)}...`);
        setForm({ product_id: "", name: "", batch: "", manufacturer: "" });
        if (onSuccess) onSuccess(data);
        if (onClose) onClose();
      } else {
        toast.error(data.detail || "Failed to register product");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateProductId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `TUR${timestamp}${random}`;
  };

  const manufacturers = [
    "Green Farms Co.",
    "Spice Masters",
    "Herb Garden",
    "Organic Harvest",
    "Premium Spices Ltd.",
    "Natural Products Inc."
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Product
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Register a new product to the blockchain
                </p>
              </div>
            </div>
            {onClose && (
              <Button
                color="light"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="product_id" value="Product ID" />
                <div className="flex space-x-2">
                  <TextInput
                    id="product_id"
                    name="product_id"
                    placeholder="Enter product ID"
                    value={form.product_id}
                    onChange={handleChange}
                    required
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    color="light"
                    onClick={() => setForm({ ...form, product_id: generateProductId() })}
                    className="px-3"
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Unique identifier for your product
                </p>
              </div>

              <div>
                <Label htmlFor="name" value="Product Name" />
                <TextInput
                  id="name"
                  name="name"
                  placeholder="e.g., Organic Turmeric"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="batch" value="Batch Number" />
                <TextInput
                  id="batch"
                  name="batch"
                  placeholder="e.g., BATCH-2024-001"
                  value={form.batch}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="manufacturer" value="Manufacturer" />
                <Select
                  id="manufacturer"
                  name="manufacturer"
                  value={form.manufacturer}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select manufacturer</option>
                  {manufacturers.map((manufacturer) => (
                    <option key={manufacturer} value={manufacturer}>
                      {manufacturer}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Product Preview */}
            {form.product_id && form.name && form.batch && form.manufacturer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Product Preview
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">ID:</span>
                    <span className="ml-2 font-mono text-gray-900 dark:text-white">
                      {form.product_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {form.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Batch:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {form.batch}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Manufacturer:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {form.manufacturer}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {onClose && (
                <Button
                  type="button"
                  color="light"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                color="blue"
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Register Product</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}
