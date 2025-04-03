import { NextResponse } from "next/server";
import openai from "@/lib/openai/openaiClient";

export async function POST(req: Request) {
  const { riskFactors } = await req.json();

  const prompt = `
        NFT collection Risk Factors:
        ${JSON.stringify(riskFactors, null, 2)}

        Write a clear and simple explanation in 2-3 sentences for NFT infestors
    `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0].message?.content;
    return NextResponse.json({ explanation: result });
  } catch (error) {
    console.error("[OPENAI_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
