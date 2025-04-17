// /app/api/generate-tweet/route.ts
import { NextResponse } from "next/server";
import openai from "@/lib/openai/openaiClient";
import { generateTweetPrompt } from "@/lib/helpers/generateTweetPrompt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || !body.collectionName) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const prompt = generateTweetPrompt(body);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // ✅ izmanto pilno jauno modeli, ja pieejams
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9, // 🔥 Padara tvītus dažādākus un kreatīvākus
      max_tokens: 200,
    });

    const tweet = completion.choices?.[0]?.message?.content?.trim();

    if (!tweet) {
      return NextResponse.json(
        { error: "No tweet generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ tweet });
  } catch (err) {
    console.error("[TWEET_AI_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to generate tweet" },
      { status: 500 }
    );
  }
}
