import { Alchemy, Network, AssetTransfersCategory, AssetTransfersResponse } from "alchemy-sdk";
import { supabase } from "./supabase";
import "dotenv/config";

// ✅ Konfigurē Alchemy SDK
const alchemy = new Alchemy({
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
});

/**
 * Fetches NFT sales transactions using Alchemy Transfers API
 * @param contractAddress - The NFT contract address
 * @param fromBlock - The starting block number
 * @param toBlock - The ending block number
 */
export async function fetchNFTSales(contractAddress: string, fromBlock: number, toBlock: number) {
    try {
        let pageKey: string | null = null;
        let allTransactions: any[] = [];
        let ethTransactions: any[] = [];

        do {
            const response: AssetTransfersResponse = await alchemy.core.getAssetTransfers({
              fromBlock: `0x${fromBlock.toString(16)}`,
              toBlock: `0x${toBlock.toString(16)}`,
              contractAddresses: [contractAddress],
              category: [AssetTransfersCategory.ERC721, AssetTransfersCategory.ERC1155, AssetTransfersCategory.EXTERNAL],
              excludeZeroValue: false,
              withMetadata: true,
              maxCount: 1000,
              pageKey: pageKey || undefined,
          });

          if (response.transfers.length > 0) {
              response.transfers.forEach((tx: any) => {
                  if (tx.category === "external" && tx.asset === "ETH") {
                      ethTransactions.push({
                          tx_hash: tx.hash,
                          block_num: parseInt(tx.blockNum, 16),
                          from_address: tx.from,
                          to_address: tx.to,
                          value: tx.value,
                      });
                  } else {
                      allTransactions.push({
                          contract_address: tx.rawContract?.address || null,
                          token_id: tx.tokenId || (tx.erc1155Metadata?.[0]?.tokenId ?? null),
                          from_address: tx.from,
                          to_address: tx.to,
                          value: "0", // Tiks aizstāts, ja atradīsim ETH maksājumu
                          asset: tx.asset || "UNKNOWN",
                          category: tx.category,
                          block_num: parseInt(tx.blockNum, 16),
                          tx_hash: tx.hash,
                          timestamp: new Date(tx.metadata.blockTimestamp)
                      });
                  }
              });
          }

          pageKey = response.pageKey || null;
      } while (pageKey);

      console.log(`🔎 Kopā atrasti ${ethTransactions.length} ETH pārskaitījumi.`);

      // ✅ Tagad atrodam ETH transakcijas, kas atbilst NFT pārdošanas transakcijām
      allTransactions = allTransactions.map((tx) => {
          let matchingEthTx = ethTransactions.find((ethTx) => ethTx.tx_hash === tx.tx_hash);
          
          // Ja pēc tx_hash neatrod, meklējam pēc tā paša bloka numura un pircēja adreses
          if (!matchingEthTx) {
              matchingEthTx = ethTransactions.find((ethTx) => ethTx.block_num === tx.block_num && ethTx.to_address === tx.from_address);
          }
          
          if (matchingEthTx) {
              tx.value = matchingEthTx.value; // ✅ Aizstāj "0" ar īsto pārdošanas cenu
              tx.asset = "ETH";
              console.log(`💰 NFT pārdošana atrasta: TxHash: ${tx.tx_hash}, Cena: ${tx.value} ETH`);
          } else {
              console.log(`❌ Nav atrasts ETH maksājums NFT TxHash: ${tx.tx_hash}`);
          }
          return tx;
      });

      if (allTransactions.length > 0) {
          console.log("✅ Transactions to save:", JSON.stringify(allTransactions, null, 2));
          await saveTransactionsToSupabase(allTransactions);
      }
      return allTransactions;
    } catch (error) {
        console.error("Error fetching NFT sales transactions:", error);
    }
}

/**
 * Saves NFT transactions to Supabase
 * @param transactions - Array of NFT transactions
 */
async function saveTransactionsToSupabase(transactions: any[]) {
  try {
      console.log("🔄 Trying to save transactions to Supabase...");
      const { data, error } = await supabase.from("nft_transactions").insert(transactions);
      
      if (error) {
          console.error("❌ Error saving NFT sales transactions to Supabase:", error);
      } else {
          console.log("✅ NFT sales transactions saved to Supabase:", data);
      }
  } catch (error) {
      console.error("❌ Critical error saving NFT sales transactions to Supabase:", error);
  }
}