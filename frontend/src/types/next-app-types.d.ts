import React from "react";

declare module "next/app" {
  export interface LayoutProps {
    children: React.ReactNode;
    params?: { locale: string };
  }
}
