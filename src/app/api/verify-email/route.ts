import { supabase } from "@/lib/supabase/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const ip = req.headers.get("x-forwarded-for") || "unknown"; // ja IP pieejams

  if (!token) {
    const errorUrl = `${req.nextUrl.origin}/scanner?error=missing_token`;
    return NextResponse.redirect(errorUrl);
  }

  // ✅ 1. Verificē e-pastu
  const { data, error } = await supabase
    .from("subscribers")
    .update({ is_verified: true, verification_code: null })
    .eq("verification_code", token)
    .eq("is_verified", false)
    .select("email")
    .maybeSingle();

  if (!data || error) {
    const failUrl = `${req.nextUrl.origin}/scanner?error=invalid_or_used`;
    return NextResponse.redirect(failUrl);
  }

  const verifiedEmail = data.email;

  // ✅ 2. Atjauno scan_usage ierakstu
  const { data: usage } = await supabase
    .from("scan_usage")
    .select("*")
    .eq("ip_address", ip)
    .maybeSingle();

  if (usage) {
    await supabase
      .from("scan_usage")
      .update({
        email: verifiedEmail,
      })
      .eq("ip_address", ip)
      .eq("email", null);
  } else {
    // Ja nav nekāds ieraksts
    const failUrl = `${req.nextUrl.origin}/scanner?error=usage_not_found`;
    return NextResponse.redirect(failUrl);
  }

  // ✅ 3. Success
  const successUrl = `${req.nextUrl.origin}/scanner?verified=true`;
  return NextResponse.redirect(successUrl);
}
