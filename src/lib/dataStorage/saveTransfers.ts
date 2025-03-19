import { supabase } from "@/lib/supabase";
import { NFTTransferProps } from "@/types/apiTypes/globalApiTypes";

export async function saveTransfersToSupabase(transfers: NFTTransferProps[]) {
  try {
    console.log("🔄 Saving transfers transactions to Supabase...");

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
      console.log("✅ transfers transactions successfully saved to Supabase!");
    }
  } catch (error) {
    console.error("❌ Error in saveTransfersToSupabase:", error);
  }
}
