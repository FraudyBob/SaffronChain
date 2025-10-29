# QR Code Integration Guide for SaffronChain

## Overview
This guide shows how to integrate the QR Code functionality into your Producer dashboard and other pages.

---

## 1. Producer Dashboard Integration

### A. Import the QRModal component

```javascript
import QRModal from "@/components/QRModal";
import { QrCode } from "lucide-react";
```

### B. Add state for QR modal

```javascript
const [qrModalOpen, setQrModalOpen] = useState(false);
const [selectedProductForQR, setSelectedProductForQR] = useState(null);
const [lastRegisteredTxHash, setLastRegisteredTxHash] = useState(null);
const [autoOpenQR, setAutoOpenQR] = useState(false);
```

### C. Update product registration success handler

After successful product registration (when you get tx_hash back):

```javascript
const handleProductRegistration = async (productData) => {
  try {
    // Your existing registration logic...
    const response = await api.post("/register-product", productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const { product_id, tx_hash } = response.data;
    
    // Store for QR modal
    setSelectedProductForQR(product_id);
    setLastRegisteredTxHash(tx_hash);
    setAutoOpenQR(true);
    setQrModalOpen(true); // Auto-open QR modal
    
    toast.success("Product registered successfully!");
  } catch (error) {
    toast.error("Registration failed");
  }
};
```

### D. Add "Generate QR" button to ProductTable or product cards

Option 1: In ProductTable component action button:

```javascript
<ProductTable
  products={products}
  loading={loadingList}
  onRowClick={(p) => {
    setSelected(p);
    setDetailOpen(true);
  }}
  showActions
  actionLabel="Generate QR"
  onAction={(p) => {
    setSelectedProductForQR(p.product_id);
    setLastRegisteredTxHash(p.tx_hash);
    setAutoOpenQR(false);
    setQrModalOpen(true);
  }}
/>
```

Option 2: Add button in ProductDetailModal:

```javascript
// Inside ProductDetailModal.jsx, add this button near the blockchain link:
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => {
    // Pass product ID to parent to open QR modal
    onGenerateQR?.(product.product_id, product.tx_hash);
  }}
  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d8a24f] to-[#c89540] text-white font-medium shadow-md hover:shadow-lg transition-all"
>
  <QrCode className="h-4 w-4" />
  Generate QR Code
</motion.button>
```

### E. Add QRModal at the end of your component

```javascript
return (
  <UserDashboardLayout>
    {/* Your existing dashboard content */}
    
    {/* QR Modal */}
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
  </UserDashboardLayout>
);
```

---

## 2. Complete Producer Dashboard Example

```javascript
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import UserDashboardLayout from "@/components/UserDashboardLayout";
import ProductTable from "@/app/dashboard/components/ProductTable";
import ProductDetailModal from "@/app/dashboard/components/ProductDetailModal";
import QRModal from "@/components/QRModal";
import { QrCode } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function ProducerDashboard() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  // QR Modal states
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedProductForQR, setSelectedProductForQR] = useState(null);
  const [lastRegisteredTxHash, setLastRegisteredTxHash] = useState(null);
  const [autoOpenQR, setAutoOpenQR] = useState(false);

  const refresh = async () => {
    if (!token) return;
    setLoadingList(true);
    try {
      const res = await api.get("/verify/all", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
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

  const handleGenerateQR = (productId, txHash = null) => {
    setSelectedProductForQR(productId);
    setLastRegisteredTxHash(txHash);
    setAutoOpenQR(false);
    setQrModalOpen(true);
  };

  return (
    <UserDashboardLayout>
      <div className="space-y-8">
        {/* Your dashboard content */}
        
        <ProductTable
          products={products}
          loading={loadingList}
          onRowClick={(p) => {
            setSelected(p);
            setDetailOpen(true);
          }}
          showActions
          actionLabel="Generate QR"
          onAction={(p) => handleGenerateQR(p.product_id, p.tx_hash)}
        />

        <ProductDetailModal
          product={selected}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          onGenerateQR={handleGenerateQR}
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
```

---

## 3. Seller Dashboard Integration

Similar to Producer, but typically you'd want to generate QR for products you're distributing:

```javascript
// In Seller dashboard
const handleShipProduct = async (productId) => {
  // After successful shipment update
  setSelectedProductForQR(productId);
  setQrModalOpen(true);
  toast.success("Shipment updated! Generate QR for tracking.");
};
```

---

## 4. Admin Dashboard Integration

For admin viewing all products:

```javascript
// Add QR generation to admin product table
<ProductTable
  products={filteredProducts}
  loading={loading}
  onRowClick={openDetailModal}
  showActions
  actionLabel="View QR"
  onAction={(p) => {
    setSelectedProductForQR(p.product_id);
    setQrModalOpen(true);
  }}
/>
```

---

## 5. Printable QR Label Integration

To add printable A6 labels to the QR modal:

```javascript
import PrintableQR from "@/components/PrintableQR";

// Inside QRModal or as a separate modal:
{qrData && (
  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
      Printable Label
    </h3>
    <PrintableQR
      productId={productId}
      qrCodeData={qrData.qr_code_data}
      productName={product?.name}
      manufacturer={product?.manufacturer}
    />
  </div>
)}
```

---

## 6. Testing the QR Flow

### A. Generate QR Code
1. Register a new product in Producer dashboard
2. QR modal should auto-open with the QR code
3. Download or share the QR code

### B. Scan QR Code
1. Open the QR image on your phone
2. Scan with camera app (or QR scanner)
3. Should open: `http://localhost:3000/verify-product?product_id=PROD123`
4. Page auto-verifies and shows blockchain badge + timeline

### C. Manual Verification
1. Go to `/verify-product`
2. Enter product ID manually
3. Click "Verify"
4. Should show product details and timeline

---

## 7. Styling Customization

All components use the saffron color palette:
- Primary: `#d8a24f` (gold)
- Secondary: `#c89540` (darker gold)
- Dark: `#4a2c2a` (brown)
- Light: `#f9f6ef` (cream)

To customize colors, update the gradient classes in the components:
```javascript
className="bg-gradient-to-r from-[#d8a24f] to-[#c89540]"
```

---

## 8. Security Notes

- QR generation requires authentication (Bearer token)
- Token is stored in localStorage and sent with every request
- Verify URLs are public but products must exist in blockchain
- No sensitive data is encoded in QR (only product_id)

---

## 9. Error Handling

The QRModal handles these errors automatically:
- Missing authentication token
- Network failures (with retry button)
- Invalid product IDs
- Backend errors

All errors show toast notifications with helpful messages.

---

## 10. Mobile Considerations

- QR modal is fully responsive
- Share API works on mobile browsers
- Fallback to copy URL if Share API unavailable
- Touch-friendly button sizes (min 44x44px)

---

## Complete! 🎉

Your QR Code system is now integrated. Users can:
1. ✅ Generate QR codes after product registration
2. ✅ Download QR images as PNG
3. ✅ Print A6 labels for products
4. ✅ Share QR codes via Web Share API
5. ✅ Scan QR codes to verify products
6. ✅ See blockchain verification badges
7. ✅ View animated supply chain timelines

For questions or issues, check the component source code in:
- `/components/QRModal.jsx`
- `/components/PrintableQR.jsx`
- `/app/verify/page.jsx`
