// app/api/generate-section-explanation/route.ts
import { NextResponse } from "next/server";
import openai from "@/lib/openai/openaiClient";
import { upsertAnalysis } from "@/lib/supabase/helpers/upsertAnalysis";

export interface ScanCardData {
  title: string;
  value?: string | number;
  variant?: "safe" | "warning" | "danger" | "neutral";
  tooltipInfo?: string;
  metrics?: Record<string, string | number>; // ✅ Extended context for AI
}

interface RequestBody {
  contractAddress: string;
  cards: ScanCardData[];
}

export async function POST(req: Request) {
  const { contractAddress, cards }: RequestBody = await req.json();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!contractAddress) {
    return NextResponse.json(
      { error: "Missing contract address" },
      { status: 400 }
    );
  }

  try {
    // 🔁 Check cached data first
    const response = await fetch(
      `${baseUrl}/api/get-analysis?contractAddress=${contractAddress}`
    );
    const cachedData: { explanations: Record<string, string> | null } =
      await response.json();

    if (cachedData?.explanations) {
      return NextResponse.json({ explanations: cachedData.explanations });
    }

    // 🧠 Better prompt with metrics context
    const prompt = `
      You are an NFT security analyst. Based on the following dashboard card data, provide a professional explanation for each card.
      Each explanation should be concise (1–2 sentences), easy to understand, and based on the provided metrics.

      Return ONLY raw JSON: { "Card Title": "Explanation" }
      Do NOT include markdown, formatting, or extra commentary.

      Cards:
      ${JSON.stringify(cards, null, 2)}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = completion.choices[0].message?.content ?? "{}";

    // Remove potential markdown wrappers
    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();

    let explanations: Record<string, string> = {};

    try {
      explanations = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("❌ Failed to parse explanation JSON:", parseError);
      console.warn("🧠 Raw response from OpenAI:", rawText);
      return NextResponse.json(
        { error: "OpenAI returned invalid JSON" },
        { status: 500 }
      );
    }

    await upsertAnalysis(contractAddress, { explanations });

    return NextResponse.json({ explanations });
  } catch (err) {
    console.error("OpenAI Explanation Error:", err);
    return NextResponse.json(
      { error: "Failed to generate explanations" },
      { status: 500 }
    );
  }
}
