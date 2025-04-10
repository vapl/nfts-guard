import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const emailContent = `
      <p><strong>Name:</strong> ${escape(name)}</p>
      <p><strong>Email:</strong> ${escape(email)}</p>
      <p><strong>Message:</strong><br>${escape(message)}</p>
    `;

    const response = await resend.emails.send({
      from: "NFTs Guard <no-reply@nftsguard.com>",
      to: "support@nftsguard.com",
      subject: "New message from NFTs Guard contact form",
      html: emailContent,
      replyTo: email,
    });

    return NextResponse.json({
      success: true,
      messageId: response.data?.id || "No ID returned",
    });
  } catch (error) {
    console.error("Error sending contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

// Vienkāršs HTML escaper (pret XSS)
function escape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
