import { supabase } from "@/lib/supabase/supabase";
import { NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/utils/getSettings";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const ip = req.headers.get("x-forwarded-for") || "::1"; // fallback uz localhost

  if (!token) {
    return NextResponse.redirect(
      `${req.nextUrl.origin}/scanner?error=missing_token`
    );
  }

  // ✅ 1. Verify email
  const { data: subscriber, error } = await supabase
    .from("subscribers")
    .update({ is_verified: true, verification_code: null })
    .eq("verification_code", token)
    .eq("is_verified", false)
    .select("email")
    .maybeSingle();

  if (!subscriber || error) {
    return NextResponse.redirect(
      `${req.nextUrl.origin}/scanner?error=invalid_or_used`
    );
  }

  const verifiedEmail = subscriber.email;

  // ✅ 2. Try updating scan_usage
  const { data: usage } = await supabase
    .from("scan_usage")
    .select("*")
    .eq("ip_address", ip)
    .maybeSingle();

  if (usage) {
    await supabase
      .from("scan_usage")
      .update({ email: verifiedEmail })
      .eq("ip_address", ip)
      .eq("email", null);
  } else {
    // ✅ 3. Try fallback to scan_usage_anon
    const { data: anon } = await supabase
      .from("scan_usage_anon")
      .select("*")
      .eq("ip_address", ip)
      .maybeSingle();

    if (anon) {
      const defaultFreeScans =
        (await getSettings<number>("default_free_scans")) ?? 3;

      await supabase.from("scan_usage").insert({
        ip_address: anon.ip_address,
        fingerprint: anon.fingerprint,
        user_agent: anon.user_agent,
        last_scan_at: anon.scanned_at,
        email: verifiedEmail,
        free_scans_left: defaultFreeScans - 1,
        total_scans: 1,
        paid_scans_left: 0,
      });

      // (optional) clean up anon entry
      await supabase
        .from("scan_usage_anon")
        .delete()
        .eq("ip_address", anon.ip_address);
    } else {
      return NextResponse.redirect(
        `${req.nextUrl.origin}/scanner?error=usage_not_found`
      );
    }
  }

  // ✅ 4. Redirect on success
  return NextResponse.redirect(`${req.nextUrl.origin}/scanner?verified=true`);
}
