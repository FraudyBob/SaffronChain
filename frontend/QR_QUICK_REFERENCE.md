# 🚀 QR Code - Quick Reference Card

## 📦 Import Components

```javascript
import QRModal from "@/components/QRModal";
import PrintableQR from "@/components/PrintableQR";
import { QrCode } from "lucide-react";
```

---

## 🎯 Basic Usage

### Open QR Modal
```javascript
const [qrOpen, setQrOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);

// Open modal
<button onClick={() => {
  setSelectedProduct("PROD123");
  setQrOpen(true);
}}>
  Generate QR
</button>

// Render modal
<QRModal
  productId={selectedProduct}
  open={qrOpen}
  onClose={() => setQrOpen(false)}
/>
```

### Auto-open After Registration
```javascript
const [txHash, setTxHash] = useState(null);

// After successful registration
const handleRegister = async () => {
  const response = await api.post("/register-product", data);
  setSelectedProduct(response.data.product_id);
  setTxHash(response.data.tx_hash);
  setQrOpen(true);
};

// Render with tx badge
<QRModal
  productId={selectedProduct}
  open={qrOpen}
  onClose={() => setQrOpen(false)}
  autoFetchAfterRegistration={true}
  txHash={txHash}
/>
```

---

## 🔗 API Endpoint

```javascript
// Backend endpoint (already implemented)
POST /generate-qr

// Request
{
  "product_id": "PROD123",
  "frontend_url": window.location.origin
}

// Headers
Authorization: Bearer <token>

// Response
{
  "qr_code_data": "base64_png_string",
  "product_id": "PROD123",
  "verify_url": "http://localhost:3000/verify-product?product_id=PROD123"
}
```

---

## 🎨 Component Props

### QRModal
```typescript
{
  productId: string;                    // Required
  open: boolean;                        // Required
  onClose: () => void;                  // Required
  autoFetchAfterRegistration?: boolean; // Optional, default: false
  txHash?: string;                      // Optional
}
```

### PrintableQR
```typescript
{
  productId: string;        // Required
  qrCodeData: string;       // Required (base64)
  productName?: string;     // Optional
  manufacturer?: string;    // Optional
}
```

---

## 🎭 Features

| Action | Function | Fallback |
|--------|----------|----------|
| Download | `handleDownload()` | - |
| Copy URL | `handleCopy()` | - |
| Share | `handleShare()` | Copy to clipboard |
| Print | Browser print | - |
| Close | `onClose()` | ESC key |

---

## 🔄 Verify Page Flow

### URL Format
```
/verify-product?product_id=PROD123
```

### Auto-verify Logic
```javascript
const searchParams = useSearchParams();
const qrProductId = searchParams.get("product_id");

if (qrProductId) {
  // Auto-verify
  verifyProduct(qrProductId);
}
```

---

## 🎨 Saffron Colors

```css
/* Primary Gold */
#d8a24f

/* Darker Gold */
#c89540

/* Dark Brown */
#4a2c2a

/* Light Cream */
#f9f6ef
```

---

## ⚡ Quick Integration

### Producer Dashboard
```javascript
<ProductTable
  products={products}
  showActions
  actionLabel="Generate QR"
  onAction={(p) => {
    setSelectedProduct(p.product_id);
    setQrOpen(true);
  }}
/>
```

### Seller Dashboard
```javascript
<button onClick={() => {
  setSelectedProduct(shipment.product_id);
  setQrOpen(true);
}}>
  <QrCode className="h-4 w-4" />
  Generate QR
</button>
```

### Admin Dashboard
```javascript
<ProductTable
  products={allProducts}
  showActions
  actionLabel="View QR"
  onAction={(p) => {
    setSelectedProduct(p.product_id);
    setQrOpen(true);
  }}
/>
```

---

## 🐛 Error Handling

```javascript
// QRModal handles these automatically:
- Missing token → Shows error + retry
- Network failure → Shows error + retry
- Invalid product → Shows error message
- Backend error → Shows error + retry

// All errors trigger toast notifications
```

---

## 📱 Mobile Support

```javascript
// Web Share API (with fallback)
if (navigator.share) {
  await navigator.share({
    title: "Verify Saffron Product",
    url: verifyUrl
  });
} else {
  // Fallback to clipboard
  await navigator.clipboard.writeText(verifyUrl);
}
```

---

## 🎯 Testing Checklist

```
□ Generate QR code
□ Download PNG
□ Copy URL
□ Share (or fallback)
□ Scan with phone
□ Auto-verify works
□ Blockchain badge shows
□ Timeline animates
□ Print label works
□ Dark mode works
```

---

## 🔧 Common Customizations

### Change QR Size
```javascript
// In QRModal.jsx
<img className="w-64 h-64" /> // Change to w-48 h-48
```

### Change Colors
```javascript
// Replace gradient classes
from-[#d8a24f] to-[#c89540]
// With your colors
from-[#yourColor] to-[#yourColor]
```

### Add Custom Button
```javascript
<motion.button
  onClick={handleCustom}
  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white"
>
  <CustomIcon className="h-5 w-5" />
  <span className="text-xs">Custom</span>
</motion.button>
```

---

## 📚 Files Created

```
/components/QRModal.jsx              - Main QR modal
/components/PrintableQR.jsx          - A6 printable label
/app/verify/page.jsx                 - Updated verify page
INTEGRATION_GUIDE_QR.md              - Full integration guide
QR_FEATURE_SUMMARY.md                - Complete feature docs
QR_QUICK_REFERENCE.md                - This file
```

---

## 🚀 One-Line Integration

```javascript
// 1. Import
import QRModal from "@/components/QRModal";

// 2. State
const [qrOpen, setQrOpen] = useState(false);
const [productId, setProductId] = useState(null);

// 3. Button
<button onClick={() => { setProductId("PROD123"); setQrOpen(true); }}>
  Generate QR
</button>

// 4. Modal
<QRModal productId={productId} open={qrOpen} onClose={() => setQrOpen(false)} />
```

---

## 💡 Pro Tips

1. **Auto-open**: Set `autoFetchAfterRegistration={true}` after product registration
2. **Batch Generate**: Map over products array to generate multiple QRs
3. **Custom Styling**: All components use Tailwind, easy to customize
4. **Error Recovery**: Modal has built-in retry button for failures
5. **Mobile First**: Test on mobile devices for best UX
6. **Print Labels**: Use PrintableQR for physical product labels
7. **Analytics**: Add tracking to QR scan events if needed

---

## 🎉 That's It!

You now have a complete QR Code system. For detailed docs, see:
- `INTEGRATION_GUIDE_QR.md` - Step-by-step integration
- `QR_FEATURE_SUMMARY.md` - Complete feature documentation

**Happy coding! 🚀**
