const testTradeHistory = [
  { from: "0xSeller1", to: "0xBuyerA", event_type: "Sale", trade_price: 1 },
  { from: "0xSeller1", to: "0xBuyerB", event_type: "Sale", trade_price: 1 },
  { from: "0xSeller1", to: "0xBuyerC", event_type: "Sale", trade_price: 1 }, // 🚨 Aizdomīgs
  { from: "0xSeller2", to: "0xBuyerD", event_type: "Sale", trade_price: 1 },
  { from: "0xSeller2", to: "0xBuyerD", event_type: "Sale", trade_price: 1 },
  { from: "0xSeller3", to: "0xSeller4", event_type: "Sale", trade_price: 5 }, // 🚨 Iespējams wash trading
  { from: "0xSeller4", to: "0xSeller3", event_type: "Sale", trade_price: 5 }, // 🚨 Iespējams wash trading
];

async function detectWashTradingTest(tradeHistory: any[]) {
  console.log("📊 Running test...");
  const suspiciousSellers = new Map<string, Set<string>>();

  tradeHistory.forEach((trade) => {
    const { from, to, event_type, trade_price } = trade;

    if (event_type !== "Sale") return;
    if (from === to) return;
    if (trade_price === 0) return;

    if (!suspiciousSellers.has(from)) {
      suspiciousSellers.set(from, new Set());
    }
    suspiciousSellers.get(from)!.add(to);
  });

  const flaggedAddresses: string[] = [];
  for (let [seller, buyers] of suspiciousSellers.entries()) {
    if (buyers.size >= 3) {
      flaggedAddresses.push(seller);
    }
  }

  console.log(
    "🚨 Test results:",
    flaggedAddresses.length > 0
      ? flaggedAddresses
      : "✅ No wash trading detected!"
  );
}

detectWashTradingTest(testTradeHistory);
