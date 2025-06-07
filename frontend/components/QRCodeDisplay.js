// frontend/components/QRCodeDisplay.js
import React from "react";

export default function QRCodeDisplay() {
  return (
    <div style={{ marginTop: "15px" }}>
      <img
        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example"
        alt="QR Code"
      />
    </div>
  );
}
