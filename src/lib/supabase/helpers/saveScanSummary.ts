import { fetchScanSummary } from "@/lib/openai/fetchAIExplanation";
import { ScanSummaryInput } from "@/types/apiTypes/scanSummary";
import { upsertAnalysis } from "@/lib/supabase/helpers/upsertAnalysis";

export async function saveScanSummary(
  contractAddress: string,
  aiInputData: ScanSummaryInput
) {
  const summary = await fetchScanSummary(aiInputData);

  if (!summary) {
    console.warn("[saveScanSummary] Skipped saving: AI returned null.");
    return;
  }

  await upsertAnalysis(contractAddress, { summary });
}
