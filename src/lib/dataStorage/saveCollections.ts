import { supabase } from "@/lib/supabase";
import { CollectionDataProps } from "@/types/apiTypes/globalApiTypes";

export async function saveCollectionToSupabase(
  collectionData: CollectionDataProps
) {
  try {
    console.log("🔄 Saving collection data to Supabase...");

    const { error } = await supabase
      .from("nft_collections")
      .upsert([collectionData], { onConflict: "contract_address" });

    if (error) {
      console.error("❌ Error saving collection to Supabase:", error);
    } else {
      console.log("✅ Collection successfully saved to Supabase!");
    }
  } catch (error) {
    console.error("❌ Critical error saving collection to Supabase:", error);
  }
}
