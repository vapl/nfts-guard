import "dotenv/config";
import reservoirClient from "@/lib/reservoir/reservoir";
import { NFTTransactionProps } from "@/types/apiTypes/globalApiTypes";
import { saveSalesToSupabase } from "@/lib/supabase/dataStorage/saveSales";
import { supabase } from "@/lib/supabase/supabase";
import { SaleAPIResponse } from "@/types/apiTypes/globalApiTypes";

/**
 * Fetch NFT sales history with Supabase caching.
 */
export async function getNFTSales(
  contractAddress: string,
  timePeriod: number
): Promise<NFTTransactionProps[]> {
  try {
    console.log(`🔎 Checking for cached sales in DB: ${contractAddress}`);

    const nowTimestamp = Math.floor(Date.now() / 1000);
    const requestedStartTimestamp = nowTimestamp - timePeriod * 24 * 60 * 60;

    // ✅ Correct SQL query to fetch oldest and newest records from Supabase
    const { data: minData, error: minError } = await supabase
      .from("nft_sales")
      .select("timestamp")
      .eq("contract_address", contractAddress)
      .order("timestamp", { ascending: true })
      .limit(1);

    const { data: maxData, error: maxError } = await supabase
      .from("nft_sales")
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

    // ✅ If no data exists in Supabase, fetch the entire period
    if (!minData.length || !maxData.length) {
      console.log(
        `🔄 No sales found in DB. Fetching full ${timePeriod}-day period.`
      );
      await fetchAndSaveSales(
        contractAddress,
        requestedStartTimestamp,
        nowTimestamp
      );
      return await getCachedSales(
        contractAddress,
        requestedStartTimestamp,
        nowTimestamp
      );
    }

    // ✅ Convert Supabase timestamps to seconds
    const dbOldestTimestamp = Math.floor(
      new Date(minData[0]?.timestamp).getTime() / 1000
    );
    const dbNewestTimestamp = Math.floor(
      new Date(maxData[0]?.timestamp).getTime() / 1000
    );

    console.log(
      `📌 Supabase data range: ${new Date(
        dbOldestTimestamp * 1000
      ).toISOString()} – ${new Date(dbNewestTimestamp * 1000).toISOString()}`
    );

    let fetchStart: number | null = null;
    let fetchEnd: number | null = null;

    // ✅ If the oldest Supabase date is newer than the requested period, fetch missing data
    if (dbOldestTimestamp > requestedStartTimestamp) {
      fetchStart = requestedStartTimestamp;
      fetchEnd = dbOldestTimestamp - 1;
      console.log(
        `🔄 Fetching older sales: ${new Date(
          fetchStart * 1000
        ).toISOString()} – ${new Date(fetchEnd * 1000).toISOString()}`
      );
      await fetchAndSaveSales(contractAddress, fetchStart, fetchEnd);
    }

    // ✅ If the newest Supabase date is older than the current date, fetch new data
    if (dbNewestTimestamp < nowTimestamp) {
      fetchStart = dbNewestTimestamp + 1;
      fetchEnd = nowTimestamp;
      console.log(
        `🔄 Fetching new sales: ${new Date(
          fetchStart * 1000
        ).toISOString()} – ${new Date(fetchEnd * 1000).toISOString()}`
      );
      await fetchAndSaveSales(contractAddress, fetchStart, fetchEnd);
    }

    if (
      dbOldestTimestamp <= requestedStartTimestamp &&
      dbNewestTimestamp >= nowTimestamp
    ) {
      console.log(
        "✅ Supabase already contains the full requested period. No API calls needed."
      );
    }

    return await getCachedSales(
      contractAddress,
      requestedStartTimestamp,
      nowTimestamp
    );
  } catch (error) {
    console.error("❌ Error fetching NFT sales:", error);
    return [];
  }
}

/**
 * Fetch missing sales from API and save to Supabase
 */
