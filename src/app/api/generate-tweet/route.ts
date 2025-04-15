// /app/api/generate-tweet/route.ts
import { NextResponse } from "next/server";
import openai from "@/lib/openai/openaiClient";
import { generateTweetPrompt } from "@/lib/helpers/generateTweetPrompt";

export async function POST(req: Request) {
  const body = await req.json();

  const prompt = generateTweetPrompt(body);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const tweet = completion.choices[0].message?.content;
    return NextResponse.json({ tweet });
  } catch (err) {
    console.error("[TWEET_AI_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to generate tweet" },
      { status: 500 }
    );
  }
}
