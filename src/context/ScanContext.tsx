"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase/supabase";
import { getClientInfo } from "@/utils/getClientInfo";

interface ScanLimiterContextType {
  scansLeft: number | null;
  emailRequired: boolean;
  hasScannedOnce: boolean;
  resetTime: number | null;
  emailUnverified: boolean;
  setHasScannedOnce: (v: boolean) => void;
  checkScanAllowed: () => Promise<{
    allowed: boolean;
    emailRequired: boolean;
    emailUnverified: boolean;
  }>;
}

const ScanLimiterContext = createContext<ScanLimiterContextType | undefined>(
  undefined
);

export const useScanLimiterContext = () => {
  const context = useContext(ScanLimiterContext);
  if (!context) throw new Error("Must be used within ScanLimiterProvider");
  return context;
};

export const ScanLimiterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [scansLeft, setScansLeft] = useState<number | null>(null);
  const [emailRequired, setEmailRequired] = useState<boolean>(false);
  const [resetTime, setResetTime] = useState<number | null>(null);
  const [hasScannedOnce, setHasScannedOnceState] = useState<boolean>(false);
  const [emailUnverified, setEmailUnverified] = useState<boolean>(false);

  const setHasScannedOnce = (value: boolean) => {
    setHasScannedOnceState(value);
  };

  const checkScanAllowed = useCallback(async (): Promise<{
    allowed: boolean;
    emailRequired: boolean;
    emailUnverified: boolean;
  }> => {
    try {
      const { ip, fingerprint, userAgent } = await getClientInfo();

      let email: string | null = null;
      let emailIsVerified = false;

      const { data: usage } = await supabase
        .from("scan_usage")
        .select("email, last_scan_at")
        .eq("ip_address", ip)
        .maybeSingle();

      if (usage?.last_scan_at) {
        const lastScan = new Date(usage.last_scan_at);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        if (lastScan >= todayStart) setHasScannedOnce(true);
      }

      if (usage?.email) {
        email = usage.email;
        const { data: subscriber } = await supabase
          .from("subscribers")
          .select("is_verified")
          .eq("email", usage.email)
          .maybeSingle();

        if (subscriber?.is_verified) {
          emailIsVerified = true;
          setEmailUnverified(false);
        } else {
          emailIsVerified = false;
          setEmailUnverified(true);
        }
      } else {
        email = null;
        emailIsVerified = false;
        setEmailUnverified(false); // <- ļoti svarīgi: nav e-pasta ≠ nav apstiprināts
      }

      const res = await fetch("/api/scan-limit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ip, fingerprint, userAgent }),
      });

      const data = await res.json();

      setScansLeft(Math.max(data.scansLeft ?? 0, 0));
      setResetTime(data.resetTime ?? null);

      if (!emailIsVerified) {
        const { data: usageData } = await supabase
          .from("scan_usage")
          .select("scans_today, email")
          .eq("ip_address", ip)
          .maybeSingle();

        const scansToday = usageData?.scans_today ?? 0;
        const hasUsedOnce = scansToday > 0;
        const hasEmail = !!usageData?.email;

        setEmailRequired(true);
        setEmailUnverified(hasEmail);

        return {
          allowed: hasEmail ? false : !hasUsedOnce,
          emailRequired: true,
          emailUnverified: hasEmail,
        };
      }

      setEmailRequired(false);
      setEmailUnverified(false);

      return {
        allowed: data.allowed,
        emailRequired: false,
        emailUnverified: false,
      };
    } catch (error) {
      console.error("Scan limiter error:", error);
      return {
        allowed: false,
        emailRequired: false,
        emailUnverified: false,
      };
    }
  }, []);

  useEffect(() => {
    checkScanAllowed();
  }, [checkScanAllowed]);

  return (
    <ScanLimiterContext.Provider
      value={{
        scansLeft,
        emailRequired,
        emailUnverified,
        hasScannedOnce,
        resetTime,
        setHasScannedOnce,
        checkScanAllowed,
      }}
    >
      {children}
    </ScanLimiterContext.Provider>
  );
};
