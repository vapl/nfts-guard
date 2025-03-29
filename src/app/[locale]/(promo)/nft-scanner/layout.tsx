"use client";

import NetworkEffect from "@/components/NetworkEffect";
import React from "react";

export default function PromoLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NetworkEffect />
      <div className="flex flex-col w-full">
        <main className="flex-1 overflow-auto p-6 w-full max-w-[1920px] mx-auto">
          {children}
        </main>
      </div>
    </>
  );
}
