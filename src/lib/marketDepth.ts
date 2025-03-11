import { fetchOrderBookAlchemy } from "@/lib/orderbook";

export async function getMarketDepthViem(contractAddress: string) {
  const { bids, asks } = await fetchOrderBookAlchemy(contractAddress);

  if (bids.length === 0 || asks.length === 0) {
    return { bidAskSpread: "N/A", depthAnalysis: "No order book data" };
  }

  const bestBid = Math.max(...bids.map((b: { price: any }) => b.price));
  const bestAsk = Math.min(...asks.map((a: { price: any }) => a.price));
  const spread = ((bestAsk - bestBid) / bestAsk) * 100;

  return {
    bidAskSpread: `${spread.toFixed(2)}%`,
    depthAnalysis:
      spread > 40 ? "Potential market manipulation" : "Healthy market",
  };
}
