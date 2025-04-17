"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setShow(true);
  }, []);

  const acceptCookies = () => {
    window.gtag?.("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted",
    });
    localStorage.setItem("cookie_consent", "true");
    setShow(false);
  };

  const declineCookies = () => {
    window.gtag?.("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied",
    });
    localStorage.setItem("cookie_consent", "false");
    setShow(false);
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 max-w-md bg-gray-900 text-white p-6 rounded-xl shadow-xl z-50 border border-gray-700"
    >
      <p className="text-sm text-gray-300">
        We use cookies to enhance your experience, analyze website traffic, and
        personalize content. By clicking &apos;Accept&apos;, you consent to our
        use of cookies. You can read more in our{" "}
        <Link href="/privacy" className="text-purple-400 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={declineCookies}
          className="px-4 py-2 rounded-md border border-gray-600 text-sm hover:bg-gray-800 transition cursor-pointer"
        >
          Decline
        </button>
        <button
          onClick={acceptCookies}
          className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition cursor-pointer"
        >
          Accept
        </button>
      </div>
    </motion.div>
  );
}