async function fetchAndSaveSales(
  contractAddress: string,
  startTimestamp: number,
  endTimestamp: number
) {
  let continuationToken: string | null = null;
  let iterationCount = 0;
  const MAX_ITERATIONS = 50;

  // ✅ 1. Paņem jau saglabātos darījumus
  const { data: existingSales, error } = await supabase
    .from("nft_sales")
    .select("tx_hash")
    .eq("contract_address", contractAddress)
    .gte("timestamp", new Date(startTimestamp * 1000).toISOString());

  if (error) {
    console.error("❌ Error fetching existing sales from Supabase:", error);
    return;
  }

  const existingHashSet = new Set(existingSales?.map((s) => s.tx_hash));
  let allNewSales: NFTTransactionProps[] = []; // ✅ Apvieno visus datus pirms saglabāšanas

  do {
    if (iterationCount++ >= MAX_ITERATIONS) {
      console.error("🚨 Max iterations reached, stopping API calls!");
      break;
    }

    let url = `/sales/v6?contract=${contractAddress}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}&limit=500`;
    if (continuationToken) {
      url += `&continuation=${continuationToken}`;
    }

    const response = await reservoirClient.get(url);
    const sales: SaleAPIResponse[] = response.data.sales;
    continuationToken = response.data.continuation ?? null;

    if (!sales || sales.length === 0) {
      console.warn("⚠️ No more sales found.");
      break;
    }

    // ✅ 2. Filtrē tikai jaunus darījumus
    const newSales = sales
      .filter((sale) => !existingHashSet.has(sale.txHash))
      .map((sale) => ({
        tx_hash: sale.txHash,
        contract_address: contractAddress,
        token_id: sale.token.tokenId,
        from_wallet: sale.from,
        to_wallet: sale.to,
        price: sale.price.amount.native,
        usd_price: sale.price.amount.usd || 0,
        order_source: sale.orderSource ?? "unknown",
        timestamp: new Date(sale.timestamp * 1000).toISOString(),
        block_num: sale.block,
        order_kind: sale.orderKind ?? "unknown",
      }));

    allNewSales = [...allNewSales, ...newSales]; // ✅ Apvieno visus jaunus ierakstus

    console.log(
      `✅ Fetched ${newSales.length} new sales (Total: ${allNewSales.length})`
    );

    await new Promise((resolve) => setTimeout(resolve, 1000)); // ✅ Palielināta aizture pret 429 kļūdu
  } while (continuationToken);

  if (allNewSales.length > 0) {
    console.log(
      `✅ Saving ${allNewSales.length} new sales transactions to Supabase.`
    );
    await saveSalesToSupabase(allNewSales); // ✅ Saglabā VISUS ierakstus vienā pieprasījumā
  } else {
    console.log("✅ No new sales to save.");
  }
}

/**
 * Fetch cached sales from Supabase after all updates.
 */
async function getCachedSales(
  contractAddress: string,
  startTimestamp: number,
  endTimestamp: number
): Promise<NFTTransactionProps[]> {
  try {
    let allSales: NFTTransactionProps[] = [];
    let offset = 0;
    const limit = 1000;

    while (true) {
      const { data, error } = await supabase
        .from("nft_sales")
        .select("*")
        .eq("contract_address", contractAddress)
        .gte("timestamp", new Date(startTimestamp * 1000).toISOString())
        .lte("timestamp", new Date(endTimestamp * 1000).toISOString())
        .order("timestamp", { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error("❌ Error fetching cached sales from Supabase:", error);
        return [];
      }

      if (!data || data.length === 0) {
        break;
      }

      allSales = [...allSales, ...data];
      offset += limit;

      if (data.length < limit) {
        break;
      }
    }

    console.log(`✅ Returning ${allSales.length} cached sales from Supabase.`);
    return allSales;
  } catch (error) {
    console.error("❌ Error getting cached sales:", error);
    return [];
  }
}
