"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import UserDashboardLayout from "@/components/UserDashboardLayout";
import { Select, TextInput } from "flowbite-react";
import { useAuth } from "@/context/AuthContext";
import { PackageSearch, Users, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import ProductTable from "@/app/dashboard/components/ProductTable";
import TraceTimeline from "@/components/TraceTimeline";
import SectionHeader from "@/components/ui/SectionHeader";
import Divider from "@/components/ui/Divider";
import { useTheme } from "@/components/ThemeProvider";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

export default function AdminDashboard() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const axisColor = isDark ? "#cbd5e1" : "#000000ff"; // slate-300 vs slate-700
  const gridStroke = isDark ? "#ffffff1a" : "#e5e7eb"; // light gray for light mode
  const tooltipStyle = isDark
    ? { background: "#0b1220", border: "1px solid #2a3346", color: "#e5e7eb" }
    : { background: "#ffffff", border: "1px solid #e5e7eb", color: "#111827" };
  const legendStyle = { color: isDark ? "#cbd5e1" : "#374151" };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [traceLoading, setTraceLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [traceItems, setTraceItems] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [manufacturerFilter, setManufacturerFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [search, setSearch] = useState("");

  // Build analytics datasets
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const statusOk = statusFilter ? (p.status || "").toLowerCase() === statusFilter : true;
      const manufacturerOk = manufacturerFilter ? (p.manufacturer || "") === manufacturerFilter : true;
      const nameOk = nameFilter ? (p.name || "") === nameFilter : true;
      const q = search.trim().toLowerCase();
      const searchOk = q ? (p.name || "").toLowerCase().includes(q) || (p.manufacturer || "").toLowerCase().includes(q) : true;
      return statusOk && manufacturerOk && nameOk && searchOk;
    });
  }, [products, statusFilter, manufacturerFilter, nameFilter, search]);

  const manufacturerOptions = useMemo(() => {
    const set = new Set((products || []).map(p => p.manufacturer).filter(Boolean));
    return Array.from(set);
  }, [products]);

  const nameOptions = useMemo(() => {
    const set = new Set((products || []).map(p => p.name).filter(Boolean));
    return Array.from(set);
  }, [products]);

  const stageData = useMemo(() => {
    const counts = { Farm: 0, Factory: 0, Store: 0, Delivered: 0 };
    for (const p of filteredProducts) {
      const s = String(p.status || "").toLowerCase();
      if (s === "delivered") counts["Delivered"]++;
      else if (s === "shipped") counts["Store"]++;
      else if (s === "processing") counts["Factory"]++;
      else counts["Farm"]++;
    }
    return Object.entries(counts).map(([stage, count]) => ({ stage, count }));
  }, [filteredProducts]);

  const timeData = useMemo(() => {
    const byDay = new Map();
    for (const p of filteredProducts) {
      if (!p.timestamp) continue;
      const d = new Date(p.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!byDay.has(key)) byDay.set(key, { date: key, farm: 0, processing: 0, shipped: 0, delivered: 0, total: 0 });
      const row = byDay.get(key);
      const s = String(p.status || "").toLowerCase();
      if (s === "farm") row.farm++;
      else if (s === "processing") row.processing++;
      else if (s === "shipped") row.shipped++;
      else if (s === "delivered") row.delivered++;
      row.total++;
    }
    return Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredProducts]);

  const stats = useMemo(() => {
    const producers = new Set(filteredProducts.map((p) => p.manufacturer));
    const delivered = filteredProducts.filter((p) => (p.status || "").toLowerCase() === "delivered");
    return { total: filteredProducts.length, producers: producers.size, delivered: delivered.length };
  }, [filteredProducts]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/verify/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const openTraceModal = async (product) => {
    setSelectedId(product.product_id);
    setModalOpen(true);
    setTraceLoading(true);
    try {
      const res = await api.get(`/get-traces/${product.product_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      const normalized = Array.isArray(data) ? data : (data?.traces || data?.items || []);
      setTraceItems(normalized || []);
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch trace data");
    } finally {
      setTraceLoading(false);
    }
  };

  const openDetailModal = async (product) => {
    setSelectedId(product.product_id);
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const res = await api.get(`/verify/${product.product_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDetail(res.data || null);
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch product details");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <UserDashboardLayout>
    <div className="space-y-10 max-w-6xl w-full mx-auto px-4 pt-2 md:pt-4">
      <SectionHeader title="Admin Dashboard" subtitle="System Overview & Blockchain Audit" />
      <Divider />

      
      {/* Analytics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 bg-transparent border-0 shadow-none">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Stage Distribution</h4>
          <div className="h-72">
            <ResponsiveContainer width="105%" height="105%">
              <BarChart data={stageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="stage" stroke={axisColor} />
                <YAxis stroke={axisColor} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={legendStyle} />
                <Bar dataKey="count" name="Batches" fill="#f59e0b" animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-transparent border-0 shadow-none">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Progression Over Time</h4>
          <div className="h-72">
            <ResponsiveContainer width="105%" height="105%">
              <AreaChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProcessing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C37288" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#C37288" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorShipped" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D58A9A" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#D58A9A" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8F415C" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#8F415C" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="date" stroke={axisColor} />
                <YAxis stroke={axisColor} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={legendStyle} />
                <Area type="monotone" dataKey="farm" name="Farm" stroke="#633348" fillOpacity={1} fill="#6333481A" />
                <Area type="monotone" dataKey="processing" name="Processing" stroke="#C37288" fillOpacity={1} fill="url(#colorProcessing)" />
                <Area type="monotone" dataKey="shipped" name="Shipped" stroke="#D58A9A" fillOpacity={1} fill="url(#colorShipped)" />
                <Area type="monotone" dataKey="delivered" name="Delivered" stroke="#8F415C" fillOpacity={1} fill="url(#colorDelivered)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatCard icon={PackageSearch} label="Total Products" value={stats.total} />
        <StatCard icon={Users} label="Active Producers" value={stats.producers} />
        <StatCard icon={CheckCircle} label="Delivered Products" value={stats.delivered} />
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white/10 text-white border-white/10">
              <option value="">All</option>
              <option value="farm">Farm</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Manufacturer</label>
            <Select value={manufacturerFilter} onChange={(e) => setManufacturerFilter(e.target.value)} className="bg-white/10 text-white border-white/10">
              <option value="">All</option>
              {manufacturerOptions.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <Select value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} className="bg-white/10 text-white border-white/10">
              <option value="">All</option>
              {nameOptions.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Search</label>
            <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or manufacturer" className="bg-white/10 text-white border-white/10 placeholder-gray-400" />
          </div>
        </div>
      </motion.div>


      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <ProductTable
          products={filteredProducts}
          loading={loading}
          onRowClick={openDetailModal}
          showFull
          showActions
          actionLabel="View Trace"
          onAction={openTraceModal}
        />
      </motion.div>

      {/* Trace Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 relative">
              <h3 className="text-2xl font-semibold mb-4 text-accent">Trace Details — {selectedId}</h3>
              <div className="max-h-80 overflow-y-auto">
                {traceLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-16 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    ))}
                  </div>
                ) : (
                  <TraceTimeline productId={selectedId} />
                )}
              </div>
              <button onClick={() => setModalOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 dark:hover:text-white transition">✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 relative">
              <h3 className="text-2xl font-semibold mb-4 text-accent">Product Details — {selectedId}</h3>
              {detailLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-6 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  ))}
                </div>
              ) : detail ? (
                <div className="text-sm text-gray-900 dark:text-gray-200 space-y-1">
                  <p><span className="text-gray-400">Name:</span> {detail.name}</p>
                  <p><span className="text-gray-400">Product ID:</span> {detail.product_id}</p>
                  <p><span className="text-gray-400">Batch:</span> {detail.batch}</p>
                  <p><span className="text-gray-400">Manufacturer:</span> {detail.manufacturer}</p>
                  <p><span className="text-gray-400">Status:</span> {detail.status}</p>
                  {typeof detail.timestamp !== "undefined" && (
                    <p><span className="text-gray-400">Timestamp:</span> {new Date(detail.timestamp).toLocaleString()}</p>
                  )}
                  {typeof detail.harvest_season !== "undefined" && (
                    <p><span className="text-gray-400">Harvest Season:</span> {new Date(Number(detail.harvest_season) * 1000).toLocaleString()}</p>
                  )}
                  {detail.saffron_region && (
                    <p><span className="text-gray-400">Region:</span> {detail.saffron_region}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">No details found.</p>
              )}
              <button onClick={() => setDetailOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 dark:hover:text-white transition">✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </UserDashboardLayout>
  );
}

const StatCard = ({ icon: Icon, label, value }) => (
  <motion.div whileHover={{ scale: 1.03 }} className="bg-transparent rounded-2xl p-6 shadow-none border-0 flex items-center justify-between">
    <div>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
      <AnimatedCounter value={value} />
    </div>
    <Icon className="h-10 w-10 text-accent" />
  </motion.div>
);

function AnimatedCounter({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frame;
    const duration = 500;
    const start = performance.now();
    const from = 0;
    const to = Number(value) || 0;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      setDisplay(Math.round(from + (to - from) * p));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{display}</h3>;
}
