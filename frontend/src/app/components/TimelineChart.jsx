"use client";

import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function TimelineChart({ products }) {
  const chartRef = useRef();
  const [traces, setTraces] = useState([]);

  // Fetch traces for all products
  useEffect(() => {
    const fetchTraces = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const tracePromises = products.map(async (product) => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/get-traces/${product.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              return { productId: product.id, traces: data.traces || [] };
            }
            return { productId: product.id, traces: [] };
          } catch (error) {
            console.error(`Error fetching traces for ${product.id}:`, error);
            return { productId: product.id, traces: [] };
          }
        });

        const traceResults = await Promise.all(tracePromises);
        setTraces(traceResults);
      } catch (error) {
        console.error("Error fetching traces:", error);
      }
    };

    if (products.length > 0) {
      fetchTraces();
    }
  }, [products]);

  // Create timeline data based on product status and traces
  const timelineData = {
    labels: ["Farm", "Processing", "Factory", "Packaging", "Store"],
    datasets: [
      {
        label: "Products in Stage",
        data: [
          products.filter(p => p.status === "Created" || p.status === "Farm").length,
          products.filter(p => p.status === "Processing").length,
          products.filter(p => p.status === "Factory").length,
          products.filter(p => p.status === "Processing").length,
          products.filter(p => p.status === "Delivered" || p.status === "Store").length,
        ],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Trace Records",
        data: traces.map(t => t.traces.length),
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "rgb(168, 85, 247)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          color: "#374151",
          font: {
            size: 12,
            weight: "500"
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value} ${value === 1 ? 'product' : 'products'}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 11,
            weight: "500"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 11,
            weight: "500"
          },
          stepSize: 1
        }
      }
    },
    interaction: {
      intersect: false,
      mode: "index"
    },
    elements: {
      point: {
        hoverBackgroundColor: "#fff"
      }
    }
  };

  // Dark mode support
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    
    if (chartRef.current) {
      const chart = chartRef.current;
      
      // Update colors based on theme
      const textColor = isDark ? "#D1D5DB" : "#374151";
      const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
      
      chart.options.scales.x.ticks.color = textColor;
      chart.options.scales.y.ticks.color = textColor;
      chart.options.scales.x.grid.color = gridColor;
      chart.options.scales.y.grid.color = gridColor;
      chart.options.plugins.legend.labels.color = textColor;
      
      chart.update();
    }
  }, []);

  return (
    <div className="relative h-80 w-full">
      <Line
        ref={chartRef}
        data={timelineData}
        options={options}
        className="w-full h-full"
      />
      
      {/* Chart Info */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Supply Chain Flow</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Trace Records</span>
          </div>
        </div>
      </div>
    </div>
  );
}
