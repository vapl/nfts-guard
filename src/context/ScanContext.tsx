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
  paidScansLeft: boolean;
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
  const [paidScansLeft, setPaidScansLeft] = useState<boolean>(false);

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

      // 1. Sākumā mēģinām nolasīt no scan_usage
      const { data: usage } = await supabase
        .from("scan_usage")
        .select("email, last_scan_at, paid_scans_left")
        .eq("ip_address", ip)
        .maybeSingle();

      setPaidScansLeft(usage?.paid_scans_left > 0);

      // 2. Ja ir skenēts pēdējo 24h laikā — uzskatām par 'hasScannedOnce'
      if (usage?.last_scan_at) {
        const lastScan = new Date(usage.last_scan_at);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (lastScan >= twentyFourHoursAgo) {
          setHasScannedOnce(true);
        }
      }

      // 3. Ja ir e-pasts — pārbaudām verifikāciju
      if (usage?.email) {
        email = usage.email;

        const { data: subscriber } = await supabase
          .from("subscribers")
          .select("is_verified")
          .eq("email", usage.email)
          .maybeSingle();

        setEmailUnverified(!subscriber?.is_verified);
      } else {
        setEmailUnverified(false);
      }

      // ✅ 4. Pārbaudām arī anonīmo tabulu, ja nav `hasScannedOnce`
      if (!hasScannedOnce) {
        const { data: anon } = await supabase
          .from("scan_usage_anon")
          .select("scanned_at")
          .eq("ip_address", ip)
          .maybeSingle();

        if (anon?.scanned_at) {
          const anonScan = new Date(anon.scanned_at);
          const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          if (anonScan >= twentyFourHoursAgo) {
            setHasScannedOnce(true);
          }
        }
      }

      // 5. Vaicājam backendam reālo statusu
      const res = await fetch("/api/scan-limit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ip, fingerprint, userAgent }),
      });

      const data = await res.json();

      // 6. Atjaunojam kontekstu
      setScansLeft(Math.max(data.scansLeft ?? 0, 0));
      setResetTime(data.resetTime ?? null);
      setEmailRequired(data.emailRequired);
      setEmailUnverified(data.emailUnverified);

      if (!hasScannedOnce && data.allowed) {
        setHasScannedOnce(true);
      }

      return {
        allowed: data.allowed,
        emailRequired: data.emailRequired,
        emailUnverified: data.emailUnverified,
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
  }, []);

  return (
    <ScanLimiterContext.Provider
      value={{
        scansLeft,
        emailRequired,
        emailUnverified,
        hasScannedOnce,
        resetTime,
        paidScansLeft,
        setHasScannedOnce,
        checkScanAllowed,
      }}
    >
      {children}
    </ScanLimiterContext.Provider>
  );
};
