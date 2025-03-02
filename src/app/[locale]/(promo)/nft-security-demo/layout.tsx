"use client";

import NetworkEffect from "@/components/NetworkEffect";
import React from "react";

export default function PromoLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
      <NetworkEffect />
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
