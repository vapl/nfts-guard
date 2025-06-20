import { supabase } from "@/lib/supabase/supabase";
import { NFTTransactionProps } from "@/types/apiTypes/globalApiTypes";
import { getNFTSales } from "@/lib/reservoir/getReservoirSales";

/**
 * ✅ Detects wash trading with optimized logic and indexed access
 */
async function detectWashTrading(contractAddress: string, days: number = 30) {
  const sales = await getNFTSales(contractAddress, days);

  // ✅ Ja nav pietiekamu datu vispār
  const uniqueBuyers = new Set(sales.map((s) => s.to_wallet)).size;
  const uniqueSellers = new Set(sales.map((s) => s.from_wallet)).size;

  const noActivity =
    sales.length === 0 ||
    (uniqueBuyers === 0 && uniqueSellers === 0) ||
    sales.every(
      (s) => s.from_wallet === s.to_wallet || !s.price || s.price === 0
    );

  if (noActivity) {
    console.warn("⚠️ Not enough activity to assess wash trading.");
    return {
      washTradingIndex: 0,
      suspiciousSalesCount: 0,
      analysis:
        "Not enough trading activity to assess wash trading risk accurately.",
      details: {
        totalSales: 0,
        sameWalletTrades: 0,
        quickSwapTrades: 0,
        frequentSales: 0,
        sameWalletTradesPercent: "0%",
        quickSwapTradesPercent: "0%",
        frequentSalesPercent: "0%",
      },
      topWallets: [],
    };
  }

  if (sales.length < 20) {
    return {
      washTradingIndex: 0,
      suspiciousSalesCount: 0,
      analysis: "Too few transactions to assess wash trading accurately.",
      details: {
        totalSales: sales.length,
        sameWalletTrades: 0,
        quickSwapTrades: 0,
        frequentSales: 0,
        sameWalletTradesPercent: "0%",
        quickSwapTradesPercent: "0%",
        frequentSalesPercent: "0%",
      },
      topWallets: [],
    };
  }

  let sameWalletTrades = 0;
  let quickSwapTrades = 0;
  let frequentSales = 0;
  const walletActivity: Record<string, number> = {};

  // Index sales by token_id and from_wallet
  const salesByToken = new Map<string, NFTTransactionProps[]>();
  const salesByWallet = new Map<string, NFTTransactionProps[]>();

  for (const sale of sales) {
    const tokenSales = salesByToken.get(sale.token_id) || [];
    tokenSales.push(sale);
    salesByToken.set(sale.token_id, tokenSales);

    const walletSales = salesByWallet.get(sale.from_wallet) || [];
    walletSales.push(sale);
    salesByWallet.set(sale.from_wallet, walletSales);
  }

  const suspiciousSales = sales.filter((sale) => {
    const saleDate = new Date(sale.timestamp);
    let isSuspicious = false;

    // A) Same wallet trade
    if (sale.from_wallet === sale.to_wallet) {
      sameWalletTrades++;
      isSuspicious = true;
    }

    // B) Quick Swap (reverse trade in < 24h)
    const tokenSales = salesByToken.get(sale.token_id) || [];
    const quickSwap = tokenSales.some(
      (s) =>
        s.from_wallet === sale.to_wallet &&
        s.to_wallet === sale.from_wallet &&
        Math.abs(new Date(s.timestamp).getTime() - saleDate.getTime()) <
          86400000
    );
    if (quickSwap) {
      quickSwapTrades++;
      isSuspicious = true;
    }

    // C) Frequent sales from same wallet (3+ in <6h)
    const walletSales = salesByWallet.get(sale.from_wallet) || [];
    const frequent =
      walletSales.filter(
        (s) =>
          s.token_id === sale.token_id &&
          Math.abs(new Date(s.timestamp).getTime() - saleDate.getTime()) <
            21600000
      ).length > 3;
    if (frequent) {
      frequentSales++;
      isSuspicious = true;
    }

    // Register activity
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
    .slice(0, 5)
    .map(([wallet, count]) => ({ wallet, count }));

  // Store result in Supabase
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
