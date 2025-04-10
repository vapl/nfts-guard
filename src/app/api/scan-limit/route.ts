import { supabase } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, ip, fingerprint } = await req.json();

  const now = new Date();
  const maxScans = email ? 3 : 1;
  let verifiedEmail: string | null = null;

  // 1. Verify email exists in subscribers table
  if (email) {
    const { data: subscriber } = await supabase
      .from("subscribers")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (subscriber?.email) {
      verifiedEmail = subscriber.email;
    }
  }

  // 2. Get scan usage data by email or IP
  const { data: usageByEmail } = await supabase
    .from("scan_usage")
    .select("scans_today, last_scan_at")
    .eq("email", verifiedEmail)
    .maybeSingle();

  const { data: usageByIP } = await supabase
    .from("scan_usage")
    .select("scans_today, last_scan_at")
    .eq("ip_address", ip)
    .maybeSingle();

  const usage = usageByEmail || usageByIP;

  const { count: fingerprintCount } = await supabase
    .from("scan_usage")
    .select("*", { count: "exact", head: true })
    .eq("fingerprint", fingerprint)
    .gte(
      "last_scan_at",
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    );

  if ((fingerprintCount ?? 0) >= 3) {
    return NextResponse.json(
      { allowed: false, reason: "Fingerprint scan liit reached" },
      { status: 429 }
    );
  }

  // 4. Rolling 24h logic
  let scansToday = 0;
  let resetTime: number | null = null;

  if (usage?.last_scan_at) {
    const lastScan = new Date(usage.last_scan_at);
    const expiresAt = new Date(lastScan.getTime() + 24 * 60 * 60 * 1000);
    resetTime = Math.floor(expiresAt.getTime() / 1000);

    const isWithin24h = now < expiresAt;
    if (isWithin24h) {
      scansToday = usage.scans_today;
    }
  }

  const allowed = scansToday < maxScans;
  const scansLeft = allowed ? maxScans - scansToday : 0;
  const hasScanned = scansToday > 0;

  return NextResponse.json({
    scansLeft,
    emailRequired: !verifiedEmail,
    resetTime,
    allowed,
    hasScanned,
  });
}
