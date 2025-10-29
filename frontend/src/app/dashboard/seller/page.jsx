"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import UserDashboardLayout from "@/components/UserDashboardLayout";
import AddTraceForm from "@/app/dashboard/components/AddTraceForm";
import ProductTable from "@/app/dashboard/components/ProductTable";
import ProductDetailModal from "@/app/dashboard/components/ProductDetailModal";
import MetricCard from "@/components/ui/MetricCard";
import QRModal from "@/components/QRModal";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, MapPin, Clock, TrendingUp, Search, Shield, QrCode } from "lucide-react";
import { userColors } from "@/config/colors";

export default function SellerDashboard() {
  const { user, loading, token } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("shipments");
  const [products, setProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [traceItems, setTraceItems] = useState([]);
  const [traceLoading, setTraceLoading] = useState(false);
  
  // QR Modal states
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedProductForQR, setSelectedProductForQR] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role.toLowerCase() !== "seller")
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
    const inTransit = products.filter(p => 
      (p.status || "").toLowerCase() === "dispatched" ||
      (p.status || "").toLowerCase() === "processing"
    ).length;
    const delivered = products.filter(p => 
      (p.status || "").toLowerCase() === "delivered"
    ).length;
    const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

    return { total, inTransit, delivered, deliveryRate };
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
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Seller Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Welcome back, <span className="font-semibold" style={{ color: userColors.primary }}>{user.email}</span>
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl">
              Manage incoming shipments, update delivery status, and track product traces across the supply chain.
            </p>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Shipments"
            value={metrics.total}
            icon={Package}
            trend="up"
            trendValue="+15% this month"
            delay={0}
            gradient="from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <MetricCard
            title="In Transit"
            value={metrics.inTransit}
            icon={Truck}
            trend="up"
            trendValue="+5 today"
            delay={0.1}
            gradient="from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
            iconColor="text-orange-600 dark:text-orange-400"
          />
          <MetricCard
            title="Delivered"
            value={metrics.delivered}
            icon={Shield}
            trend="up"
            trendValue="+20 this week"
            delay={0.2}
            gradient="from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
            iconColor="text-green-600 dark:text-green-400"
          />
          <MetricCard
            title="Delivery Rate"
            value={`${metrics.deliveryRate}%`}
            icon={TrendingUp}
            trend={metrics.deliveryRate >= 70 ? "up" : "down"}
            trendValue={metrics.deliveryRate >= 70 ? "Excellent" : "Needs improvement"}
            delay={0.3}
            gradient="from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
            iconColor="text-purple-600 dark:text-purple-400"
          />
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-2 shadow-lg"
        >
          <div className="flex gap-2">
            <button
              onClick={() => setTab("shipments")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                tab === "shipments"
                  ? "shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              style={tab === "shipments" ? {
                background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                color: 'white',
              } : {}}
            >
              <div className="flex items-center justify-center gap-2">
                <Truck className="h-5 w-5" />
                <span>Shipments</span>
              </div>
            </button>
            <button
              onClick={() => setTab("traces")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                tab === "traces"
                  ? "shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              style={tab === "traces" ? {
                background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                color: 'white',
              } : {}}
            >
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Trace Logs</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {tab === "shipments" && (
            <motion.div
              key="shipments"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Add Trace Form */}
              <div id="trace" className="flex items-center gap-3 mb-6">
                <div 
                  className="h-8 w-1 rounded-full"
                  style={{
                    background: `linear-gradient(to bottom, ${userColors.primary}, ${userColors.primaryHover})`,
                  }}
                />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Trace Log</h2>
              </div>
              <AddTraceForm onSuccess={async () => {
                await refresh();
                if (verifyId) {
                  setTraceLoading(true);
                  try {
                    const tr = await api.get(`/get-traces/${encodeURIComponent(verifyId)}`, { headers: { Authorization: `Bearer ${token}` } });
                    const data = tr.data;
                    const normalized = Array.isArray(data) ? data : (data?.traces || []);
                    setTraceItems(normalized);
                  } finally { setTraceLoading(false); }
                }
              }} />

              {/* Shipments Section */}
              <div className="flex items-center gap-3 mb-6 mt-8">
                <div className="h-8 w-1 bg-gradient-to-b from-accent to-accentHover rounded-full" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Shipments</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Click on any shipment to view its trace history
                  </p>
                </div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
                <ProductTable
                  products={products}
                  loading={loadingList}
                  showActions
                  actionLabel="View Trace"
                  onAction={async (p) => {
                    setSelected(p);
                    setVerifyId(p.product_id);
                    setTab("traces");
                    setTraceLoading(true);
                    try {
                      const res = await api.get(`/get-traces/${encodeURIComponent(p.product_id)}`, { headers: { Authorization: `Bearer ${token}` } });
                      const data = res.data;
                      const normalized = Array.isArray(data) ? data : (data?.traces || []);
                      setTraceItems(normalized);
                    } finally { setTraceLoading(false); }
                  }}
                  onRowClick={(p) => {
                    setSelected(p);
                    setDetailOpen(true);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {tab === "traces" && (
            <motion.div
              key="traces"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Search Section */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Search className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Search Product Traces</h2>
                </div>
                <div className="flex gap-3">
                  <input
                    value={verifyId}
                    onChange={(e) => setVerifyId(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && document.getElementById("verify-btn").click()}
                    placeholder="Enter Product ID"
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                  />
                  <motion.button
                    id="verify-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
                      color: 'white',
                    }}
                    onClick={async () => {
                      setVerifyResult(null);
                      setTraceItems([]);
                      if (!verifyId) return;
                      try {
                        const res = await api.get(`/verify/${encodeURIComponent(verifyId)}`, { headers: { Authorization: `Bearer ${token}` } });
                        setVerifyResult(res.data || null);
                        setTraceLoading(true);
                        const tr = await api.get(`/get-traces/${encodeURIComponent(verifyId)}`, { headers: { Authorization: `Bearer ${token}` } });
                        const data = tr.data;
                        const normalized = Array.isArray(data) ? data : (data?.traces || []);
                        setTraceItems(normalized);
                      } finally { setTraceLoading(false); }
                    }}
                  >
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </motion.button>
                </div>
              </div>

              {/* Product Info */}
              {verifyResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accentHover/20">
                      <Package className="h-6 w-6 text-accent-700 dark:text-accent-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">{verifyResult.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ID: <span className="font-mono">{verifyResult.product_id}</span> • Manufacturer: {verifyResult.manufacturer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Trace Timeline */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-6 w-1 bg-gradient-to-b from-accent to-accentHover rounded-full" />
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">Trace Timeline</h4>
                </div>
                {traceLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-20 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
                    ))}
                  </div>
                ) : traceItems.length ? (
                  <div className="space-y-3">
                    {traceItems.map((t, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative group"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accentHover/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
                        <div className="relative p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:shadow-md transition-all">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="p-2 rounded-lg bg-accent/10">
                                <MapPin className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                              </div>
                              <div className="flex-1">
                                <div className="text-gray-900 dark:text-white font-semibold">{t.stage}</div>
                                <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                  {t.company} • {t.location}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              <Clock className="h-3 w-3" />
                              {t.formatted_time || (t.timestamp ? new Date(t.timestamp * 1000).toLocaleString() : "-")}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No traces found. Enter a Product ID to search.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ProductDetailModal
          product={selected}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          onGenerateQR={(productId) => {
            setSelectedProductForQR(productId);
            setQrModalOpen(true);
          }}
        />

        <QRModal
          productId={selectedProductForQR}
          open={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
        />
      </div>
    </UserDashboardLayout>
  );
}
