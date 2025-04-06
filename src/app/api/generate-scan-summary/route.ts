// app/api/generate-scan-summary/route.ts
import { NextResponse } from "next/server";
import openai from "@/lib/openai/openaiClient";
import { ScanSummaryInput } from "@/types/apiTypes/scanSummary";
import { upsertAnalysis } from "@/lib/supabase/helpers/upsertAnalysis";

export async function POST(req: Request) {
  const { scanData }: { scanData: ScanSummaryInput } = await req.json();
  const contractAddress = scanData.collectionData?.contract_address;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!contractAddress) {
    return NextResponse.json(
      { error: "Missing contract address" },
      { status: 400 }
    );
  }

  let summary = null;

  try {
    const cached = await fetch(
      `${baseUrl}/api/get-analysis?contractAddress=${contractAddress}`
    );
    const json = await cached.json();
    summary = json?.summary ?? null;
  } catch (err) {
    console.warn(
      "⚠️ Cache fetch failed, continuing with fresh generation.",
      err
    );
  }

  if (summary) {
    return NextResponse.json({ summary });
  }

  // 🧐 Generate new summary
  const prompt = `
    You are an NFT security expert.

    Summarize the NFT collection scan for a regular investor using 2–3 concise sentences. 
    Clearly state the collection's safety level and risk profile, based on metrics such as:
    - Safety score
    - Wash trading index
    - Rug pull indicators (whale drop, buyer/seller ratio)
    - Whale activity (accumulation, dumping, flipping)
    - Volume, liquidity, and volatility
    - Holder distribution and decentralization

    Return an objective summary based on these inputs:

    ${JSON.stringify(scanData, null, 2)}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const summary =
      completion.choices[0].message?.content ?? "No summary available.";

    await upsertAnalysis(contractAddress, { summary });

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("OpenAI Summary Error:", err);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
