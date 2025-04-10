import { supabase } from "@/lib/supabase/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    const errorUrl = `${req.nextUrl.origin}/scanner?error=missing_token`;
    return NextResponse.redirect(errorUrl);
  }

  // ✅ Atjaunina un verificē
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

  // ✅ Veiksmīgs redirect
  const successUrl = `${req.nextUrl.origin}/scanner?verified=true`;
  return NextResponse.redirect(successUrl);
}
