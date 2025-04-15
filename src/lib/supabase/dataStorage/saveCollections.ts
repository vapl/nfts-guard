import { CollectionDataProps } from "@/types/apiTypes/globalApiTypes";
import { supabase } from "@/lib/supabase/supabase";

function isCollectionDataDifferent(a, b) {
  const keysToCompare = [
    "floor_price",
    "floor_price_change_24h",
    "floor_price_change_7d",
    "volume_1day",
    "volume_7day",
    "volume_30day",
    "volatility_index",
    "volatility_risk_level",
    "sales_count",
  ];

  return keysToCompare.some((key) => {
    const valA = a?.[key];
    const valB = b?.[key];

    if (typeof valA === "number" && typeof valB === "number") {
      return Math.abs(valA - valB) > 0.01; // float tolerance
    }

    return valA !== valB;
  });
}

export async function saveCollectionToSupabase(
  collectionData: CollectionDataProps
) {
  try {
    const { data: existing, error } = await supabase
      .from("nft_collections")
      .select("*")
      .eq("contract_address", collectionData.contract_address)
      .maybeSingle();

    if (error) {
      console.error("❌ Failed to fetch existing collection:", error);
    }

    // ✅ If existing exists and is fresh AND not changed → skip
    if (existing && existing.last_updated) {
      const lastUpdated = new Date(existing.last_updated);
      const hoursSinceUpdate = (Date.now() - lastUpdated.getTime()) / 36e5;
      const isFresh = hoursSinceUpdate < 6;
      const isDifferent = isCollectionDataDifferent(existing, collectionData);

      if (isFresh && !isDifferent) {
        return;
      }
    }

    const { error: upsertError } = await supabase
      .from("nft_collections")
      .upsert([collectionData], { onConflict: "contract_address" });

    if (upsertError) {
      console.error("❌ Failed to save collection:", upsertError);
    } else {
    }
  } catch (err) {
    console.error("🔥 Unexpected error in saveCollectionToSupabase:", err);
  }
}
