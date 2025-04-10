import { supabase } from "@/lib/supabase/supabase";
import { fetchScanSummary } from "@/lib/openai/fetchExplanation";
import { ScanSummaryInput } from "@/types/apiTypes/scanSummary";

export async function saveScanSummary(
  contractAddress: string,
  aiInputData: ScanSummaryInput
) {
  const { data: existingSummary } = await supabase
    .from("nft_scan_summary")
    .select("last_generated_at")
    .eq("contract_address", contractAddress)
    .single();

  const { data: latestUpdate } = await supabase.rpc("get_latest_update_time", {
    contract_addr: contractAddress,
  });

  const needsRegeneration =
    !existingSummary ||
    (latestUpdate &&
      existingSummary.last_generated_at &&
      new Date(latestUpdate) > new Date(existingSummary.last_generated_at));

  if (needsRegeneration) {
    const aiSummary = await fetchScanSummary(aiInputData);

    if (!aiSummary) {
      console.warn("[saveScanSummary] Skipped saving: AI returned null.");
      return;
    }

    const { error } = await supabase.from("nft_scan_summary").upsert({
      contract_address: contractAddress,
      summary: aiSummary,
      last_generated_at: new Date().toISOString(),
    });

    if (error) console.error("[saveScanSummary] Supabase insert error:", error);
  }
}
