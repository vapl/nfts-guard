// /app/api/resend-verification/route.ts

import { Resend } from "resend";
import { randomUUID } from "crypto";
import { supabase } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const code = randomUUID();

    const { error: dbError } = await supabase
      .from("subscribers")
      .update({ verification_code: code })
      .eq("email", trimmedEmail);

    if (dbError) {
      console.error("❌ DB error during resend:", dbError);
      return NextResponse.json(
        { error: "Failed to update verification code" },
        { status: 500 }
      );
    }

    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/verify-email?token=${code}`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Confirm your email</h2>
        <p>Click the button below to confirm your email and unlock NFT scans:</p>
        <a href="${verifyUrl}" style="padding:10px 20px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:5px;">Verify Email</a>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <code style="background:#f4f4f4;padding:6px 10px;display:inline-block;border-radius:4px;">${verifyUrl}</code>
      </div>
    `;

    await resend.emails.send({
      from: "NFTs Guard <info@nftsguard.com>",
      to: trimmedEmail,
      subject: "Verify your email",
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Resend verification error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
