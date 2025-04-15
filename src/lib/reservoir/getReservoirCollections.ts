import "dotenv/config";
import reservoirClient from "@/lib/reservoir/reservoir";
import { CollectionDataProps } from "@/types/apiTypes/globalApiTypes";
import { saveCollectionToSupabase } from "@/lib/supabase/dataStorage/saveCollections";
import { supabase } from "@/lib/supabase/supabase";
import { analyzeActivityVolatility } from "@/lib/analysis/analyzeActivityVolatility";

async function getSalesCount(contractAddress: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("nft_sales")
      .select("tx_hash", { count: "exact" })
      .eq("contract_address", contractAddress);

    if (error) {
      console.error("❌ Error fetching sales count:", error);
      return 0;
    }

    return data?.length ?? 0;
  } catch (error) {
    console.error("❌ Critical error fetching sales count:", error);
    return 0;
  }
}

/**
 * Fetch NFT collection data from Reservoir API, but only if it's outdated.
 */
export async function getCollectionData(
  contractAddress: string,
  forceRefresh = false
) {
  // ✅ Pārbauda, vai kolekcija jau ir DB un kad tā pēdējo reizi atjaunināta
  const { data: cachedCollection, error } = await supabase
    .from("nft_collections")
    .select("*")
    .eq("contract_address", contractAddress)
    .single();

  if (error) {
    console.error("❌ Error fetching collection from Supabase:", error);
  }

  const nowTimestamp = Math.floor(Date.now() / 1000);
  const refreshThreshold = nowTimestamp - 6 * 60 * 60; // ✅ Piemērs: Atjauno ik pēc 6 stundām

  if (cachedCollection && cachedCollection.last_updated) {
    const lastUpdatedTimestamp = Math.floor(
      new Date(cachedCollection.last_updated).getTime() / 1000
    );

    if (lastUpdatedTimestamp >= refreshThreshold) {
      return cachedCollection;
    }
  }

  if (!forceRefresh && cachedCollection && cachedCollection.last_updated) {
    const lastUpdatedTimestamp = Math.floor(
      new Date(cachedCollection.last_updated).getTime() / 1000
    );

    if (lastUpdatedTimestamp >= refreshThreshold) {
      return cachedCollection;
    }
  }

  const response = await reservoirClient.get(
    `/collections/v7?contract=${contractAddress}`
  );
  const collection = response.data?.collections?.[0];

  if (!collection) {
    console.warn("⚠️ No collection data found.");
    return null;
  }

  // ✅ Aprēķina pārdošanas darījumu skaitu
  const salesCount = await getSalesCount(contractAddress);

  const volatility = analyzeActivityVolatility(
    collection.volume?.["7day"] || 0,
    collection.volume?.["30day"] || 0
  );

  const collectionData: CollectionDataProps = {
    contract_address: contractAddress,
    name: collection.name,
    image_url: collection.image,
    owner_count: collection.ownerCount || 0,
    total_supply: collection.tokenCount || 0,
    on_sale_count: collection.onSaleCount || 0,
    minted_timestamp: new Date(collection.mintedTimestamp * 1000).toISOString(),
    floor_price: collection.floorAsk?.price?.amount?.native || 0,
    floor_price_change_24h: collection.floorSale?.["1day"] || 0,
    floor_price_change_7d: collection.floorSale?.["7day"] || 0,
    floor_price_change_30d: collection.floorSale?.["30day"] || 0,
    volume_1day: collection.volume?.["1day"] || 0,
    volume_7day: collection.volume?.["7day"] || 0,
    volume_30day: collection.volume?.["30day"] || 0,
    volume_all: collection.volume?.["allTime"] || 0,
    volume_change_24h: collection.volumeChange?.["1day"] || 0,
    volume_change_7d: collection.volumeChange?.["7day"] || 0,
    volume_change_30d: collection.volumeChange?.["30day"] || 0,
    sales_count: salesCount,
    top_bid: collection.topBid?.price?.amount?.native || 0,
    floor_sale_1d: collection.floorSale?.["1day"] || 0,
    floor_sale_7d: collection.floorSale?.["7day"] || 0,
    floor_sale_30d: collection.floorSale?.["30day"] || 0,
    last_updated: new Date().toISOString(),
    volatility_index: volatility.volatilityIndex ?? null,
    volatility_risk_level: volatility.riskLevel ?? null,
  };

  await saveCollectionToSupabase(collectionData);
  return collectionData;
}
