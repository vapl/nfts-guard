import { NextResponse } from "next/server";
import openai from "@/lib/openai/openaiClient";
import { ScanSummaryInput } from "@/types/apiTypes/scanSummary";
import { upsertAnalysis } from "@/lib/supabase/helpers/upsertAnalysis";
import { supabase } from "@/lib/supabase/supabase";

const REFETCH_INTERVAL_HOURS = 24;

export async function POST(req: Request) {
  const { scanData }: { scanData: ScanSummaryInput } = await req.json();
  const { contractAddress } = scanData;

  if (!contractAddress) {
    return NextResponse.json(
      { error: "Missing contract address" },
      { status: 400 }
    );
  }

  try {
    // ✅ 1. Pārbaudi vai datubāzē jau ir ģenerēts summary pēdējo 24h laikā
    const { data: existing } = await supabase
      .from("nft_ai_analysis_results")
      .select("summary, updated_at")
      .eq("contract_address", contractAddress)
      .single();

    const updatedAt = existing?.updated_at
      ? new Date(existing.updated_at).getTime()
      : 0;
    const now = Date.now();

    const diffHours = (now - updatedAt) / (1000 * 60 * 60);
    const isFresh = diffHours < REFETCH_INTERVAL_HOURS;

    if (existing?.summary && isFresh) {
      return NextResponse.json({ summary: existing.summary });
    }

    // 🧠 2. Izsauc OpenAI (lētā versija)
    const prompt = `
      You are an NFT security expert and advisor.

      Your task is to summarize the overall health and risk profile of an NFT collection scan in 2–3 short, clear sentences.

      Focus on:
      - Overall trend and investment outlook (positive, neutral, risky)
      - Key signals like safety score, rug pull risk, wash trading, liquidity, whale activity, decentralization
      - Any warning signs or positive signs for potential investors
      - A short and helpful recommendation for investors (e.g., “looks safe”, “exercise caution”, “too risky”)

      Avoid technical terms, numbers or raw data. Be objective and neutral in tone.

      Format:
      Return one valid JSON object like this:
      { "summary": "..." }

      ❗ Do NOT include markdown or text outside the JSON.
      ❗ Do NOT mention specific numbers or metric names.
      ❗ Do NOT return multiple objects.

      Data:
      ${JSON.stringify(scanData, null, 2)}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106", // ✅ Lēts modelis (~$0.001 / 750 words)
      messages: [{ role: "user", content: prompt }],
    });

    const summary = completion.choices[0].message?.content?.trim() ?? "";

    // ✅ 3. Saglabā kešā
    await upsertAnalysis(contractAddress, { summary });

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("❌ Error in generate-scan-summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
