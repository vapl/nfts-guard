// /app/api/generate-tweet/route.ts
import { NextResponse } from "next/server";
import openai from "@/lib/openai/openaiClient";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    volumeEth,
    holdersCount,
    listedPercent,
    collectionName,
    safetyScore,
    washTrading,
    whaleRisk,
    rugPullRisk,
  } = body;

  const prompt = `
    Generate a short, snappy tweet summarizing an NFT collection scan result using Web3 slang and engaging tone (under 280 characters).
    Make it feel native to NFT Twitter.
    
    Collection Name: ${collectionName}
    Safety Score: ${safetyScore}
    Wash Trading: ${washTrading}%
    Whale Risk: ${whaleRisk}
    Rug Pull Risk: ${rugPullRisk}
    Volume: ${volumeEth} ETH
    Holders: ${holdersCount}
    Listed: ${listedPercent}%
    
    Instructions:
    - Classify the collection’s current **status** (choose one): “Still alive 🔥”, “Dead 💀”, “Ghost town 👻”, or “Sketchy ⚠️”.
    - Add a short summary of the risk (e.g. “No wash trades ✅ but whales lurking 🐋”).
    - Use NFT/Web3-native slang like "ape in", "floor", "ruggable", "WAGMI", "rekt", etc.
    - Add emojis 🔥⚠️✅💀👻 where appropriate.
    - End with a call to action like “Scan before you ape. Try @NFTsGuard 🔍”
    - Include 2–3 relevant hashtags: #NFTs #Web3 #RugPull #DYOR #NFTCommunity
    `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
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
