"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Download, Printer } from "lucide-react";
import toast from "react-hot-toast";

export default function PrintableQR({ productId, qrCodeData, productName, manufacturer }) {
  const printRef = useRef(null);

  const handleDownloadPNG = () => {
    if (!printRef.current) return;

    // Use html2canvas if available, otherwise show message
    if (typeof window !== "undefined" && window.html2canvas) {
      window.html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `saffronchain-label-${productId}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success("Label downloaded!");
      });
    } else {
      toast.error("Please install html2canvas library for PNG export");
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Label - ${productId}</title>
          <style>
            @page { size: A6; margin: 0; }
            body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
            .print-container { 
              width: 148mm; 
              height: 105mm; 
              padding: 10mm;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #f9f6ef 0%, #ffffff 100%);
            }
            .brand { font-size: 24px; font-weight: bold; color: #4a2c2a; margin-bottom: 8px; }
            .product-name { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 4px; }
            .product-id { font-size: 12px; color: #666; margin-bottom: 16px; font-family: monospace; }
            .qr-image { width: 200px; height: 200px; margin: 16px 0; }
            .footer { font-size: 10px; color: #999; text-align: center; margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="brand">🌸 SaffronChain</div>
            <div class="product-name">${productName || "Authentic Saffron"}</div>
            <div class="product-id">ID: ${productId}</div>
            <img src="data:image/png;base64,${qrCodeData}" class="qr-image" alt="QR Code" />
            <div class="footer">
              Scan to verify authenticity on blockchain<br/>
              ${manufacturer || ""}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div
        ref={printRef}
        className="relative w-full aspect-[148/105] bg-gradient-to-br from-[#f9f6ef] to-white rounded-2xl shadow-lg border-2 border-[#d8a24f]/30 p-6 flex flex-col items-center justify-center"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <div className="text-2xl font-bold text-[#4a2c2a] mb-2">🌸 SaffronChain</div>
        <div className="text-lg font-semibold text-gray-800 mb-1">
          {productName || "Authentic Saffron"}
        </div>
        <div className="text-xs text-gray-600 mb-4 font-mono">ID: {productId}</div>
        
        {qrCodeData && (
          <img
            src={`data:image/png;base64,${qrCodeData}`}
            alt="QR Code"
            className="w-48 h-48 rounded-lg shadow-md"
          />
        )}
        
        <div className="text-xs text-gray-500 text-center mt-4">
          Scan to verify authenticity on blockchain
          {manufacturer && <div className="mt-1">{manufacturer}</div>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadPNG}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d8a24f] to-[#c89540] text-white font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Download className="h-5 w-5" />
          Download PNG
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Printer className="h-5 w-5" />
          Print A6 Label
        </motion.button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        A6 size (148mm × 105mm) - Perfect for product labels
      </p>
    </div>
  );
}
