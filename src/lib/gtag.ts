// lib/gtag.ts

export const GA_TRACKING_ID = "G-DMM184GK4N";

const hasConsent = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("cookie_consent") === "true";
};

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag && hasConsent()) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value: number;
}) => {
  if (typeof window !== "undefined" && window.gtag && hasConsent()) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
