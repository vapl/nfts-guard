import { supabase } from "@/lib/supabase";
import { NFTTransactionProps } from "@/types/apiTypes/globalApiTypes";

/**
 * ✅ Fetches all NFT sales data from Supabase within a given period using pagination
 */
async function getNFTSales(
  contractAddress: string,
  days: number
): Promise<NFTTransactionProps[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days); // Subtract days from today
  let allSales: NFTTransactionProps[] = [];
  let offset = 0;
  const limit = 1000; // Supabase query limit

  while (true) {
    const { data, error } = await supabase
      .from("nft_sales")
      .select("*")
      .eq("contract_address", contractAddress)
      .gte("timestamp", startDate.toISOString())
      .order("timestamp", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("❌ Error fetching NFT sales:", error);
      break;
    }

    if (!data || data.length === 0) {
      break; // No more data to fetch
    }

    allSales = [...allSales, ...data];
    offset += limit;

    if (data.length < limit) {
      break; // If less than limit, it means no more records left
    }
  }

  return allSales;
}

/**
 * ✅ Detects wash trading in NFT sales with optimized logic and calculates Wash Trading Index
 */
async function detectWashTrading(contractAddress: string, days: number = 30) {
  console.log(
    `🔎 Analyzing wash trading for: ${contractAddress} over ${days} days`
  );
  const sales = await getNFTSales(contractAddress, days);

  if (sales.length === 0) {
    console.warn("⚠️ No sales data found for this period.");
    return {
      washTradingIndex: 0,
      suspiciousSalesCount: 0,
      analysis: "No wash trading detected.",
      details: {},
      topWallets: [],
    };
  }

  let sameWalletTrades = 0;
  let quickSwapTrades = 0;
  let frequentSales = 0;
  const walletActivity: Record<string, number> = {};

  const suspiciousSales = sales.filter((sale) => {
    const saleDate = new Date(sale.timestamp);
    let isSuspicious = false;

    if (sale.from_wallet === sale.to_wallet) {
      sameWalletTrades++;
      isSuspicious = true;
    }

    if (
      sales.some(
        (s) =>
          s.token_id === sale.token_id &&
          s.from_wallet === sale.to_wallet &&
          s.to_wallet === sale.from_wallet &&
          Math.abs(new Date(s.timestamp).getTime() - saleDate.getTime()) <
            86400000
      )
    ) {
      quickSwapTrades++;
      isSuspicious = true;
    }

    if (
      sales.filter(
        (s) =>
          s.token_id === sale.token_id &&
          s.from_wallet === sale.from_wallet &&
          Math.abs(new Date(s.timestamp).getTime() - saleDate.getTime()) <
            21600000
      ).length > 3
    ) {
      // Now checks for >3 sales in 6 hours
      frequentSales++;
      isSuspicious = true;
    }

    if (isSuspicious) {
      walletActivity[sale.from_wallet] =
        (walletActivity[sale.from_wallet] || 0) + 1;
      walletActivity[sale.to_wallet] =
        (walletActivity[sale.to_wallet] || 0) + 1;
    }

    return isSuspicious;
  });

  const totalSales = sales.length;
  const washTradingIndex = Math.min(
    ((sameWalletTrades * 2 + quickSwapTrades * 1.5 + frequentSales * 1) /
      totalSales) *
      100,
    100
  );
  const analysis =
    washTradingIndex > 50
      ? "High risk of wash trading detected. Many suspicious transactions found."
      : washTradingIndex > 20
      ? "Moderate risk of wash trading detected. Some unusual transactions observed."
      : "Low risk of wash trading detected. Most transactions appear legitimate.";

  const sortedWallets = Object.entries(walletActivity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) // Top 5 wallets with most activity
    .map(([wallet, count]) => ({ wallet, count }));

  console.log(
    `🚨 Detected ${
      suspiciousSales.length
    } suspicious sales with a Wash Trading Index of ${washTradingIndex.toFixed(
      2
    )}!`
  );

  // ✅ Store results in Supabase
  await supabase.from("nft_wash_trading_results").insert({
    contract_address: contractAddress,
    wash_trading_index: washTradingIndex.toFixed(2),
    suspicious_sales_count: suspiciousSales.length,
    analysis,
    total_sales: totalSales,
    same_wallet_trades: sameWalletTrades,
    quick_swap_trades: quickSwapTrades,
    frequent_sales: frequentSales,
    same_wallet_trades_percent:
      ((sameWalletTrades / totalSales) * 100).toFixed(2) + "%",
    quick_swap_trades_percent:
      ((quickSwapTrades / totalSales) * 100).toFixed(2) + "%",
    frequent_sales_percent:
      ((frequentSales / totalSales) * 100).toFixed(2) + "%",
    top_wallets: sortedWallets,
    detected_at: new Date().toISOString(),
  });

  return {
    washTradingIndex,
    suspiciousSalesCount: suspiciousSales.length,
    analysis,
    details: {
      totalSales,
      sameWalletTrades,
      quickSwapTrades,
      frequentSales,
      sameWalletTradesPercent:
        ((sameWalletTrades / totalSales) * 100).toFixed(2) + "%",
      quickSwapTradesPercent:
        ((quickSwapTrades / totalSales) * 100).toFixed(2) + "%",
      frequentSalesPercent:
        ((frequentSales / totalSales) * 100).toFixed(2) + "%",
    },
    topWallets: sortedWallets,
  };
}

export { detectWashTrading };
