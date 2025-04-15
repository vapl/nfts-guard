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

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ Section explanation failed:", errText);
      return null;
    }

    const data = await res.json();

    return data.explanations as { [key: string]: string };
  } catch (err) {
    console.error("[fetchSectionExplanation] error:", err);
    return null;
  }
}

// 🧠 GPT: Full scan summary explanation
export async function fetchScanSummary(
  scanData: ScanSummaryInput
): Promise<string | null> {
  try {
    const contractAddress = scanData.contractAddress;

    // 1. Try cached summary
    const resCache = await fetch(
      `/api/get-analysis?contractAddress=${contractAddress}`
    );

    if (
      resCache.ok &&
      resCache.headers.get("content-type")?.includes("application/json")
    ) {
      const cached = await resCache.json();

      if (!cached?.error && cached.summary && !cached.requiresRefresh) {
        let result = cached.summary;

        // 🔍 Try to parse if looks like JSON object
        if (typeof result === "string" && result.trim().startsWith("{")) {
          try {
            const parsed = JSON.parse(result);
            if (parsed?.summary && typeof parsed.summary === "string") {
              result = parsed.summary;
            }
          } catch {
            // Ignore parse error
          }
        }

        return result;
      }
    }

    // 2. If not cached or invalid – generate summary
    const res = await fetch("/api/generate-scan-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scanData }),
    });

    if (
      !res.ok ||
      !res.headers.get("content-type")?.includes("application/json")
    ) {
      console.error("❌ Unexpected response from /api/generate-scan-summary");
      return null;
    }

    const data = await res.json();
    let result = data.summary ?? null;

    if (typeof result === "string" && result.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(result);
        if (parsed?.summary && typeof parsed.summary === "string") {
          result = parsed.summary;
        }
      } catch {
        // Leave as-is
      }
    }

    return result;
  } catch (err) {
    console.error("[fetchScanSummary] error:", err);
    return null;
  }
}
