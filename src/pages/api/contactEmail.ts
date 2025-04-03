import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const emailContent = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong><br>${message}</p>
  `;

  try {
    const response = await resend.emails.send({
      from: `${name} <no-reply@nftsguard.com>`,
      to: "support@nftsguard.com",
      subject: "New message from NFTs Guard contact form",
      html: emailContent,
      replyTo: email,
    });

    return res.status(200).json({
      success: true,
      messageId: response.data?.id || "No ID returned",
    });
  } catch (error) {
    console.error("Error sending contact message:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
