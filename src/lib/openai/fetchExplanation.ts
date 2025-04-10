import { SectionMetric } from "@/types/apiTypes/sectionExplanation";
import { ScanSummaryInput } from "@/types/apiTypes/scanSummary";

// 🧠 GPT: Section explanations
export async function fetchSectionExplanation(
  cards: {
    title: string;
    details: SectionMetric[];
  }[],
  contractAddress: string
): Promise<{ [key: string]: string } | null> {
  try {
    const res = await fetch("/api/generate-section-explanation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cards: cards.map((card) => ({
          title: card.title,
          details: card.details.map((d) => ({
            label: d.label?.toString() ?? "",
            value: d.value?.toString() ?? "",
          })),
        })),
        contractAddress,
      }),
    });

    if (!res.ok) throw new Error("Failed to fetch section explanations");
    const data = await res.json();
    return data.explanations as { [key: string]: string };
  } catch (err) {
    console.error("[fetchSectionExplanation]", err);
    return null;
  }
}

// 🧠 GPT: Full scan summary explanation
export async function fetchScanSummary(
  scanData: ScanSummaryInput
): Promise<string | null> {
  try {
    const res = await fetch("/api/generate-scan-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scanData }),
    });

    if (!res.ok) throw new Error("Failed to fetch scan summary");
    const data = await res.json();
    return data.summary ?? null;
  } catch (err) {
    console.error("[fetchScanSummary]", err);
    return null;
  }
}
