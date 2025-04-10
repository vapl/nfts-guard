import { Resend } from "resend";
import { randomUUID } from "crypto";
import { supabase } from "@/lib/supabase/supabase";
import { generateSubscribeEmailContent } from "@/utils/emailTemplate";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, ip } = await req.json();

    if (!email || !ip) {
      return NextResponse.json(
        { error: "Missing email or IP" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Pārbauda vai IP jau ir piesaistīts citam e-pastam
    const { data: usage } = await supabase
      .from("scan_usage")
      .select("email")
      .eq("ip_address", ip)
      .maybeSingle();

    const usageEmail = usage?.email?.toLowerCase();

    if (usageEmail && usageEmail !== trimmedEmail) {
      return NextResponse.json(
        { error: "This IP is already linked to another email." },
        { status: 400 }
      );
    }

    // 2. Ģenerē verifikācijas kodu
    const code = randomUUID();

    // 3. Pārbauda, vai e-pasts jau eksistē
    const { data: existingSubscriber } = await supabase
      .from("subscribers")
      .select("email")
      .eq("email", trimmedEmail)
      .maybeSingle();

    const isNewSubscriber = !existingSubscriber;

    // 4. Atjaunina vai izveido subscriber ierakstu
    const { error: dbError } = await supabase.from("subscribers").upsert(
      {
        email: trimmedEmail,
        verification_code: code,
        source: "scanner",
      },
      { onConflict: "email" }
    );

    if (dbError) {
      console.error("Supabase upsert error:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // 5. Izveido verifikācijas URL
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/verify-email?token=${code}`;

    // 6. Sagatavo verifikācijas e-pastu
    const verificationHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Confirm your email</h2>
        <p>Click the button below to confirm your email and unlock NFT scans:</p>
        <a href="${verifyUrl}" style="padding:10px 20px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:5px;">Verify Email</a>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <code style="background:#f4f4f4;padding:6px 10px;display:inline-block;border-radius:4px;">${verifyUrl}</code>
      </div>
    `;

    // ✅ 7. Sūta verifikācijas e-pastu
    await resend.emails.send({
      from: "NFTs Guard <info@nftsguard.com>",
      to: trimmedEmail,
      subject: "Verify your email",
      html: verificationHtml,
    });

    // ✅ 8. Ja jauns — sūta arī welcome e-pastu
    if (isNewSubscriber) {
      const subscribeHtml = generateSubscribeEmailContent();
      await resend.emails.send({
        from: "NFTs Guard Team <info@nftsguard.com>",
        to: trimmedEmail,
        subject: "Welcome to NFTs Guard!",
        html: subscribeHtml,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification send error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
