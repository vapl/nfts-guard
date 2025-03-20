import { generateSubscribeEmailContent } from "@/utils/emailTemplate";
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SubscribeRequest {
  email: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email }: SubscribeRequest = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email address" });
  }

  try {
    console.log("Sending subscription confirmation email to:", email);

    // Formēts e-pasta saturs
    const emailContent = generateSubscribeEmailContent(email);

    const response = await resend.emails.send({
      from: "info@nftsguard.com",
      to: email,
      subject: "🎉 Welcome to NFTs Guard!",
      html: emailContent,
    });

    console.log("Resend API response:", response);

    return res.status(200).json({
      success: true,
      messageId: response.data?.id || "No ID returned",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ error: "Failed to send email", details: error });
  }
}
