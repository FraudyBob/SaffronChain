"use client";

import QRModal from "@/components/QRModal";

export default function QRPage({ params }) {
  return <QRModal productId={params.id} />;
}