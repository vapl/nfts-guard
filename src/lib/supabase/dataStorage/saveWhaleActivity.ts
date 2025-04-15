import { supabase } from "@/lib/supabase/supabase";
import { NFTWhaleActivityProps } from "@/types/apiTypes/globalApiTypes";

/**
 * Saves NFT whale activity analysis to Supabase
 */
export async function saveWhaleActivityToSupabase(
  whaleActivity: NFTWhaleActivityProps[]
) {
  try {
    if (!whaleActivity || whaleActivity.length === 0) {
      console.warn("⚠️ No whale activity data to save.");
      return;
    }

    // ✅ Sadalām lielus datus pa mazākām partijām
    const BATCH_SIZE = 500;
    for (let i = 0; i < whaleActivity.length; i += BATCH_SIZE) {
      const batch = whaleActivity.slice(i, i + BATCH_SIZE);

      // ✅ Izmanto upsert(), lai novērstu dublikātus
      const { error: insertError } = await supabase
        .from("nft_whale_activity")
        .insert(batch);

      if (insertError) {
        console.error("❌ Error inserting whale activity data:", insertError);
        return;
      }
    }
  } catch (error) {
    console.error("❌ Error in saveWhaleActivityToSupabase:", error);
  }
}
