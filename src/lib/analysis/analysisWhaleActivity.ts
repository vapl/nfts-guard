import { supabase } from "@/lib/supabase/supabase";
import {
  NFTWhaleActivityProps,
  WhaleStats,
  WhaleStatsTopWhale,
} from "@/types/apiTypes/globalApiTypes";
import { saveWhaleActivityToSupabase } from "@/lib/supabase/dataStorage/saveWhaleActivity";
import { upsertWhaleStatsToSupabase } from "../supabase/dataStorage/upsertWhaleStatsToSupabase";

const PAGE_SIZE = 500;

export function generateWhaleStats(
  whaleData: NFTWhaleActivityProps[],
  totalWhales: number
): WhaleStats {
  let totalBuys = 0;
  let totalSells = 0;
  let totalTransfers = 0;
  let totalEthSpent = 0;
  let totalHoldTime = 0;
  let totalVolatility = 0;
  let holdTimeCount = 0;
  let volatilityCount = 0;

  const typeCounts: Record<string, number> = {};
  let topWhale: WhaleStatsTopWhale | undefined;

  for (const whale of whaleData) {
    totalBuys += whale.whale_buys;
    totalSells += whale.whale_sells;
    totalTransfers += whale.whale_transfers;
    totalEthSpent += whale.total_eth_spent;

    if (whale.avg_hold_time > 0) {
      totalHoldTime += whale.avg_hold_time;
      holdTimeCount++;
    }

    if (whale.price_volatility > 0) {
      totalVolatility += whale.price_volatility;
      volatilityCount++;
    }

    typeCounts[whale.whale_type] = (typeCounts[whale.whale_type] || 0) + 1;

    if (!topWhale || whale.total_eth_spent > topWhale.total_eth_spent) {
      topWhale = {
        wallet: whale.wallet,
        whale_type: whale.whale_type,
        total_eth_spent: whale.total_eth_spent,
        total_activity: whale.total_activity ?? 0,
      };
    }
  }

  // ✅ Aprēķinām procentus no kopējā vaļu skaita
  const typePercentages: Record<string, number> = {};
  for (const [type, count] of Object.entries(typeCounts)) {
    typePercentages[type] =
      totalWhales > 0
        ? parseFloat(((count / totalWhales) * 100).toFixed(2))
        : 0;
  }

  return {
    activityLog: [],
    totalWhales,
    totalBuys,
    totalSells,
    totalTransfers,
    totalEthSpent: parseFloat(totalEthSpent.toFixed(4)),
    avgHoldTime: holdTimeCount
      ? parseFloat((totalHoldTime / holdTimeCount).toFixed(2))
      : 0,
    avgVolatility: volatilityCount
      ? parseFloat((totalVolatility / volatilityCount).toFixed(4))
      : 0,
    typeCounts,
    typePercentages, // ✅ JAUNS LAUKS
    topWhale,
  };
}

interface GetNFTWhaleActivityResult {
  whaleActivity: NFTWhaleActivityProps[];
  whaleStats: WhaleStats;
}

