import { supabase } from "@/lib/supabase";
import { NFTCollectionOwnerProps } from "@/types/apiTypes/globalApiTypes";

export async function saveOwnersToSupabase(owners: NFTCollectionOwnerProps[]) {
  try {
    console.log("🔄 Saving NFT owners to Supabase...");

    const { error } = await supabase.from("nft_owners").upsert(owners, {
      onConflict: "wallet, contract_address",
      ignoreDuplicates: true,
    });

    if (error) {
      console.error("❌ Error saving NFT owners to Supabase:", error);
    } else {
      console.log("✅ NFT owners successfully saved to Supabase!");
    }
  } catch (error) {
    console.error("❌ Critical error saving NFT owners to Supabase:", error);
  }
}
