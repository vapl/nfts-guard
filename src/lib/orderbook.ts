import { viemClient } from "@/lib/alchemy";
import { encodeFunctionData, decodeFunctionResult, parseEther } from "viem";

// LooksRare OrderBook līguma adrese (Mainnet)
const LOOKSRARE_ORDERBOOK_ADDRESS =
  "0x59728544b08ab483533076417fbbb2fd0b17ce3a";
const ORDERBOOK_ABI = [
  {
    name: "getOrders",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "collection", type: "address" },
      { name: "limit", type: "uint256" },
    ],
    outputs: [
      {
        components: [
          { name: "price", type: "uint256" },
          { name: "maker", type: "address" },
          { name: "taker", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "expiry", type: "uint256" },
        ],
        type: "tuple[]",
      },
    ],
  },
];

/**
 * ✅ Izgūst order book no blokķēdes, izmantojot viem un Alchemy RPC
 */
interface OrderType {
  price: string;
  maker: string;
  taker: string;
  amount: string;
  expiry: string;
}

import { alchemy } from "@/lib/alchemy";

export async function fetchOrderBookAlchemy(contractAddress: string) {
  try {
    console.log(
      `🔎 Fetching order book via Alchemy for contract: ${contractAddress}`
    );

    const listings = await alchemy.nft.getFloorPrice(contractAddress);
    console.log(`✅ Order book data:`, listings);

    if (!listings) return { bids: [], asks: [] };

    return {
      bids: [],
      asks: [
        {
          price:
            "floorPrice" in listings.openSea ? listings.openSea.floorPrice : 0,
          marketplace: "OpenSea",
        },
      ],
    };
  } catch (error) {
    console.error("❌ Error fetching order book with Alchemy:", error);
    return { bids: [], asks: [] };
  }
}
