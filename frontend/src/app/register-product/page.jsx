"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, ArrowLeft } from "lucide-react";
import { Button, Card } from "flowbite-react";
import { AddProductForm } from "../components/AddProductForm";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterProduct() {
  const [showForm, setShowForm] = useState(false);
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
  }, []);

  const handleSuccess = (data) => {
    toast.success("Product registered successfully!");
    // Optionally redirect to dashboard or show success page
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Register New Product
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Add your product to the blockchain for secure tracking and verification
          </p>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-8"
      >
        <Card>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Fill Product Details
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter product ID, name, batch number, and manufacturer information
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 dark:text-green-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Blockchain Registration
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Product data is stored immutably on Ethereum blockchain
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Track & Verify
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor product journey and generate QR codes for verification
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Registered as: {user.role}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Role Permissions
              </p>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Can register products
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Add Product Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-center"
      >
        <Button
          color="blue"
          size="lg"
          onClick={() => setShowForm(true)}
          className="px-8 py-4"
        >
          <Package className="h-5 w-5 mr-2" />
          Add New Product
        </Button>
      </motion.div>

      {/* Form Modal */}
      {showForm && (
        <AddProductForm
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
