"use client";

import Link from "next/link";
import { Home, ChevronRight, Package } from "lucide-react";
import { userColors } from "@/config/colors";

export default function BrandHeader({ breadcrumbs = [], showBrandOnly = false, brandClassName = "" }) {
  return (
    <div className="flex items-center gap-4">
      {/* Brand */}
      <Link href="/" className={`flex items-center gap-2 ${brandClassName}`}>
        <div
          className="p-2 rounded-lg shadow-md"
          style={{
            background: `linear-gradient(135deg, ${userColors.primary}, ${userColors.primaryHover})`,
          }}
        >
          <Package className="h-6 w-6 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-white">SaffronChain</span>
      </Link>

      {/* Breadcrumbs (optional) */}
      {!showBrandOnly && breadcrumbs?.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <Home className="h-4 w-4 text-gray-400" />
          {breadcrumbs.map((crumb, index) => (
            <div key={`${crumb.href}-${index}`} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Link
                href={crumb.href}
                className={`transition-colors ${crumb.isLast ? "font-semibold" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                style={crumb.isLast ? { color: userColors.primary } : {}}
              >
                {crumb.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
