import { supabase } from "@/lib/supabase/supabase";

export async function saveSectionExplanations(
  contractAddress: string,
  explanations: Record<string, string>
) {
  const { error } = await supabase.from("nft_section_explanations").upsert({
    contract_address: contractAddress,
    explanations,
  });

  if (error) console.error("[saveSectionExplanations]", error);
}
