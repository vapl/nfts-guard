import { NftSale } from "alchemy-sdk";
import { alchemy, viemClient } from "./alchemy";
import { formatUnits } from "viem";

export async function getNFTCollectionData(contractAddress: string) {
  try {
    console.log(
      `📡 Fetching collection data from Alchemy for contract: ${contractAddress}`
    );

    const metadata = await alchemy.nft.getContractMetadata(contractAddress);
    const floorPriceData = await alchemy.nft.getFloorPrice(contractAddress);
    const owners = await alchemy.nft.getOwnersForContract(contractAddress);
    const salesData = await alchemy.nft.getNftSales({ contractAddress });

    const floorPrice =
      floorPriceData.openSea && "floorPrice" in floorPriceData.openSea
        ? floorPriceData.openSea.floorPrice
        : 0;
    const priceCurrency =
      floorPriceData.openSea && "priceCurrency" in floorPriceData.openSea
        ? floorPriceData.openSea.priceCurrency
        : "";

    const totalSupplyValue = Number(metadata.totalSupply) || 0;
    const marketCap = floorPrice * totalSupplyValue;
    const liquidityScore =
      salesData.nftSales.length / Number(metadata.totalSupply);

    if (!metadata) {
      throw new Error("❌ No collection data found");
    }

    return {
      name: metadata.name || "Unknown",
      contractAddress,
      totalSupply: metadata.totalSupply,
      logoUrl: metadata.openSeaMetadata.imageUrl || "",
      priceSymbol: metadata.symbol,
      floorPrice: floorPrice.toFixed(2),
      priceCurrency,
      marketCap: marketCap.toFixed(2),
      uniqueOwners: owners.totalCount,
      liquidityScore: liquidityScore.toFixed(2),
    };
  } catch (error: any) {
    console.error("❌ Error fetching NFT collection data:", error);
    return { error: error.message || "Failed to fetch collection data" };
  }
}

/*///////////////////////////////////////// 
                Price history
*/ /////////////////////////////////////////

// Marketplace contract addresses
const marketplaceAddresses = {
  OpenSea: "0x4e1f41613c9084fdb9e34e11fae9412427480e56",
  Blur: "0x00000000000111AbE46ff893f3B2f43A4D0101f0",
  LooksRare: "0x59728544B08AB483533076417FbBB2fD0B17CE3a",
  X2Y2: "0x74312363e45DCaBA76c59ec49a7Aa8A65a67EeD3",
  Sudoswap: "0x2b2e8cda09bba9660dca5cb6233787738ad68329",
  Foundation: "0xcda72070e455bb31c7690a170224ce43623d0b6f",
  Rarible: "0xf42aa99f011a1fa7cda90e5e98b277e306bca83e",
  SuperRare: "0xb16e9d783ad8bcb2a95c42a903d1f5e78e44f01c",
};

// Get marketplace from transaction
async function getMarketplaceFromTx(txHash: string): Promise<string> {
  try {
    const tx = await viemClient.getTransaction({
      hash: txHash as `0x${string}`,
    });
    const receipt = await viemClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    if (tx?.to) {
      for (const [name, address] of Object.entries(marketplaceAddresses)) {
        if (tx.to.toLowerCase() === address.toLowerCase()) return name;
      }
    }

    for (const log of receipt.logs) {
      for (const [name, address] of Object.entries(marketplaceAddresses)) {
        if (log.address.toLowerCase() === address.toLowerCase()) return name;
      }
    }

    return "Unknown";
  } catch (error) {
    console.error(`❌ Error getting marketplace for ${txHash}:`, error);
    return "Unknown";
  }
}

// Get ETH value of transaction
async function getTransactionValue(txHash: string): Promise<number> {
  try {
    const tx = await viemClient.getTransaction({
      hash: txHash as `0x${string}`,
    });
    return tx?.value ? parseFloat(formatUnits(tx.value, 18)) : 0;
  } catch (error) {
    console.error(`Error getting transaction value for ${txHash}:`, error);
    return 0;
  }
}

