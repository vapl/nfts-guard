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
      <div className="flex flex-col w-full justify-center max-w-screen">
        <main className="p-3 w-full max-w-[1920px] mx-auto">{children}</main>
      </div>
    </>
  );
}
