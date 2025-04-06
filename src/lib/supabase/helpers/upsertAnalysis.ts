// lib/supabase/upsertAnalysis.ts
import { supabase } from "@/lib/supabase/supabase";

export async function upsertAnalysis(
  contractAddress: string,
  updates: {
    summary?: string;
    explanations?: { [key: string]: string };
  }
) {
  // Nolasa jau eksistējošo ierakstu
  const { data: existing } = await supabase
    .from("nft_ai_analysis_results")
    .select("*")
    .eq("contract_address", contractAddress)
    .single();

  // Apvieno datus
  const payload = {
    contract_address: contractAddress,
    summary: updates.summary ?? existing?.summary ?? null,
    explanations: updates.explanations ?? existing?.explanations ?? null,
    updated_at: new Date().toISOString(),
  };

  // Ieraksta atjauninātos datus
  const { error } = await supabase
    .from("nft_ai_analysis_results")
    .upsert(payload);

  if (error) {
    console.error("[UPSERT_ERROR]", error);
  }
}
