// types/gtag.d.ts

export {};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
