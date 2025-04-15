import { ScanCardData } from "@/app/api/generate-section-explanation/route";

export function generateExplanationPrompt(
  cards: ScanCardData[],
  collectionName: string
): string {
  const formattedCards = cards.map((c) => ({
    title: c.title,
    metrics: (c.details ?? []).map(
      (d) =>
        `${d.label}: ${
          typeof d.value === "number" ? d.value.toFixed(2) : d.value
        }`
    ),
  }));

  return `
You are an expert assistant for analyzing NFT investment risks.

You are reviewing multiple analysis cards from the collection "${collectionName}".
Your job is to explain each card below using the actual data provided in details. For each card, explain:

1. What this metric measures and why it's important.
2. What the current values may suggest (based on provided data).
3. What the investor should take away from this – is it a good sign, a risk, or something to monitor?

Your task is to provide a **personalized explanation** for each card that helps the investor understand what the current values suggest about the **state of the collection** and its **investment potential**.

You may refer to the numbers in details. Do NOT make up values. Use a clear, professional tone with plain language.


✅ Only output a single **valid JSON** object:
{
  "Card Title": "Explanation",
  ...
}

🚫 Do not include:
- Markdown
- Extra text outside the JSON
- Any specific numbers or values
- The collection name inside explanations

Here are the cards:
${JSON.stringify(formattedCards, null, 2)}
`.trim();
}
