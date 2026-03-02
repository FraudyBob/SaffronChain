"use client";

import QRModal from "@/app/components/QRModal";

export default function QRPage({ params }) {
  return <QRModal productId={params.id} />;
}