import { SectionMetric } from "@/types/apiTypes/sectionExplanation";
import { ScanSummaryInput } from "@/types/apiTypes/scanSummary";

// Section explanations
export async function fetchSectionExplanation(
  cards: {
    title: string;
    details: SectionMetric[];
  }[],
  contractAddress: string
) {
  const res = await fetch("/api/generate-section-explanation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cards: cards.map((card) => ({
        title: card.title,
        details: card.details.map((d) => ({
          label: String(d.label),
          value: String(d.value),
        })),
      })),
      contractAddress,
    }),
  });

  const data = await res.json();
  return data.explanations as { [key: string]: string };
}

// Scan summary
export async function fetchScanSummary(scanData: ScanSummaryInput) {
  const res = await fetch("/api/generate-scan-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scanData }),
  });

  const data = await res.json();
  return data.summary;
}
