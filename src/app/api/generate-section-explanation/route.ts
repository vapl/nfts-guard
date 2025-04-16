export const config = {
  runtime: "nodejs", // ← tas šeit risina 504 timeout problēmu
};

import { NextResponse } from "next/server";
import openai from "@/lib/openai/openaiClient";
import { generateExplanationPrompt } from "@/lib/helpers/generateExplanationPrompt";

export interface ScanCardData {
  title: string;
  value?: string | number;
  variant?: "safe" | "warning" | "danger" | "neutral";
  tooltipInfo?: string;
  metrics?: Record<string, string | number>;
  details?: {
    label: string;
    value: string | number;
  }[];
}

interface RequestBody {
  contractAddress: string;
  cards: ScanCardData[];
  collectionName?: string;
}

export async function POST(req: Request) {
  const { cards, collectionName = "NFT collection" }: RequestBody =
    await req.json();

  if (!Array.isArray(cards) || cards.length === 0) {
    return NextResponse.json(
      { error: "Missing or invalid cards array" },
      { status: 400 }
    );
  }

  try {
    // 🧠 Izveido prompt
    const prompt = generateExplanationPrompt(cards, collectionName);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
    const match = raw.trim().match(/{[^]*?}/);

    if (!match) {
      return NextResponse.json(
        { error: "OpenAI response missing valid JSON" },
        { status: 500 }
      );
    }

    const jsonString = match[0];
    const explanations = JSON.parse(jsonString);

    return NextResponse.json({ explanations });
  } catch (err) {
    console.error("OpenAI Explanation Error:", err);
    return NextResponse.json(
      { error: "Failed to generate explanations" },
      { status: 500 }
    );
  }
}
