"use client";

import { useScanLimiterContext } from "@/context/ScanContext";
import { supabase } from "@/lib/supabase/supabase";
import { getClientInfo } from "@/utils/getClientInfo";
import { getSettings } from "@/utils/getSettings";
import { useEffect, useRef, useState } from "react";

export default function ScanStatusBar() {
  const {
    scansLeft,
    emailRequired,
    emailUnverified,
    hasScannedOnce,
    resetTime,
    checkScanAllowed,
  } = useScanLimiterContext();

  const [timeLeft, setTimeLeft] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const timeClearedRef = useRef(false);

  const [freeScans, setFreeScans] = useState(0);
  useEffect(() => {
    const fetchDefaultFreeScans = async () => {
      const scans = await getSettings<number>("default_free_scans");
      setFreeScans(scans ?? 3);
    };
    fetchDefaultFreeScans();
  }, []);

  // ✅ Reizē atsvaidzina arī atlikuma rādīšanu
  useEffect(() => {
    if (!resetTime) return;

    const updateTimeLeft = async () => {
      const now = Date.now();
      const diff = resetTime * 1000 - now;

      if (diff <= 0 && !timeClearedRef.current) {
        timeClearedRef.current = true; // ☑️ Pārtrauc turpmākos atjauninājumus
        const result = await checkScanAllowed();

        if (result.allowed) {
          setTimeLeft("");
        }

        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimeLeft(); // uzreiz izsauc
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [resetTime, checkScanAllowed]);

  // 🧹 Kad resetTime mainās, ļaujam atkal tīrīt nākotnē
  useEffect(() => {
    timeClearedRef.current = false;
  }, [resetTime]);

  const handleResend = async () => {
    try {
      const { ip } = await getClientInfo();

      const { data: usage } = await supabase
        .from("scan_usage")
        .select("email")
        .eq("ip_address", ip)
        .maybeSingle();

      const email = usage?.email?.toLowerCase();
      if (!email) return;

      const res = await fetch("/api/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to resend email.");

      setResendMessage("Email sent! Check your inbox.");
      setTimeout(() => setResendMessage(""), 5000);
    } catch (error) {
      console.error("Resend error:", error);
      setResendMessage("Failed to resend email.");
      setTimeout(() => setResendMessage(""), 5000);
    }
  };

  const showStatusBar =
    hasScannedOnce &&
    ((scansLeft !== null && scansLeft !== 1) ||
      emailRequired ||
      emailUnverified ||
      resetTime !== null);
  if (!showStatusBar) return null;

  const resetClock = resetTime
    ? new Date(resetTime * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";

  const validFreeScans = Math.max(freeScans - 1, 0);

  return (
    <>
      <div className="block w-full rounded-full bg-gradient-to-r from-indigo-800 to-purple-600 text-white text-sm px-4 py-1 text-center z-50">
        {emailUnverified ? (
          <p className="text-sm text-white text-center">
            Please verify your email to unlock{" "}
            <strong>{validFreeScans} more scans</strong>.{" "}
            {!resendMessage ? (
              <>
                Did not receive?{" "}
                <button
                  onClick={handleResend}
                  className="underline hover:text-white font-medium cursor-pointer"
                >
                  Resend email
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-200">{resendMessage}</span>
            )}
          </p>
        ) : emailRequired ? (
          <p className="text-sm text-white text-center">
            Enter your email to unlock{" "}
            <strong>{validFreeScans} more scans</strong>.{" "}
            <button
              onClick={() =>
                window?.dispatchEvent(new Event("open-email-modal"))
              }
              className="underline hover:text-white cursor-pointer"
            >
              Unlock Now
            </button>
          </p>
        ) : scansLeft !== null && scansLeft > 0 ? (
          <p className="text-sm text-white text-center">
            You have <strong>{scansLeft}</strong> scan
            {scansLeft !== 1 && "s"} left today.
          </p>
        ) : timeLeft !== "" ? (
          <p className="text-sm text-white text-center">
            Your scan limit is reached. New scans available at{" "}
            <strong>{resetClock}</strong>{" "}
            <span className="opacity-70 text-sm">({timeLeft})</span>
          </p>
        ) : null}
      </div>

      <div className="mb-7" />
    </>
  );
}
