"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  MapPin, 
  Calendar, 
  User, 
  Activity,
  Eye,
  Edit,
  QrCode,
  ExternalLink
} from "lucide-react";
import { Card, Button, Badge } from "flowbite-react";
import Link from "next/link";

export default function ProductCard({ product, onView, onEdit, onGenerateQR }) {
  const [isHovered, setIsHovered] = useState(false);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Created":
      case "Farm": return Package;
      case "Processing":
      case "Factory": return Activity;
      case "In Transit": return MapPin;
      case "Delivered":
      case "Store": return Package;
      default: return Package;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const StatusIcon = getStatusIcon(product.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`h-full transition-all duration-300 ${
        isHovered ? 'shadow-xl ring-2 ring-blue-200 dark:ring-blue-800' : 'hover:shadow-lg'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-${getStatusColor(product.status)}-100 dark:bg-${getStatusColor(product.status)}-900`}>
              <StatusIcon className={`h-5 w-5 text-${getStatusColor(product.status)}-600 dark:text-${getStatusColor(product.status)}-400`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {product.name || product.product_name || "Unknown Product"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {product.id || product.product_id || "N/A"}
              </p>
            </div>
          </div>
          <Badge color={getStatusColor(product.status)} size="sm">
            {product.status}
          </Badge>
        </div>

        {/* Product Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span>{product.manufacturer || "Unknown Manufacturer"}</span>
          </div>
          
          {product.batch && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Package className="h-4 w-4" />
              <span>Batch: {product.batch}</span>
            </div>
          )}

          {product.turmeric_origin && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{product.turmeric_origin}</span>
            </div>
          )}

          {product.timestamp && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(product.timestamp)}</span>
            </div>
          )}

          {product.traces && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Activity className="h-4 w-4" />
              <span>{product.traces} trace records</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Supply Chain Progress</span>
            <span>
              {product.status === "Farm" ? "25%" : 
               product.status === "Factory" ? "50%" : 
               product.status === "Store" ? "100%" : "0%"}
            </span>
          </div>
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
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-600">
          <Button
            size="sm"
            color="light"
            onClick={() => onView && onView(product)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          
          <Button
            size="sm"
            color="light"
            onClick={() => onEdit && onEdit(product)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          
          <Button
            size="sm"
            color="blue"
            onClick={() => onGenerateQR && onGenerateQR(product)}
            className="flex-1"
          >
            <QrCode className="h-4 w-4 mr-1" />
            QR
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between text-xs">
            <Link 
              href={`/verify-product?product_id=${product.id || product.product_id}`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Verify
            </Link>
            <Link 
              href={`/update-status?product_id=${product.id || product.product_id}`}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 flex items-center"
            >
              <Activity className="h-3 w-3 mr-1" />
              Update
            </Link>
            <Link 
              href={`/qr-display?product_id=${product.id || product.product_id}`}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center"
            >
              <QrCode className="h-3 w-3 mr-1" />
              QR Code
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Default props for better development experience
ProductCard.defaultProps = {
  product: {
    id: "TUR001",
    name: "Sample Turmeric Product",
    manufacturer: "Sample Manufacturer",
    batch: "BATCH-001",
    status: "Farm",
    timestamp: Date.now(),
    turmeric_origin: "Kerala, India",
    traces: 0
  },
  onView: (product) => console.log("View product:", product),
  onEdit: (product) => console.log("Edit product:", product),
  onGenerateQR: (product) => console.log("Generate QR for:", product)
};
