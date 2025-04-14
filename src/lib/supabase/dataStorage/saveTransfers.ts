import { supabase } from "@/lib/supabase/supabase";
import { NFTTransferProps } from "@/types/apiTypes/globalApiTypes";

export async function saveTransfersToSupabase(transfers: NFTTransferProps[]) {
  try {
    const { error } = await supabase.from("nft_transfers").upsert(transfers, {
      onConflict: "tx_hash",
      ignoreDuplicates: true,
    });

    if (error) {
      console.error(
        "❌ Error saving transfers transactions to Supabase:",
        error
      );
    } else {
    }
  } catch (error) {
    console.error("❌ Error in saveTransfersToSupabase:", error);
  }
}
