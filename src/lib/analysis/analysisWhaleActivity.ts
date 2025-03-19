import { supabase } from "@/lib/supabase";
import { NFTWhaleActivityProps } from "@/types/apiTypes/globalApiTypes";
import { saveWhaleActivityToSupabase } from "@/lib/dataStorage/saveWhaleActivity";

const PAGE_SIZE = 500;

/**
 * Fetch, analyze, and save NFT whale activity to the database
 */
export async function getNFTWhaleActivity(
  contractAddress: string,
  timePeriod: number
): Promise<NFTWhaleActivityProps[]> {
  try {
    console.log(`🔎 Checking whale activity for contract: ${contractAddress}`);

    const nowTimestamp = Math.floor(Date.now() / 1000);
    const requestedStartTimestamp = new Date(
      (nowTimestamp - timePeriod * 24 * 60 * 60) * 1000
    ).toISOString();

    // ✅ Fetch whale wallets
    const { data: whaleOwners, error: ownersError } = await supabase
      .from("nft_owners")
      .select("wallet")
      .eq("contract_address", contractAddress)
      .eq("is_whale", true);

    if (ownersError) throw new Error("❌ Error fetching whale owners");
    if (!whaleOwners?.length) return [];

    const whaleWallets = whaleOwners.map((o) => o.wallet);
    let offset = 0;
    let allWhaleActivity: NFTWhaleActivityProps[] = [];
    const whaleTransfersMap: Record<string, Set<string>> = {};
    const whaleNetworkMap: Record<string, Set<string>> = {};
    const salesMap: Record<
      string,
      {
        total_eth_spent: number;
        total_usd_spent: number;
        hold_times: number[];
        price_volatility: number[];
      }
    > = {};

    // ✅ Fetch sales data for ETH and USD spending
    const { data: salesData, error: salesError } = await supabase
      .from("nft_sales")
      .select("from_wallet, to_wallet, price, usd_price, timestamp")
      .eq("contract_address", contractAddress)
      .gte("timestamp", requestedStartTimestamp);

    console.log(`📊 Total NFT sales found: ${salesData?.length}`);

    if (salesError) console.warn("⚠️ Error fetching sales data.");

    salesData?.forEach((sale) => {
      const buyTimestamp = new Date(sale.timestamp).getTime();
      const holdTime = (nowTimestamp - buyTimestamp / 1000) / (60 * 60 * 24);

      if (!salesMap[sale.to_wallet]) {
        salesMap[sale.to_wallet] = {
          total_eth_spent: 0,
          total_usd_spent: 0,
          hold_times: [],
          price_volatility: [],
        };
      }
      salesMap[sale.to_wallet].hold_times.push(holdTime);
      salesMap[sale.to_wallet].total_eth_spent += sale.price || 0;
      salesMap[sale.to_wallet].total_usd_spent += sale.usd_price || 0;

      if (sale.price) {
        salesMap[sale.to_wallet].price_volatility.push(sale.price);
      }
    });

    while (true) {
      console.log(
        `📡 Fetching whale transfers from ${offset} to ${
          offset + PAGE_SIZE - 1
        }`
      );

      const { data: whaleTransfers, error: transfersError } = await supabase
        .from("nft_transfers")
        .select("from_wallet, to_wallet, timestamp")
        .eq("contract_address", contractAddress)
        .gte("timestamp", requestedStartTimestamp)
        .range(offset, offset + PAGE_SIZE - 1);

      if (transfersError) {
        console.error("❌ Error fetching whale transfers:", transfersError);
        return [];
      }

      if (!whaleTransfers?.length) break;
      console.log(`📊 Retrieved ${whaleTransfers.length} transfers`);

      const activityMap: Record<string, NFTWhaleActivityProps> = {};

      for (const tx of whaleTransfers) {
        const isBuyerWhale = whaleWallets.includes(tx.to_wallet);
        const isSellerWhale = whaleWallets.includes(tx.from_wallet);

        if (!isBuyerWhale && !isSellerWhale) continue;
        const wallet = isBuyerWhale ? tx.to_wallet : tx.from_wallet;

        if (!activityMap[wallet]) {
          activityMap[wallet] = {
            contract_address: contractAddress,
            wallet,
            whale_buys: 0,
            whale_sells: 0,
            whale_transfers: 0,
            total_eth_spent: 0,
            total_usd_spent: 0,
            avg_hold_time: 0,
            price_volatility: 0,
            whale_type: "",
            last_updated: new Date().toISOString(),
            total_activity: 0,
            frequent_recipients: [],
            whale_network: [],
          };
        }

        if (isBuyerWhale) {
          activityMap[wallet].whale_buys++;
        }

        if (isSellerWhale) {
          activityMap[wallet].whale_sells++;
          if (!whaleTransfersMap[wallet]) {
            whaleTransfersMap[wallet] = new Set();
          }
          whaleTransfersMap[wallet].add(tx.to_wallet);

          if (whaleWallets.includes(tx.to_wallet)) {
            if (!whaleNetworkMap[wallet]) {
              whaleNetworkMap[wallet] = new Set();
            }
            whaleNetworkMap[wallet].add(tx.to_wallet);
          }
        }
      }

      allWhaleActivity.push(...Object.values(activityMap));
      offset += PAGE_SIZE;
    }

    allWhaleActivity = allWhaleActivity.map((whale) => {
      const spendingData = salesMap[whale.wallet] || {
        total_eth_spent: 0,
        total_usd_spent: 0,
        hold_times: [],
        price_volatility: [],
      };
      const avgHoldTime =
        spendingData.hold_times.length > 0
          ? spendingData.hold_times.reduce((a, b) => a + b, 0) /
            spendingData.hold_times.length
          : 0;
      const priceVolatility =
        spendingData.price_volatility.length > 1
          ? Math.max(...spendingData.price_volatility) -
            Math.min(...spendingData.price_volatility)
          : 0;

      let whaleType = "Neutral Whale";
      if (whale.whale_buys > whale.whale_sells)
        whaleType = "Accumulating Whale";
      if (whale.whale_sells > whale.whale_buys) whaleType = "Dumping Whale";
      if (avgHoldTime < 7 && whale.whale_buys + whale.whale_sells > 10)
        whaleType = "Flipper Whale";

      return {
        ...whale,
        total_eth_spent: spendingData.total_eth_spent,
        total_usd_spent: spendingData.total_usd_spent,
        avg_hold_time: avgHoldTime,
        price_volatility: priceVolatility,
        whale_type: whaleType,
        total_activity:
          whale.whale_buys + whale.whale_sells + whale.whale_transfers,
        frequent_recipients: Array.from(whaleTransfersMap[whale.wallet] || []),
        whale_network: Array.from(whaleNetworkMap[whale.wallet] || []),
      };
    });

    // ✅ Saglabājam datus datubāzē
    saveWhaleActivityToSupabase(allWhaleActivity);

    return allWhaleActivity;
  } catch (error) {
    console.error("❌ Error fetching NFT whale activity:", error);
    return [];
  }
}
