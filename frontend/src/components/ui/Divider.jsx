"use client";
export default function Divider({ className = "my-8" }) {
  return (
    <div className={`relative ${className}`}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
