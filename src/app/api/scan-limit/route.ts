import { supabase } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";
import { getSettings } from "@/utils/getSettings";

export async function POST(req: Request) {
  const { email, ip, fingerprint } = await req.json();

  const scanIntervalSecs =
    (await getSettings<number>("scan_interval_secs")) ?? 86400;
  const fingerprintLimit =
    (await getSettings<number>("max_fingerprint_scan")) ?? 5;

  let verifiedEmail: string | null = null;

  // ✅ 1. Check if email is verified
  if (email) {
    const { data: subscriber } = await supabase
      .from("subscribers")
      .select("email, is_verified")
      .eq("email", email)
      .maybeSingle();

    if (subscriber?.is_verified) {
      verifiedEmail = subscriber.email;
    }
  }

  // ✅ 2. Check fingerprint abuse
  const { count: fingerprintCount } = await supabase
    .from("scan_usage")
    .select("*", { count: "exact", head: true })
    .eq("fingerprint", fingerprint)
    .gte(
      "last_scan_at",
      new Date(Date.now() - scanIntervalSecs * 1000).toISOString()
    );

  if ((fingerprintCount ?? 0) >= fingerprintLimit) {
    return NextResponse.json(
      { allowed: false, reason: "Fingerprint scan limit reached" },
      { status: 429 }
    );
  }

  // === Default values ===
  let allowed = false;
  let scansLeft = 0;
  let resetTime: number | null = null;
  let isAnonymousFirstScan = false;

  // ✅ 3. Anonymous scan logic (no verified email)
  if (!verifiedEmail) {
    const { data: anon } = await supabase
      .from("scan_usage_anon")
      .select("scanned_at")
      .eq("ip_address", ip)
      .maybeSingle();

    const now = Date.now();

    if (anon) {
      const last = new Date(anon.scanned_at).getTime();
      const shouldReset = now >= last + scanIntervalSecs * 1000;

      if (shouldReset) {
        allowed = true;
        scansLeft = 1;
        isAnonymousFirstScan = true;
        resetTime = Math.floor(now + scanIntervalSecs * 1000) / 1000;
      }
    } else {
      // ✅ Tikai atzīmējam, ka tas ir pirmais iespējamais
      allowed = true;
      scansLeft = 1;
      isAnonymousFirstScan = true;
    }
  }

  // ✅ 4. Verified user logic
  if (verifiedEmail) {
    const { data: usageByEmail } = await supabase
      .from("scan_usage")
      .select(
        "paid_scans_left, free_scans_left, free_scans_reset_at, last_scan_at, total_scans"
      )
      .eq("email", verifiedEmail)
      .maybeSingle();

    const defaultFreeScans =
      (await getSettings<number>("default_free_scans")) ?? 3;

    const lastScanTime = usageByEmail?.last_scan_at
      ? new Date(usageByEmail.last_scan_at).getTime()
      : 0;
    const nowTime = Date.now();
    const intervalMs = scanIntervalSecs * 1000;

    const shouldReset =
      (usageByEmail?.free_scans_left ?? 0) <= defaultFreeScans &&
      usageByEmail?.total_scans &&
      usageByEmail.total_scans > 1 &&
      lastScanTime > 0 &&
      nowTime >= lastScanTime + intervalMs;

    if (shouldReset) {
      await supabase
        .from("scan_usage")
        .update({
          free_scans_left: defaultFreeScans,
          free_scans_reset_at: new Date().toISOString(),
        })
        .eq("email", verifiedEmail);
    }

    // Nolasām no jauna
    const { data: updatedUsage } = await supabase
      .from("scan_usage")
      .select("paid_scans_left, free_scans_left, last_scan_at, total_scans")
      .eq("email", verifiedEmail)
      .maybeSingle();

    scansLeft =
      (updatedUsage?.free_scans_left ?? 0) +
      (updatedUsage?.paid_scans_left ?? 0);
    allowed = scansLeft > 0;

    if (updatedUsage?.last_scan_at) {
      const nextAvailable = new Date(
        new Date(updatedUsage.last_scan_at).getTime() + intervalMs
      );
      resetTime = Math.floor(nextAvailable.getTime() / 1000);
    }
  }

  return NextResponse.json({
    allowed,
    scansLeft,
    resetTime,
    emailRequired: !verifiedEmail && !isAnonymousFirstScan,
    emailUnverified: !!email && !verifiedEmail,
  });
}
