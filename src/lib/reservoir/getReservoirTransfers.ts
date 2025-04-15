import reservoirClient from "@/lib/reservoir/reservoir";
import { NFTTransferProps } from "@/types/apiTypes/globalApiTypes";
import { saveTransfersToSupabase } from "@/lib/supabase/dataStorage/saveTransfers";
import { supabase } from "@/lib/supabase/supabase";

/**
 * Interface for API response
 */
interface TransferAPIResponse {
  txHash: string;
  token: { contract: string; tokenId: string };
  from: string;
  to: string;
  amount: number;
  block: number;
  timestamp: number;
  logIndex: number;
}

/**
 * Fetch NFT transfer history with optimized API requests.
 */
export async function getNFTTransfers(
  contractAddress: string,
  timePeriod: 1 | 7 | 30 | 90 | 365
): Promise<NFTTransferProps[]> {
  try {
    const nowTimestamp = Math.floor(Date.now() / 1000);
    const requestedStartTimestamp = nowTimestamp - timePeriod * 24 * 60 * 60;

    // ✅ **Pareizs SQL pieprasījums, lai iegūtu vecāko un jaunāko ierakstu Supabase**
    const { data: minData, error: minError } = await supabase
      .from("nft_transfers")
      .select("timestamp")
      .eq("contract_address", contractAddress)
      .order("timestamp", { ascending: true })
      .limit(1);

    const { data: maxData, error: maxError } = await supabase
      .from("nft_transfers")
      .select("timestamp")
      .eq("contract_address", contractAddress)
      .order("timestamp", { ascending: false })
      .limit(1);

    if (minError || maxError) {
      console.error(
        "❌ Error fetching min/max timestamps from Supabase:",
        minError || maxError
      );
      return [];
    }

    // ✅ **Ja nav datu Supabase, lejupielādē visu periodu**
    if (!minData.length || !maxData.length) {
      await fetchAndSaveTransfers(
        contractAddress,
        requestedStartTimestamp,
        nowTimestamp
      );
      return await getCachedTransfers(
        contractAddress,
        requestedStartTimestamp,
        nowTimestamp
      );
    }

    // ✅ **Konvertējam Supabase laika zīmogus uz sekundēm**
    const dbOldestTimestamp = Math.floor(
      new Date(minData[0]?.timestamp).getTime() / 1000
    );
    const dbNewestTimestamp = Math.floor(
      new Date(maxData[0]?.timestamp).getTime() / 1000
    );

    let fetchStart: number | null = null;
    let fetchEnd: number | null = null;

    // ✅ **Ja vecākais Supabase datums ir jaunāks nekā pieprasītais periods, lejupielādē trūkstošos datus**
    if (dbOldestTimestamp >= requestedStartTimestamp) {
      fetchStart = requestedStartTimestamp;
      fetchEnd = dbOldestTimestamp - 1;

      await fetchAndSaveTransfers(contractAddress, fetchStart, fetchEnd);
    }

    // ✅ **Ja jaunākais Supabase datums ir vecāks par pašreizējo datumu, lejupielādē jaunos datus**
    if (dbNewestTimestamp < nowTimestamp) {
      fetchStart = dbNewestTimestamp + 1;
      fetchEnd = nowTimestamp;

      await fetchAndSaveTransfers(contractAddress, fetchStart, fetchEnd);
    }

    if (
      dbOldestTimestamp <= requestedStartTimestamp &&
      dbNewestTimestamp >= nowTimestamp
    ) {
      return await getCachedTransfers(
        contractAddress,
        requestedStartTimestamp,
        nowTimestamp
      );
    }

    return await getCachedTransfers(
      contractAddress,
      requestedStartTimestamp,
      nowTimestamp
    );
  } catch (error) {
    console.error("❌ Error fetching NFT transfers:", error);
    return [];
  }
}

/**
 * Fetch missing transfers from API and save to Supabase
 */
async function fetchAndSaveTransfers(
  contractAddress: string,
  startTimestamp: number,
  endTimestamp: number
) {
  let continuationToken: string | null = null;
  let iterationCount = 0;
  const MAX_ITERATIONS = 50;
  const allNewTransfers: NFTTransferProps[] = [];

  do {
    if (iterationCount++ >= MAX_ITERATIONS) {
      console.error("🚨 Max iterations reached, stopping API calls!");
      break;
    }

    let url = `/transfers/bulk/v2?contract=${contractAddress}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}&limit=1000`;
    if (continuationToken) {
      url += `&continuation=${continuationToken}`;
    }

    try {
      const response = await reservoirClient.get(url);
      const transfers: TransferAPIResponse[] = response.data.transfers || [];
      continuationToken = response.data.continuation ?? null;

      if (!transfers.length) {
        console.warn("⚠️ No more transfers found.");
        break;
      }

      const newTransfers = transfers.map((transfer) => ({
        tx_hash: transfer.txHash,
        contract_address: contractAddress,
        token_id: transfer.token.tokenId,
        from_wallet: transfer.from,
        to_wallet: transfer.to,
        amount: transfer.amount,
        log_index: transfer.logIndex,
        timestamp: transfer.timestamp
          ? new Date(transfer.timestamp * 1000).toISOString()
          : new Date(0).toISOString(),
        block_num: transfer.block,
      }));

      // Filter out transfers that already exist in the database
      const existingTransfers = await getCachedTransfers(
        contractAddress,
        startTimestamp,
        endTimestamp
      );

      const existingTransferHashes = new Set(
        existingTransfers.map((transfer) => transfer.tx_hash)
      );

      const uniqueNewTransfers = newTransfers.filter(
        (transfer) => !existingTransferHashes.has(transfer.tx_hash)
      );

      allNewTransfers.push(...uniqueNewTransfers);

      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("❌ Error fetching transfers from API:", error);
      break;
    }
  } while (continuationToken);

  if (!allNewTransfers.length) {
    console.warn("⚠️ API did not return any transfers!");
  }
  if (allNewTransfers.length > 0) {
    await saveTransfersToSupabase(allNewTransfers);
  } else {
  }
}

/**
 * Fetch cached transfers from Supabase after all updates.
 */
async function getCachedTransfers(
  contractAddress: string,
  startTimestamp: number,
  endTimestamp: number
): Promise<NFTTransferProps[]> {
  try {
    let allTransfers: NFTTransferProps[] = [];
    let offset = 0;
    const limit = 1000; // 📌 Maksimālais Supabase pieprasījumu ierobežojums

    while (true) {
      const { data, error } = await supabase
        .from("nft_transfers")
        .select("*")
        .eq("contract_address", contractAddress)
        .gte("timestamp", new Date(startTimestamp * 1000).toISOString())
        .lte("timestamp", new Date(endTimestamp * 1000).toISOString())
        .order("timestamp", { ascending: true })
        .range(offset, offset + limit - 1); // 📌 Lapojam datus pa 1000 ierakstiem

      if (error) {
        console.error(
          "❌ Error fetching cached transfers from Supabase:",
          error
        );
        return [];
      }

      if (!data || data.length === 0) {
        break; // 📌 Beidzam, ja vairs nav datu
      }

      allTransfers = [...allTransfers, ...data];
      offset += limit;

      // 📌 Ja mazāk nekā 1000, tas nozīmē, ka visi dati ir ielādēti.
      if (data.length < limit) {
        break;
      }
    }

    return allTransfers;
  } catch (error) {
    console.error("❌ Error getting cached transfers:", error);
    return [];
  }
}
