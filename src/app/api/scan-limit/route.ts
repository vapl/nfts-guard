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

  // 1. Check if email is verified
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

  // 2. Get usage data
  const { data: usageByEmail } = await supabase
    .from("scan_usage")
    .select(
      "paid_scans_left, free_scans_left, free_scans_reset_at, last_scan_at, total_scans"
    )
    .eq("email", verifiedEmail)
    .maybeSingle();

  const { data: usageByIP } = await supabase
    .from("scan_usage")
    .select("last_scan_at, free_scan_used")
    .eq("ip_address", ip)
    .maybeSingle();

  // 3. Fingerprint abuse limit
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

  // 4. Evaluate scan permission
  let allowed = false;
  let scansLeft = 0;
  let resetTime: number | null = null;
  let isAnonymousFirstScan = false;

  if (!verifiedEmail) {
    if (usageByIP) {
      const { last_scan_at, free_scan_used } = usageByIP;

      const lastScanTime = last_scan_at ? new Date(last_scan_at).getTime() : 0;
      const nowTime = Date.now();
      const intervalMs = scanIntervalSecs * 1000;

      const shouldReset =
        lastScanTime > 0 && nowTime >= lastScanTime + intervalMs;

      if (!free_scan_used) {
        allowed = true;
        scansLeft = 1;
        isAnonymousFirstScan = true;
      } else if (shouldReset && free_scan_used) {
        await supabase
          .from("scan_usage")
          .update({
            free_scans_left: 0,
            free_scans_reset_at: new Date().toISOString(),
            free_scan_used: false,
            last_scan_at: new Date().toISOString(),
          })
          .eq("ip_address", ip);

        allowed = true;
        scansLeft = 1;
        isAnonymousFirstScan = true;
      }
    } else {
      allowed = true;
      scansLeft = 1;
      isAnonymousFirstScan = true;
    }
  }

  if (verifiedEmail && usageByEmail) {
    const { last_scan_at, free_scans_left, total_scans } = usageByEmail;
    const defaultFreeScans =
      (await getSettings<number>("default_free_scans")) ?? 3;

    const lastScanTime = last_scan_at ? new Date(last_scan_at).getTime() : 0;
    const nowTime = Date.now();
    const intervalMs = scanIntervalSecs * 1000;

    const shouldReset =
      (free_scans_left ?? 0) <= defaultFreeScans &&
      total_scans > 1 &&
      lastScanTime > 0 &&
      nowTime >= lastScanTime + intervalMs;

    if (shouldReset) {
      await supabase
        .from("scan_usage")
        .update({
          free_scans_left: defaultFreeScans,
          free_scans_reset_at: new Date().toISOString(), // tikai informatīvi
        })
        .eq("email", verifiedEmail);
    }

    // Nolasām no jauna — obligāti pēc iespējamā update
    const { data: updatedUsage } = await supabase
      .from("scan_usage")
      .select(
        "paid_scans_left, free_scans_left, last_scan_at, free_scan_used, total_scans"
      )
      .eq("email", verifiedEmail)
      .maybeSingle();

    scansLeft =
      (updatedUsage?.free_scans_left ?? 0) +
      (updatedUsage?.paid_scans_left ?? 0);
    allowed = scansLeft > 0;

    if (updatedUsage?.last_scan_at) {
      const nextAvailable = new Date(
        new Date(updatedUsage.last_scan_at).getTime() + scanIntervalSecs * 1000
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
