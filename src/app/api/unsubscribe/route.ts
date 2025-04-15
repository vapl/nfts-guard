import { supabase } from "@/lib/supabase/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect("/unsubscribe?error=missing_token");
  }

  const { error } = await supabase
    .from("subscribers")
    .update({ unsubscribed: true })
    .eq("unsubscribe_token", token)
    .eq("is_verified", true);

  if (error) {
    console.error("❌ Failed to unsubscribe:", error);
    return NextResponse.redirect("/unsubscribe?error=server_error");
  }

  return NextResponse.redirect("/unsubscribe?success=true");
}
