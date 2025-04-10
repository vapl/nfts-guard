"use client";

import { useScanLimiterContext } from "@/context/ScanContext";
import { supabase } from "@/lib/supabase/supabase";
import { getClientInfo } from "@/utils/getClientInfo";
import { useCallback } from "react";

export const useSaveScan = () => {
  const { checkScanAllowed } = useScanLimiterContext();

  const saveScan = useCallback(
    async (
      ip: string,
      email: string | null,
      status: "success" | "error" = "success",
      errorMessage: string | null = null,
      contractAddress: string | null = null,
      durationMs: number = 0
    ) => {
      const now = new Date().toISOString();
      const { fingerprint, userAgent } = await getClientInfo();

      const { data: existing } = await supabase
        .from("scan_usage")
        .select("*")
        .or(`email.eq.${email},ip_address.eq.${ip}`)
        .maybeSingle();

      const lastScan = existing?.last_scan_at
        ? new Date(existing.last_scan_at)
        : null;

      const within24h = lastScan
        ? Date.now() < lastScan.getTime() + 24 * 60 * 60 * 1000
        : false;

      // If there is no existing record, create a new one
      const newScanUsage = {
        ip_address: ip,
        email,
        fingerprint,
        user_agent: userAgent,
        scans_today: within24h
          ? Math.min((existing?.scans_today ?? 0) + 1, email ? 3 : 1)
          : 1,
        total_scans: (existing?.total_scans ?? 0) + 1,
        last_scan_at: now,
      };

      // ✅ 1. Upsert scan limits
      await supabase.from("scan_usage").upsert(newScanUsage);

      // ✅ 2. Insert full scan log
      await supabase.from("scan_usage_log").insert({
        ip_address: ip,
        email,
        fingerprint,
        user_agent: userAgent,
        contract_address: contractAddress,
        result_status: status,
        error_message: errorMessage,
        duration_ms: durationMs, // ja vajag, var no frontend arī izmērīt laiku
      });
      await checkScanAllowed(); // Refresh top bar
    },
    [checkScanAllowed]
  );

  return { saveScan };
};
