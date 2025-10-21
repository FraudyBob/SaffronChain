"use client";

import { QRDisplay } from "@/app/components/QRDisplay";

export default function QRPage({ params }) {
  return <QRDisplay productId={params.id} />;
}