"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import UserDashboardLayout from "@/components/UserDashboardLayout";
import AddProductFormEnhanced from "@/app/dashboard/components/AddProductFormEnhanced";
import AddTraceForm from "@/app/dashboard/components/AddTraceForm";
import ProductTable from "@/app/dashboard/components/ProductTable";
import UpdateStatusModal from "@/app/dashboard/components/UpdateStatusModal";
import ProductDetailModal from "@/app/dashboard/components/ProductDetailModal";
import MetricCard from "@/components/ui/MetricCard";
import QRModal from "@/components/QRModal";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Package, CheckCircle, TrendingUp, Layers, Factory } from "lucide-react";
import { userColors } from "@/config/colors";

export default function ProducerDashboard() {
  const { user, loading, token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [statusOpen, setStatusOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  
  // QR Modal states
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedProductForQR, setSelectedProductForQR] = useState(null);
  const [lastRegisteredTxHash, setLastRegisteredTxHash] = useState(null);
  const [autoOpenQR, setAutoOpenQR] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role.toLowerCase() !== "producer")
        router.push(`/dashboard/${user.role.toLowerCase()}`);
    }
  }, [user, loading, router]);

  const refresh = async () => {
    if (!token) return;
    setLoadingList(true);
    try {
      const res = await api.get("/verify/all", { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (token && user) refresh();
  }, [token, user]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = products.length;
    const verified = products.filter(p => 
      (p.status || "").toLowerCase() === "verified" || 
      (p.status || "").toLowerCase() === "delivered"
    ).length;
    const batches = new Set(products.map(p => p.batch)).size;
    const verificationRate = total > 0 ? Math.round((verified / total) * 100) : 0;

    return { total, verified, batches, verificationRate };
  }, [products]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-200">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-8 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60"
        >
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
            style={{ backgroundColor: `${userColors.primary}20` }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="p-3 rounded-xl shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                }}
              >
                <Factory className="h-8 w-8 text-black" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Producer Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Welcome back, <span className="font-semibold" style={{ color: userColors.primary }}>{user.email}</span>
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl">
              Manage your saffron products, register new batches, add supply chain traces, and monitor verification status.
            </p>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Products"
            value={metrics.total}
            icon={Package}
            trend="up"
            trendValue="+12% this month"
            delay={0}
            gradient="from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <MetricCard
            title="Verified Batches"
            value={metrics.verified}
            icon={CheckCircle}
            trend="up"
            trendValue="+8% this week"
            delay={0.1}
            gradient="from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
            iconColor="text-green-600 dark:text-green-400"
          />
          <MetricCard
            title="Unique Batches"
            value={metrics.batches}
            icon={Layers}
            delay={0.2}
            gradient="from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
            iconColor="text-purple-600 dark:text-purple-400"
          />
          <MetricCard
            title="Verification Rate"
            value={`${metrics.verificationRate}%`}
            icon={TrendingUp}
            trend={metrics.verificationRate >= 50 ? "up" : "down"}
            trendValue={metrics.verificationRate >= 50 ? "Excellent" : "Needs attention"}
            delay={0.3}
            gradient="from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20"
            iconColor="text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* Forms Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="h-8 w-1 rounded-full"
              style={{
                background: `linear-gradient(to bottom, ${userColors.primary}, ${userColors.primaryHover})`,
              }}
            />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div id="register">
              <AddProductFormEnhanced onSuccess={refresh} />
            </div>
            <div id="trace">
              <AddTraceForm onSuccess={refresh} />
            </div>
          </div>
        </motion.div>

        {/* Products Section */}
        <motion.section
          id="products"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div 
              className="h-8 w-1 rounded-full"
              style={{
                background: `linear-gradient(to bottom, ${userColors.primary}, ${userColors.primaryHover})`,
              }}
            />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Products</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Click on any product card to view details or update status
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
            <ProductTable
              products={products}
              loading={loadingList}
              onRowClick={(p) => {
                setSelected(p);
                setDetailOpen(true);
              }}
              showActions
              actionLabel="Update Status"
              onAction={(p) => {
                setSelected(p);
                setStatusOpen(true);
              }}
            />
          </div>
        </motion.section>

        <UpdateStatusModal
          open={statusOpen}
          onClose={() => setStatusOpen(false)}
          initialProductId={selected?.product_id}
          onSuccess={refresh}
        />

        <ProductDetailModal
          product={selected}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          onGenerateQR={(productId, txHash) => {
            setSelectedProductForQR(productId);
            setLastRegisteredTxHash(txHash || null);
            setAutoOpenQR(false);
            setQrModalOpen(true);
          }}
        />

        <QRModal
          productId={selectedProductForQR}
          open={qrModalOpen}
          onClose={() => {
            setQrModalOpen(false);
            setAutoOpenQR(false);
          }}
          autoFetchAfterRegistration={autoOpenQR}
          txHash={lastRegisteredTxHash}
        />
      </div>
    </UserDashboardLayout>
  );
}
