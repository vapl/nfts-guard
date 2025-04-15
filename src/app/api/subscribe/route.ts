import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateSubscribeEmailContent } from "@/utils/emailTemplate";
import { randomUUID } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

const unsubscribeToken = randomUUID();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Missing email address" },
        { status: 400 }
      );
    }

    const emailContent = generateSubscribeEmailContent(unsubscribeToken);

    const response = await resend.emails.send({
      from: "NFTs Guard Team <info@nftsguard.com>",
      to: email,
      subject: "Welcome to NFTs Guard!",
      html: emailContent,
    });

    return NextResponse.json({
      success: true,
      messageId: response.data?.id || "No ID returned",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error },
      { status: 500 }
    );
  }
}
