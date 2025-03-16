import "dotenv/config";
import reservoirClient from "@/lib/reservoir";
import { saveOwnersToSupabase } from "@/lib/dataStorage/saveOwners";
import { supabase } from "@/lib/supabase";
import { NFTCollectionOwnerProps } from "@/types/apiTypes/globalApiTypes";

/**
 * Interface for Collection Owners API response
 */
interface OwnerAPIResponse {
  address: string;
  ownership: {
    tokenCount: string;
    onSaleCount: string;
  };
}

const WHALE_THRESHOLD = 10; // ✅ Tikai lietotāji ar 10+ NFT tiks saglabāti

/**
 * Fetch NFT collection ownership data with optimized logic.
 */
export async function getNFTCollectionOwners(
  contractAddress: string,
  timePeriod: 1 | 7 | 30 | 90 | 365
): Promise<NFTCollectionOwnerProps[]> {
  try {
    console.log(`🔎 Checking cached ownership data in DB: ${contractAddress}`);

    const nowTimestamp = Math.floor(Date.now() / 1000);
    const requestedStartTimestamp = nowTimestamp - timePeriod * 24 * 60 * 60;

    // ✅ Pārbauda, vai whale īpašnieki jau ir saglabāti un ir aktuāli
    const { data: existingWhaleOwners, error } = await supabase
      .from("nft_owners")
      .select("*")
      .eq("contract_address", contractAddress)
      .gte(
        "last_updated",
        new Date(requestedStartTimestamp * 1000).toISOString()
      )
      .gte("token_count", WHALE_THRESHOLD) // ✅ Tikai whale īpašnieki
      .order("last_updated", { ascending: false });

    if (error) {
      console.error("❌ Error fetching whale owners from Supabase:", error);
      return [];
    }

    if (existingWhaleOwners.length > 0) {
      console.log(`✅ DB already contains up-to-date whale ownership data.`);
      return existingWhaleOwners;
    }

    console.log(`🔄 Fetching fresh whale ownership data from API...`);
    return await fetchAndSaveWhaleOwners(contractAddress);
  } catch (error) {
    console.error("❌ Error fetching NFT ownership data:", error);
    return [];
  }
}

/**
 * Fetch only whale owners (holding 10+ NFTs) from API and save to Supabase.
 */
async function fetchAndSaveWhaleOwners(
  contractAddress: string
): Promise<NFTCollectionOwnerProps[]> {
  const whaleOwners: NFTCollectionOwnerProps[] = [];
  let continuationToken: string | null = null;
  let iterationCount = 0;
  const MAX_ITERATIONS = 20; // ✅ Ierobežo API pieprasījumu skaitu

  do {
    let url = `/owners/v2?contract=${contractAddress}&limit=500`;
    if (continuationToken) url += `&continuation=${continuationToken}`;

    console.log(`📡 Fetching whale owners: ${url}`);
    const response = await reservoirClient.get(url);
    const owners: OwnerAPIResponse[] = response.data.owners || [];
    continuationToken = response.data.continuation ?? null;

    if (!owners.length) {
      console.warn("⚠️ No more ownership data found.");
      break;
    }

    // ✅ Filtrē tikai whale īpašniekus (kas tur 10+ NFT)
    const filteredWhaleOwners = owners
      .filter(
        (owner) => parseInt(owner.ownership.tokenCount) >= WHALE_THRESHOLD
      )
      .map((owner) => ({
        wallet: owner.address,
        contract_address: contractAddress,
        token_count: parseInt(owner.ownership.tokenCount) || 0,
        ownership_percentage:
          (parseInt(owner.ownership.tokenCount) / 10000) * 100 || 0,
        on_sale_count: parseInt(owner.ownership.onSaleCount) || 0,
        is_whale: true,
        last_updated: new Date().toISOString(),
      }));

    whaleOwners.push(...filteredWhaleOwners);
    console.log(
      `✅ Found ${filteredWhaleOwners.length} whale owners (Total: ${whaleOwners.length})`
    );

    iterationCount++;

    // ✅ Pauze, lai izvairītos no API limitu pārsniegšanas
    await new Promise((resolve) => setTimeout(resolve, 2000));
  } while (continuationToken && iterationCount < MAX_ITERATIONS);

  if (whaleOwners.length > 0) {
    console.log(`✅ Saving ${whaleOwners.length} whale owners to Supabase.`);
    await saveOwnersToSupabase(whaleOwners);
  }

  return whaleOwners;
}