export async function getNFTWhaleActivity(
  contractAddress: string,
  timePeriod: number
): Promise<GetNFTWhaleActivityResult> {
  try {
    function generateActivityLog(
      salesData: { timestamp: string; price: number }[]
    ): { date: string; eth: number }[] {
      const map = new Map<string, number>();

      for (const sale of salesData) {
        const date = new Date(sale.timestamp).toISOString().slice(0, 10);
        const eth = sale.price || 0;
        map.set(date, (map.get(date) || 0) + eth);
      }

      return Array.from(map.entries()).map(([date, eth]) => ({ date, eth }));
    }

    const nowTimestamp = Math.floor(Date.now() / 1000);
    const requestedStartTimestamp = new Date(
      (nowTimestamp - timePeriod * 24 * 60 * 60) * 1000
    ).toISOString();

    const { data: whaleOwners, error: ownersError } = await supabase
      .from("nft_owners")
      .select("wallet")
      .eq("contract_address", contractAddress)
      .gte("token_count", 11);

    if (ownersError) throw new Error("❌ Error fetching whale owners");
    if (!whaleOwners?.length)
      return {
        whaleActivity: [],
        whaleStats: {
          activityLog: [],
          totalWhales: 0,
          totalBuys: 0,
          totalSells: 0,
          totalTransfers: 0,
          totalEthSpent: 0,
          avgHoldTime: 0,
          avgVolatility: 0,
          typeCounts: {},
          topWhale: undefined,
        },
      };

    interface SalesAggregateData {
      total_eth_spent: number;
      total_usd_spent: number;
      hold_times: number[];
      price_volatility: number[];
    }

    const whaleWallets = whaleOwners.map((o) => o.wallet);
    let offset = 0;
    let allWhaleActivity: NFTWhaleActivityProps[] = [];
    const whaleTransfersMap: Record<string, Set<string>> = {};
    const whaleNetworkMap: Record<string, Set<string>> = {};
    const salesMap: Record<string, SalesAggregateData> = {};

    const { data: salesData } = await supabase
      .from("nft_sales")
      .select("from_wallet, to_wallet, price, usd_price, timestamp")
      .eq("contract_address", contractAddress)
      .gte("timestamp", requestedStartTimestamp);

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
      if (sale.price)
        salesMap[sale.to_wallet].price_volatility.push(sale.price);
    });

    while (true) {
      const { data: whaleTransfers, error: transfersError } = await supabase
        .from("nft_transfers")
        .select("from_wallet, to_wallet, timestamp")
        .eq("contract_address", contractAddress)
        .gte("timestamp", requestedStartTimestamp)
        .range(offset, offset + PAGE_SIZE - 1);

      if (transfersError)
        return {
          whaleActivity: [],
          whaleStats: {
            activityLog: [],
            totalWhales: 0,
            totalBuys: 0,
            totalSells: 0,
            totalTransfers: 0,
            totalEthSpent: 0,
            avgHoldTime: 0,
            avgVolatility: 0,
            typeCounts: {},
            topWhale: undefined,
          },
        };
      if (!whaleTransfers?.length) break;

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

        if (isBuyerWhale) activityMap[wallet].whale_buys++;
        if (isSellerWhale) {
          activityMap[wallet].whale_sells++;
          whaleTransfersMap[wallet] ||= new Set();
          whaleTransfersMap[wallet].add(tx.to_wallet);

          if (whaleWallets.includes(tx.to_wallet)) {
            whaleNetworkMap[wallet] ||= new Set();
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

      const avgHoldTime = spendingData.hold_times.length
        ? spendingData.hold_times.reduce((a: number, b: number) => a + b, 0) /
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

    // Add missing whales from salesMap
    for (const wallet of whaleWallets) {
      const alreadyAdded = allWhaleActivity.find((w) => w.wallet === wallet);
      const spendingData = salesMap[wallet];

      if (alreadyAdded || !spendingData) continue;

      const avgHoldTime = spendingData.hold_times.length
        ? spendingData.hold_times.reduce((a, b) => a + b, 0) /
          spendingData.hold_times.length
        : 0;

      const priceVolatility =
        spendingData.price_volatility.length > 1
          ? Math.max(...spendingData.price_volatility) -
            Math.min(...spendingData.price_volatility)
          : 0;

      allWhaleActivity.push({
        contract_address: contractAddress,
        wallet,
        whale_buys: 1, // pieņem ka vismaz 1 pirkums
        whale_sells: 0,
        whale_transfers: 0,
        total_eth_spent: spendingData.total_eth_spent,
        total_usd_spent: spendingData.total_usd_spent,
        avg_hold_time: avgHoldTime,
        price_volatility: priceVolatility,
        whale_type: avgHoldTime < 7 ? "Flipper Whale" : "Accumulating Whale",
        last_updated: new Date().toISOString(),
        total_activity: 1,
        frequent_recipients: [],
        whale_network: [],
      });
    }

    const whaleStats = generateWhaleStats(allWhaleActivity, whaleOwners.length);
    whaleStats.activityLog = generateActivityLog(salesData || []);

    saveWhaleActivityToSupabase(allWhaleActivity);
    upsertWhaleStatsToSupabase(contractAddress, whaleStats);

    return {
      whaleActivity: allWhaleActivity,
      whaleStats,
    };
  } catch (error) {
    console.error("❌ Error fetching NFT whale activity:", error);
    return {
      whaleActivity: [],
      whaleStats: {
        activityLog: [],
        totalWhales: 0,
        totalBuys: 0,
        totalSells: 0,
        totalTransfers: 0,
        totalEthSpent: 0,
        avgHoldTime: 0,
        avgVolatility: 0,
        typeCounts: {},
        topWhale: undefined,
      },
    };
  }
}
