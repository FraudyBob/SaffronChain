"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  TrendingUp, 
  Users, 
  Activity,
  ArrowRight,
  Shield,
  Globe,
  Zap
} from "lucide-react";
import { Card, Button, Badge } from "flowbite-react";
import Link from "next/link";

export default function Homepage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    verifiedProducts: 0,
    totalTraces: 0
  });

  useEffect(() => {
    // Mock stats for demonstration
    setStats({
      totalProducts: 156,
      activeProducts: 89,
      verifiedProducts: 67,
      totalTraces: 423
    });
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Immutable records on Ethereum blockchain ensure data integrity and transparency.",
      color: "blue"
    },
    {
      icon: Globe,
      title: "Global Traceability",
      description: "Track products from farm to store with complete supply chain visibility.",
      color: "green"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Instant status updates and notifications across the entire supply chain.",
      color: "yellow"
    },
    {
      icon: Users,
      title: "Role-based Access",
      description: "Secure access control for producers, sellers, and consumers.",
      color: "purple"
    }
  ];

  const quickActions = [
    {
      title: "Register Product",
      description: "Add new products to the blockchain",
      href: "/register-product",
      icon: Package,
      color: "blue"
    },
    {
      title: "Update Status",
      description: "Track product through supply chain",
      href: "/update-status",
      icon: Activity,
      color: "green"
    },
    {
      title: "Verify Product",
      description: "Check product authenticity",
      href: "/verify-product",
      icon: Shield,
      color: "purple"
    },
    {
      title: "Generate QR Code",
      description: "Create traceable QR codes",
      href: "/qr-display",
      icon: Zap,
      color: "yellow"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Supply Chain Tracker
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Track your products from farm to store with blockchain-powered transparency and security.
          Built for the modern supply chain with Indian spice focus.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" color="blue" href="/register-product">
            <Package className="h-5 w-5 mr-2" />
            Register New Product
          </Button>
          <Button size="lg" color="light" href="/verify-product">
            <Shield className="h-5 w-5 mr-2" />
            Verify Product
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
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
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <Link href={action.href} className="block">
                    <div className="text-center">
                      <div className={`inline-flex p-3 rounded-full bg-${action.color}-100 dark:bg-${action.color}-900 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-6 w-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {action.description}
                      </p>
                      <div className="flex items-center justify-center text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300">
                        <span>Get Started</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Why Choose Our Platform?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full bg-${feature.color}-100 dark:bg-${feature.color}-900 flex-shrink-0`}>
                      <Icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <Badge color="blue" size="sm">
              Live Updates
            </Badge>
          </div>
          <div className="space-y-4">
            {[
              { action: "Product TUR001 registered", time: "2 minutes ago", type: "success" },
              { action: "Status updated for TUR002", time: "15 minutes ago", type: "info" },
              { action: "QR code generated for TUR003", time: "1 hour ago", type: "warning" },
              { action: "Product TUR004 verified", time: "2 hours ago", type: "success" }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full bg-${activity.type === 'success' ? 'green' : activity.type === 'warning' ? 'yellow' : 'blue'}-500`}></div>
                  <span className="text-sm text-gray-900 dark:text-white">{activity.action}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
