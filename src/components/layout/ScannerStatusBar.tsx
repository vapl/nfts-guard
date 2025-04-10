"use client";

import { useScanLimiterContext } from "@/context/ScanContext";
import { supabase } from "@/lib/supabase/supabase";
import { getClientInfo } from "@/utils/getClientInfo";
import { useEffect, useState } from "react";

export default function ScanStatusBar() {
  const {
    scansLeft,
    emailRequired,
    emailUnverified,
    resetTime,
    checkScanAllowed,
  } = useScanLimiterContext();

  const [timeLeft, setTimeLeft] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  // ✅ Reizē atsvaidzina arī atlikuma rādīšanu
  useEffect(() => {
    if (!resetTime) return;

    const updateTimeLeft = () => {
      const now = Date.now();
      const diff = resetTime * 1000 - now;

      if (diff <= 0) {
        setTimeLeft("");
        checkScanAllowed(); // ✅ atsvaidzina skanēšanas limitus
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`in ${hours}h ${minutes}m`);
    };

    // ✅ Uzreiz atjauno
    updateTimeLeft();

    // ⏳ Precīzs refresh brīdī, kad beidzas taimeris
    const msUntilReset = resetTime * 1000 - Date.now();
    const timeout = setTimeout(() => {
      checkScanAllowed();
    }, msUntilReset + 1000); // +1s buferis

    // ⏱ Lai atjauno laiku ik pa laikam UI
    const interval = setInterval(updateTimeLeft, 30_000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [resetTime, checkScanAllowed]);

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

  const showStatusBar = scansLeft !== null || emailRequired;
  if (!showStatusBar || !resetTime) return null;

  const resetClock = new Date(resetTime * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <>
      <div className="block w-full rounded-full bg-gradient-to-r from-indigo-800 to-purple-600 text-white text-sm px-4 py-1 text-center z-50">
        {emailUnverified ? (
          <p className="text-sm text-white text-center">
            Please verify your email to unlock <strong>2 more scans</strong>.{" "}
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
          <p>
            Enter your email to unlock <strong>2 more scans</strong>.{" "}
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
          <p>
            You have <strong>{scansLeft}</strong> scan
            {scansLeft !== 1 && "s"} left today.
          </p>
        ) : (
          <p>
            Your scan limit is reached. New scans available at{" "}
            <strong>{resetClock}</strong>{" "}
            {timeLeft && (
              <span className="opacity-70 text-sm">({timeLeft})</span>
            )}
          </p>
        )}
      </div>
      <div className="mb-7" />
    </>
  );
}
