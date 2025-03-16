import { supabase } from "@/lib/supabase";
import { NFTTransactionProps } from "@/types/apiTypes/globalApiTypes";

export async function saveSalesToSupabase(sales: NFTTransactionProps[]) {
  try {
    console.log("🔄 Saving sales transactions to Supabase...");

    const { error } = await supabase.from("nft_sales").upsert(sales, {
      onConflict: "tx_hash",
      ignoreDuplicates: true,
    });

    if (error) {
      console.error("❌ Error saving sales transactions to Supabase:", error);
    } else {
      console.log("✅ Sales transactions successfully saved to Supabase!");
    }
  } catch (error) {
    console.error(
      "❌ Critical error saving sales transactions to Supabase:",
      error
    );
  }
}
