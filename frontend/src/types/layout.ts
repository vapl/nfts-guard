import { ReactNode } from "react";

export type LayoutParams = Promise<{ locale: string }>;

export type LayoutProps = {
  children: ReactNode;
  params: LayoutParams;
};
