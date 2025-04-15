// ✅ Pārstrādāts /api/generate-scan-summary endpoint ar jaunu updateTime salīdzinājumu

import { NextResponse } from "next/server";
import openai from "@/lib/openai/openaiClient";
import { ScanSummaryInput } from "@/types/apiTypes/scanSummary";
import { generateSummaryPrompt } from "@/lib/helpers/generateSummaryPrompt";

export async function POST(req: Request) {
  const { scanData }: { scanData: ScanSummaryInput } = await req.json();

  if (!scanData.contractAddress) {
    return NextResponse.json(
      { error: "Missing contract address" },
      { status: 400 }
    );
  }

  try {
    const prompt = generateSummaryPrompt(scanData);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let summary = completion.choices[0].message?.content?.trim() ?? "";

    try {
      const parsed = JSON.parse(summary);
      if (parsed?.summary && typeof parsed.summary === "string") {
        summary = parsed.summary;
      }
    } catch {
      // leave as is
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("❌ Error in generate-scan-summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
