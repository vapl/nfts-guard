import { supabase } from "@/lib/supabase/supabase";
import { NFTTransactionProps } from "@/types/apiTypes/globalApiTypes";

export async function saveSalesToSupabase(sales: NFTTransactionProps[]) {
  try {
    const { error } = await supabase.from("nft_sales").upsert(sales, {
      onConflict: "tx_hash",
      ignoreDuplicates: true,
    });

    if (error) {
      console.error("❌ Error saving sales transactions to Supabase:", error);
    } else {
    }
  } catch (error) {
    console.error(
      "❌ Critical error saving sales transactions to Supabase:",
      error
    );
  }
}
