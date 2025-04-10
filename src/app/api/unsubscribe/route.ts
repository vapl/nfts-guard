import { supabase } from "@/lib/supabase/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.redirect("/unsubscribe?error=missing_email");
  }

  const { error } = await supabase
    .from("subscribers")
    .update({ unsubscribed: true })
    .eq("email", decodeURIComponent(email))
    .eq("is_verified", true);

  if (error) {
    console.error("❌ Failed to unsubscribe:", error);
    return NextResponse.redirect("/unsubscribe?error=server_error");
  }

  return NextResponse.redirect("/unsubscribe?success=true");
}
