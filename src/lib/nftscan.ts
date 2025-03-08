import { fetchNFTPriceHistory, fetchNFTFloorPrice } from "@/lib/nft";

/**
 * 🛠️ Wash trading analīzes funkcija
 */
export const detectWashTrading = async (
  contractAddress: string,
  tokenId?: string
) => {
  const tradeHistory = await fetchNFTPriceHistory(contractAddress, tokenId);

  console.log("📊 Received trade history:", tradeHistory.length, "entries");
  if (!tradeHistory || tradeHistory.length === 0) {
    return { error: "⚠️ No trade history found or data is invalid" };
  }

  // 🔹 Iegūst floor price kolekcijai
  const floorPrice = await fetchNFTFloorPrice(contractAddress);
  console.log(`🔹 Floor price: $${floorPrice}`);

  const suspiciousSellers = new Map<string, Set<string>>();
  const tradePairs = new Map<string, number>();
  const priceManipulationPairs: string[] = [];
  const prices: number[] = [];

  const priceThreshold = 0.05; // 5% svārstība
  const floorPriceThreshold = 0.02; // 2% svārstība pret floor price

  // ✅ Analizē darījumus
  tradeHistory.forEach(({ from, to, event_type, trade_price }) => {
    if (event_type !== "Sale") return;
    if (from === to) return;
    if (trade_price === 0) return;

    console.log(`🛠 Checking trade: ${from} → ${to} ($${trade_price})`);
    prices.push(trade_price);

    // 🔹 Salīdzina ar floor price
    if (Math.abs(trade_price - floorPrice) / floorPrice < floorPriceThreshold) {
      console.warn(
        `⚠️ Possible price manipulation! Trade at $${trade_price} is too close to floor price (${floorPrice})`
      );
      priceManipulationPairs.push(
        `Trade at $${trade_price} is too close to floor price (${floorPrice})`
      );
    }

    // Reģistrē pārdevējus
    if (!suspiciousSellers.has(to)) {
      suspiciousSellers.set(to, new Set());
    }
    suspiciousSellers.get(to)!.add(from);

    // Reģistrē pārdošanas pārus
    const pair = `${from}-${to}`;
    const reversePair = `${to}-${from}`;
    if (tradePairs.has(reversePair)) {
      tradePairs.set(reversePair, (tradePairs.get(reversePair) || 0) + 1);
    } else {
      tradePairs.set(pair, (tradePairs.get(pair) || 0) + 1);
    }
  });

  // 🚨 Anomāliju detektors ar Z-score
  const zScores = calculateZScores(prices);
  zScores.forEach((z, i) => {
    if (Math.abs(z) > 2) {
      console.warn(
        `⚠️ Price anomaly detected! Trade price: $${
          prices[i]
        } (Z-score: ${z.toFixed(2)})`
      );
      priceManipulationPairs.push(
        `Price anomaly detected! Trade price: $${
          prices[i]
        } (Z-score: ${z.toFixed(2)})`
      );
    }
  });

  // 🚨 Atzīmē aizdomīgās adreses (3+ reizes)
  const flaggedAddresses: string[] = [];
  suspiciousSellers.forEach((buyers, seller) => {
    if (buyers.size >= 3) {
      flaggedAddresses.push(seller);
    }
  });

  // 🚨 Atzīmē adreses, kas tirgo savā starpā
  const flaggedPairs: string[] = [];
  tradePairs.forEach((count, pair) => {
    if (count >= 3) {
      flaggedPairs.push(pair);
    }
  });

  return {
    suspiciousSellers:
      flaggedAddresses.length > 0
        ? flaggedAddresses
        : "✅ No suspicious sellers detected!",
    suspiciousTradePairs:
      flaggedPairs.length > 0 ? flaggedPairs : "✅ No suspicious trade pairs!",
    priceManipulation:
      priceManipulationPairs.length > 0
        ? priceManipulationPairs
        : "✅ No price manipulation detected!",
  };
};

/**
 * 📊 Aprēķina Z-score, lai identificētu cenu anomālijas
 */
const calculateZScores = (prices: number[]): number[] => {
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const stdDev = Math.sqrt(
    prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) /
      prices.length
  );
  return prices.map((price) => (price - mean) / stdDev);
};
