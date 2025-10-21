"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, Calendar, User, Save, AlertCircle } from "lucide-react";
import { Button, Card, Label, TextInput, Textarea, Alert } from "flowbite-react";
import toast from "react-hot-toast";

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    product_id: "",
    name: "",
    batch: "",
    manufacturer: "",
    turmeric_origin: "",
    harvest_date: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setTxHash("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      // Convert harvest date to Unix timestamp
      const harvestTimestamp = formData.harvest_date ? 
        Math.floor(new Date(formData.harvest_date).getTime() / 1000) : 
        Math.floor(Date.now() / 1000);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/register-product`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          harvest_date: harvestTimestamp
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTxHash(data.tx_hash);
        toast.success("Product registered successfully!");
        
        // Reset form
        setFormData({
          product_id: "",
          name: "",
          batch: "",
          manufacturer: "",
          turmeric_origin: "",
          harvest_date: ""
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to register product");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Register New Product
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add a new product to the blockchain supply chain
            </p>
          </div>
        </div>

        {error && (
          <Alert color="failure" icon={AlertCircle} className="mb-6">
            {error}
          </Alert>
        )}

        {txHash && (
          <Alert color="success" className="mb-6">
            <div>
              <h4 className="font-semibold">Product Registered Successfully!</h4>
              <p className="text-sm mt-1">Transaction Hash: {txHash}</p>
              <p className="text-sm mt-1">You can view this transaction on Etherscan.</p>
            </div>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="product_id" value="Product ID *" />
              <TextInput
                id="product_id"
                name="product_id"
                type="text"
                placeholder="e.g., TUR001"
                value={formData.product_id}
                onChange={handleInputChange}
                required
                helperText="Unique identifier for the product"
              />
            </div>

            <div>
              <Label htmlFor="name" value="Product Name *" />
              <TextInput
                id="name"
                name="name"
                type="text"
                placeholder="e.g., Premium Turmeric Powder"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="batch" value="Batch Number *" />
              <TextInput
                id="batch"
                name="batch"
                type="text"
                placeholder="e.g., BATCH-2024-001"
                value={formData.batch}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="manufacturer" value="Manufacturer *" />
              <TextInput
                id="manufacturer"
                name="manufacturer"
                type="text"
                placeholder="e.g., SpiceCo India"
                value={formData.manufacturer}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="turmeric_origin" value="Turmeric Origin *" />
            <TextInput
              id="turmeric_origin"
              name="turmeric_origin"
              type="text"
              placeholder="e.g., Kerala, India"
              value={formData.turmeric_origin}
              onChange={handleInputChange}
              required
              icon={MapPin}
              helperText="Location where the turmeric was sourced"
            />
          </div>

          <div>
            <Label htmlFor="harvest_date" value="Harvest Date *" />
            <TextInput
              id="harvest_date"
              name="harvest_date"
              type="date"
              value={formData.harvest_date}
              onChange={handleInputChange}
              required
              icon={Calendar}
              helperText="Date when the turmeric was harvested"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              color="light"
              onClick={() => window.history.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
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

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Important Notes:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• All fields marked with * are required</li>
            <li>• Product ID must be unique across the entire system</li>
            <li>• Once registered, product information cannot be modified</li>
            <li>• Transaction will be recorded on the Ethereum blockchain</li>
            <li>• You'll need ETH for gas fees</li>
          </ul>
        </div>
      </Card>
    </motion.div>
  );
}
