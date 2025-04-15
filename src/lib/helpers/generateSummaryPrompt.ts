import { ScanSummaryInput } from "@/types/apiTypes/scanSummary";

export function generateSummaryPrompt(scanData: ScanSummaryInput): string {
  return `
You are an NFT security analyst.

You will receive raw analysis metrics about an NFT collection. Based on these, generate a summary that helps potential investors understand the collection's current state and risks.

✅ Your response must:
- Be 2–4 informative sentences
- Clearly describe the collection’s health, trustworthiness, and engagement level
- Point out any red flags or strengths, even subtle ones
- End with a recommendation or insight (e.g., "promising long-term", "highly volatile", "lack of trust")

🚫 Do NOT:
- Use numbers, percentages, or exact values
- Mention metric names (like 'rugPullRiskLevel' or 'safetyScore')
- Include markdown or text outside the JSON

Return a single valid JSON:
{ "summary": "..." }

Collection scan:
${JSON.stringify(scanData, null, 2)}
`.trim();
}
