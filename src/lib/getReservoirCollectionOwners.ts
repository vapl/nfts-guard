import "dotenv/config";
import reservoirClient from "@/lib/reservoir";
import { supabase } from "@/lib/supabase";
import { NFTCollectionOwnerProps } from "@/types/apiTypes/globalApiTypes";
import { saveOwnersToSupabase } from "@/lib/dataStorage/saveOwners";

const WHALE_THRESHOLD = 1;
const PAGE_SIZE = 500;
const MAX_RETRIES = 3;
const RETRY_DELAY = 3000; // 3 seconds
const MAX_ITERATIONS = 20; // ✅ Limit API requests

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

    // ✅ Check if latest data is recent enough
    const { data: latestEntry, error: latestError } = await supabase
      .from("nft_owners")
      .select("last_updated")
      .eq("contract_address", contractAddress)
      .gte("token_count", WHALE_THRESHOLD)
      .order("last_updated", { ascending: false })
      .limit(1);

    if (latestError) {
      console.error(
        "❌ Error checking latest update timestamp:",
        latestError.message || latestError
      );
      return await fetchAndSaveWhaleOwners(contractAddress);
    }

    const latestStoredTimestamp = latestEntry?.[0]?.last_updated
      ? new Date(latestEntry[0].last_updated).getTime() / 1000
      : 0;

    if (latestStoredTimestamp < requestedStartTimestamp) {
      console.log(
        `🔄 Fetching missing whale ownership data from API due to outdated DB records...`
      );
      return await fetchAndSaveWhaleOwners(contractAddress);
    } else {
      console.log(
        `✅ DB already contains sufficient and up-to-date whale ownership data.`
      );
      return await fetchExistingWhaleOwners(
        contractAddress,
        requestedStartTimestamp
      );
    }

    console.log(`🔄 Fetching missing whale ownership data from API...`);
    return await fetchAndSaveWhaleOwners(contractAddress);
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error fetching NFT ownership data:", error.message);
    } else {
      console.error("❌ Error fetching NFT ownership data:", error);
    }
    return [];
  }
}

/**
 * Fetch and return existing whale owners from Supabase.
 */
async function fetchExistingWhaleOwners(
  contractAddress: string,
  requestedStartTimestamp: number
) {
  let allWhaleOwners: NFTCollectionOwnerProps[] = [];
  let offset = 0;

  while (true) {
    const { data: existingWhaleOwners, error } = await supabase
      .from("nft_owners")
      .select("*")
      .eq("contract_address", contractAddress)
      .gte(
        "last_updated",
        new Date(requestedStartTimestamp * 1000).toISOString()
      )
      .gte("token_count", WHALE_THRESHOLD)
      .order("last_updated", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error(
        "❌ Error fetching whale owners from Supabase:",
        error.message || error
      );
      return [];
    }

    if (!existingWhaleOwners || existingWhaleOwners.length === 0) {
      break;
    }

    allWhaleOwners = [...allWhaleOwners, ...existingWhaleOwners];
    offset += PAGE_SIZE;
  }

  return allWhaleOwners;
}

/**
 * Fetch only whale owners (holding 1+ NFTs) from API and save to Supabase.
 */
async function fetchAndSaveWhaleOwners(
  contractAddress: string
): Promise<NFTCollectionOwnerProps[]> {
  let allWhaleOwners: NFTCollectionOwnerProps[] = [];
  let offset = 0;
  let iterations = 0;
  let retries = 0;

  while (iterations < MAX_ITERATIONS) {
    try {
      console.log(
        `📡 Fetching whale owners from API for: ${contractAddress} (Offset: ${offset})`
      );
      const response = await reservoirClient.get(
        `/owners/v2?contract=${contractAddress}&limit=${PAGE_SIZE}&offset=${offset}`
      );
      const owners: NFTCollectionOwnerProps[] = response.data.owners.map(
        (owner: {
          address: string;
          ownership: { tokenCount: string; onSaleCount: string };
        }) => ({
          wallet: owner.address,
          contract_address: contractAddress,
          token_count: parseInt(owner.ownership.tokenCount) || 0,
          ownership_percentage:
            (parseInt(owner.ownership.tokenCount) / 10000) * 100 || 0,
          on_sale_count: parseInt(owner.ownership.onSaleCount) || 0,
          is_whale: parseInt(owner.ownership.tokenCount) >= 50 || false,
          last_updated: new Date().toISOString(),
        })
      );

      if (owners.length > 0) {
        await saveOwnersToSupabase(owners);
        console.log(
          `✅ Successfully saved ${owners.length} whale owners to DB.`
        );
      }

      allWhaleOwners = [...allWhaleOwners, ...owners];
      offset += PAGE_SIZE;
      iterations++;
      retries = 0; // Reset retries after a successful request

      if (owners.length < PAGE_SIZE) {
        break;
      }

      // ✅ Pauze starp API pieprasījumiem, lai izvairītos no `429 Too Many Requests`
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    } catch (error) {
      if (
        error instanceof Error &&
        (error as { response?: { status?: number } }).response?.status ===
          429 &&
        retries < MAX_RETRIES
      ) {
        console.warn(
          `⚠️ Rate limited (429). Retrying in ${RETRY_DELAY / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        retries++;
      } else {
        if (error instanceof Error) {
          console.error("❌ Error fetching NFT ownership data:", error.message);
        } else {
          console.error("❌ Error fetching NFT ownership data:", error);
        }
        break;
      }
    }
  }

  return allWhaleOwners;
}
