import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getOrCacheNFTCollection(
  contractAddress: string,
  fetchFromAPI: () => Promise<any>
) {
  // Check if data already cached
  const { data, error } = await supabase
    .from("nft_collections")
    .select("*")
    .eq("contract_address", contractAddress)
    .maybeSingle();

  if (data && !error) {
    console.log("✅ Returning cached collection data");
    return data;
  }

  // If data not found in DB, get from API and save into DB
  const collectionData = await fetchFromAPI();

  if (collectionData) {
    await supabase.from("nft_collections").insert([
      {
        contrast_address: contractAddress,
        name: collectionData.name,
        total_supply: collectionData.totalSupply,
      },
    ]);
  }

  return collectionData;
}

// Cache metadata
export async function getOrCacheNFTMetadata(
  contractAddress: string,
  tokenId: string,
  fetchFromAPI: () => Promise<any>
) {
  const { data, error } = await supabase
    .from("nft_tokens")
    .select("*")
    .eq("contract_address", contractAddress)
    .eq("token_id", tokenId)
    .maybeSingle();

  if (data && !error) {
    console.log("✅ Returning cached NFT metadata");
    return data;
  }

  const metadata = await fetchFromAPI();

  if (metadata) {
    await supabase.from("nft_tokens").insert([
      {
        contract_address: contractAddress,
        token_id: tokenId,
        owner: metadata.owner,
        standard: metadata.standard,
        metadata: metadata.metadata,
      },
    ]);
  }

  return metadata;
}

// History price cache
export async function getOrCacheNFTPriceHistory(
  contractAddress: string,
  tokenId?: string,
  fetchFromAPI?: () => Promise<any>
) {
  const query = supabase
    .from("nft_trade_history")
    .select("*")
    .eq("contract_address", contractAddress);

  if (tokenId) {
    query.eq("token_id", tokenId);
  }

  const { data, error } = await query;

  if (data && data.length > 0 && !error) {
    console.log("✅ Returning cached trade history");
    return data;
  }

  if (!fetchFromAPI) {
    throw new Error("fetchFromAPI function is required");
  }
  const tradeHistory = await fetchFromAPI();

  if (tradeHistory.length > 0) {
    const formattedData = tradeHistory.map(
      (trade: {
        token_id: any;
        from: any;
        to: any;
        trade_price: any;
        event_type: any;
        timestamp: string | number | Date;
      }) => ({
        contract_address: contractAddress,
        token_id: trade.token_id,
        from_address: trade.from,
        to_address: trade.to,
        trade_price: trade.trade_price,
        event_type: trade.event_type,
        timestamp: new Date(trade.timestamp),
      })
    );

    await supabase.from("nft_trade_history").insert(formattedData);
  }

  return tradeHistory;
}

/**
 * 🟢 Caches or retrieves wash trading analysis for a collection
 */
export async function getOrCacheWashTradingData(
  contractAddress: string,
  fetchFunction: () => Promise<any>
) {
  const { data, error } = await supabase
    .from("wash_trading")
    .select("*")
    .eq("contract_address", contractAddress)
    .single();

  if (data) return data;
  if (error && error.code !== "PGRST116")
    console.error("❌ Supabase error:", error);

  const freshData = await fetchFunction();
  await supabase
    .from("wash_trading")
    .upsert([{ contract_address: contractAddress, result: freshData }]);
  return freshData;
}
