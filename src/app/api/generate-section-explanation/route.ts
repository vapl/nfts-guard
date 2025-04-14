// app/api/generate-section-explanation/route.ts
import { NextResponse } from "next/server";
import openai from "@/lib/openai/openaiClient";
import { upsertAnalysis } from "@/lib/supabase/helpers/upsertAnalysis";
import { supabase } from "@/lib/supabase/supabase";

export interface ScanCardData {
  title: string;
  value?: string | number;
  variant?: "safe" | "warning" | "danger" | "neutral";
  tooltipInfo?: string;
  metrics?: Record<string, string | number>;
}

interface RequestBody {
  contractAddress: string;
  cards: ScanCardData[];
}

export async function POST(req: Request) {
  const { contractAddress, cards }: RequestBody = await req.json();

  if (!contractAddress) {
    return NextResponse.json(
      { error: "Missing contract address" },
      { status: 400 }
    );
  }

  try {
    // 🔁 Step 1: Fetch cached explanations directly from Supabase
    const { data: cachedData, error } = await supabase
      .from("nft_ai_analysis_results")
      .select("explanations, updated_at")
      .eq("contract_address", contractAddress)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Supabase error:", error);
    }

    // 🔁 Step 2: Check if cache is fresh
    const { data: latest } = await supabase.rpc("get_latest_update_time", {
      contract_addr: contractAddress,
    });

    const isUpToDate =
      cachedData?.updated_at &&
      latest &&
      new Date(cachedData.updated_at) >= new Date(latest);

    // ✅ Return cached version if still valid
    if (cachedData?.explanations && isUpToDate) {
      return NextResponse.json({ explanations: cachedData.explanations });
    }

    // 🔍 Validate input
    if (!Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid cards array" },
        { status: 400 }
      );
    }

    // 🧠 Step 3: Generate fresh explanations with OpenAI
    const prompt = `
      You are an NFT security and investment assistant.

      Your task is to explain what each analysis card represents to both experienced investors and newcomers.

      For each card, explain:
      - What the card shows in general (not exact values)
      - What kind of trend or risk it helps investors understand
      - Why it matters for decision making

      Use a neutral, professional tone. No marketing fluff, no numbers.

      ✅ Format: Return valid JSON in this format: { "Card Title": "Explanation" }

      ❗ Return ONE valid JSON object only.
      🚫 Do NOT include exact data values.
      🚫 Do NOT use markdown, comments, or text outside the JSON.
      🚫 Do NOT repeat card titles in the explanations.

      Cards:
      ${JSON.stringify(
        cards.map((c) => ({ title: c.title })),
        null,
        2
      )}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content:
            'You must return only valid JSON in this format: { "Card Title": "Explanation" }. No other text, markdown or formatting is allowed.',
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = completion.choices[0].message?.content ?? "";
    const match = raw.trim().match(/{[\s\S]+}/);

    if (!match) {
      console.warn("OpenAI did not return valid JSON:", raw);
      return NextResponse.json(
        { error: "OpenAI response missing valid JSON" },
        { status: 500 }
      );
    }

    let explanations: Record<string, string> = {};
    try {
      explanations = JSON.parse(match[0]);
    } catch (err) {
      console.error("Failed to parse OpenAI JSON:", err);
      return NextResponse.json(
        { error: "Invalid JSON from OpenAI" },
        { status: 500 }
      );
    }

    // 💾 Save new explanations to Supabase
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
