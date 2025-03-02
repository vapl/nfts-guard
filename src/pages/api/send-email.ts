import { generateEmailContent } from "@/utils/emailTemplate";
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface nftData {
  name: string;
  description: string;
  owner: string;
  image?: string;
}

interface EmailRequest {
  email: string;
  nftData: nftData;
  contractAddress: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, nftData, contractAddress }: EmailRequest = req.body;

  if (!email || !nftData) {
    return res.status(400).json({ error: "Missing email or NFT data" });
  }

  try {
    console.log("Sending email to:", email);
    console.log("NFT Data:", nftData);

    // Formated email content;
    const emailContent = generateEmailContent(nftData, contractAddress);

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "NFT authenticy result",
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