// Fetch NFT price history
export async function fetchNFTPriceHistory(
  contractAddress: string,
  scanPeriod: "24h" | "7d" | "30d" | "6m" = "24h"
) {
  console.log(
    `📡 Fetching NFT sales history for: ${contractAddress}, Period: ${scanPeriod}`
  );

  try {
    const now = Math.floor(Date.now() / 1000);
    const periodSeconds = {
      "24h": 86400,
      "7d": 604800,
      "30d": 2592000,
      "6m": 15552000,
    }[scanPeriod];
    const startTimestamp = now - periodSeconds;

    const latestBlockData = await viemClient.getBlock({ blockTag: "latest" });
    const pastBlockData = await viemClient.getBlock({
      blockNumber: latestBlockData.number - 100n,
    });

    const avgBlockTime =
      (Number(latestBlockData.timestamp) - Number(pastBlockData.timestamp)) /
      100;

    const fromBlock =
      latestBlockData.number - BigInt(Math.floor(periodSeconds / avgBlockTime));

    console.log(
      `🔗 Calculated blocks range: ${fromBlock} to ${latestBlockData.number}`
    );
    if (!latestBlockData?.number)
      throw new Error("❌ Failed to fetch latest block number");

    const latestBlock = Number(latestBlockData.number);
    const toBlock = latestBlock;

    console.log(`🔗 Blocks: From ${fromBlock} to ${toBlock}`);
    console.log(
      `🕒 Start timestamp: ${startTimestamp}, Current timestamp: ${now}`
    );

    let alchemyNftSales: NftSale[] = [];
    let customAssetTransfers: any[] = [];
    let usingCustomAPI = false;

    try {
      const alchemySales = await alchemy.nft.getNftSales({
        contractAddress,
        fromBlock: Number(fromBlock),
        toBlock: Number(toBlock),
      });
      if (alchemySales?.nftSales?.length > 0) {
        alchemyNftSales = alchemySales.nftSales;
        console.log(
          `✅ Retrieved ${alchemyNftSales.length} sales from Alchemy getNftSales`
        );
      } else {
        console.log("⚠️ No sales found using `getNftSales()`");
      }
    } catch (error) {
      console.log("⚠️ Error with getNftSales():", error);
    }

    if (alchemyNftSales.length === 0) {
      usingCustomAPI = true;
      console.log("Trying `alchemy_getAssetTransfers()`...");

      const response = await fetch(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "alchemy_getAssetTransfers",
            params: [
              {
                fromBlock: `0x${fromBlock.toString(16)}`,
                toBlock: `0x${toBlock.toString(16)}`,
                contractAddresses: [contractAddress],
                category: ["erc721"],
                excludeZeroValue: true,
                withMetadata: true,
              },
            ],
            id: 1,
          }),
        }
      );

      const data = await response.json();
      if (data?.result?.transfers?.length > 0) {
        customAssetTransfers = data.result.transfers;
        console.log(
          `✅ Retrieved ${customAssetTransfers.length} transfers from custom API`
        );
      } else {
        console.log(
          "⚠️ No transfers found using `alchemy_getAssetTransfers` either."
        );
        return { trades: [], volume: 0, totalTrades: 0 };
      }
    }

    let formattedTrades = [];

    if (usingCustomAPI) {
      formattedTrades = await Promise.all(
        customAssetTransfers.map(async (transfer) => {
          const txValue = await getTransactionValue(transfer.hash);
          const marketplace = await getMarketplaceFromTx(transfer.hash);

          return {
            from: transfer.from || "Unknown",
            to: transfer.to || "Unknown",
            event_type: "Transfer",
            trade_price: txValue,
            marketplace,
            transactionHash: transfer.hash,
            timestamp: transfer.metadata?.blockTimestamp || now.toString(),
            token_id: transfer.erc721TokenId || transfer.tokenId,
          };
        })
      );
    } else {
      formattedTrades = alchemyNftSales.map((sale) => ({
        from: sale.sellerAddress || "Unknown",
        to: sale.buyerAddress || "Unknown",
        event_type: "Sale",
        trade_price:
          sale.sellerFee?.amount && sale.sellerFee?.decimals
            ? parseFloat(
                formatUnits(
                  BigInt(sale.sellerFee.amount),
                  sale.sellerFee.decimals
                )
              )
            : 0,
        marketplace: sale.marketplace || "Unknown",
        transactionHash: sale.transactionHash,
        timestamp: now.toString(),
        token_id: sale.tokenId,
      }));
    }

    formattedTrades = formattedTrades.filter((trade) => trade.trade_price > 0);
    formattedTrades = formattedTrades.filter(
      (trade, index, self) =>
        index ===
        self.findIndex((t) => t.transactionHash === trade.transactionHash)
    );

    const totalVolume = formattedTrades.reduce(
      (sum, trade) => sum + trade.trade_price,
      0
    );

    console.log(
      `✅ Total Trades: ${formattedTrades.length}, Volume: ${totalVolume} ETH`
    );
    console.log(
      `🔗 Fetching transactions from block ${fromBlock} to ${toBlock}`
    );

    return {
      trades: formattedTrades,
      volume: totalVolume,
      totalTrades: formattedTrades.length,
    };
  } catch (error) {
    console.error("❌ Error fetching NFT price history:", error);
    return { trades: [], volume: 0, totalTrades: 0 };
  }
}
