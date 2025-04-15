"use client";

import { useScanLimiterContext } from "@/context/ScanContext";
import { supabase } from "@/lib/supabase/supabase";
import { getClientInfo } from "@/utils/getClientInfo";
import { getSettings } from "@/utils/getSettings";
import { useCallback } from "react";

interface ScanUsage {
  last_scan_at: string;
  total_scans: number;
  paid_scans_left?: number;
  free_scans_left?: number;
  free_scan_used?: boolean;
  email?: string;
  ip_address?: string;
}

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
      const defaultFreeScans =
        (await getSettings<number>("default_free_scans")) ?? 3;

      let existing: ScanUsage | null = null;

      if (email) {
        const { data, error } = await supabase
          .from("scan_usage")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        if (error) console.error("❌ Error fetching by email:", error.message);
        existing = data;
      }

      if (!existing) {
        const { data, error } = await supabase
          .from("scan_usage")
          .select("*")
          .eq("ip_address", ip)
          .maybeSingle();

        if (error) console.error("❌ Error fetching by IP:", error.message);
        existing = data;
      }

      if (!existing) {
        const insert = await supabase.from("scan_usage").insert({
          ip_address: ip,
          email,
          fingerprint,
          user_agent: userAgent,
          paid_scans_left: 0,
          free_scans_left: defaultFreeScans - 1,
          free_scans_reset_at: new Date().toISOString().split("T")[0],
          total_scans: 1,
          free_scan_used: !email,
          last_scan_at: now,
        });

        if (insert.error)
          console.error("❌ Insert error:", insert.error.message);
      } else {
        const updates: ScanUsage = {
          last_scan_at: now,
          total_scans: (existing.total_scans ?? 0) + 1,
        };

        if ((existing.paid_scans_left ?? 0) > 0) {
          updates.paid_scans_left = Math.max(
            0,
            (existing.paid_scans_left ?? 0) - 1
          );
        } else if ((existing.free_scans_left ?? 0) > 0) {
          updates.free_scans_left = Math.max(
            0,
            (existing.free_scans_left ?? 0) - 1
          );
        } else if (
          (!email && !existing.free_scan_used) ||
          (email &&
            (existing.free_scans_left === null ||
              existing.free_scans_left === undefined))
        ) {
          // Pirmais bezmaksas skanējums anonīmajam lietotājam vai ja nav iestatīts free_scans_left
          updates.free_scans_left = defaultFreeScans - 1;
          if (!email) updates.free_scan_used = true;
        } else {
          console.warn("⚠️ No scans left to decrement or initialize.");
        }

        const { error, data } = await supabase
          .from("scan_usage")
          .update(updates)
          .eq(existing.email ? "email" : "ip_address", existing.email ?? ip)
          .select();

        if (error) {
          console.error("❌ Failed to update scan usage:", error.message);
        } else if (!data || data.length === 0) {
          console.warn("⚠️ No rows updated!");
        }
      }

      // 🔄 Refresh context state
      await checkScanAllowed();

      // 📒 Log event
      const log = await supabase.from("scan_usage_log").insert({
        ip_address: ip,
        email,
        fingerprint,
        user_agent: userAgent,
        contract_address: contractAddress,
        result_status: status,
        error_message: errorMessage,
        duration_ms: durationMs,
      });

      if (log.error) {
        console.error("❌ Log insert failed:", log.error.message);
      }
    },
    [checkScanAllowed]
  );

  return { saveScan };
};
