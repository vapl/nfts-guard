import { getCollectionData } from "./getReservoirCollections";
import { getNFTSales } from "./getReservoirSales";
import { getNFTTransfers } from "./getReservoirTransfers";
import { getNFTCollectionOwners } from "./getReservoirCollectionOwners";

/**
 * Fetches and stores all NFT-related data for a given contract address.
 * @param contractAddress The NFT collection contract address.
 * @param timePeriod The time period for fetching sales and transfers (1, 7, 30, 90, 365 days).
 */
export async function fetchAndStoreNFTData(
  contractAddress: string,
  timePeriod: 1 | 7 | 30 | 90 | 365
) {
  console.log(`🚀 Starting data fetch for contract: ${contractAddress}`);

  try {
    // ✅ 1️⃣ Iegūst kolekcijas datus un saglabā DB
    const collectionData = await getCollectionData(contractAddress);
    console.log("✅ Collection Data Fetched:", collectionData);

    // ✅ 2️⃣ Iegūst pārdošanas darījumus un saglabā DB
    const salesData = await getNFTSales(contractAddress, timePeriod);
    console.log(`✅ Sales Data Fetched (${salesData.length} records)`);

    // ✅ 3️⃣ Iegūst transakcijas un saglabā DB
    const transferData = await getNFTTransfers(contractAddress, timePeriod);
    console.log(`✅ Transfer Data Fetched (${transferData.length} records)`);

    // ✅ 4️⃣ Iegūst kolekcijas īpašniekus un saglabā DB
    const ownersData = await getNFTCollectionOwners(
      contractAddress,
      timePeriod
    );
    console.log(`✅ Owners Data Fetched (${ownersData.length} records)`);

    console.log("🎯 All data successfully fetched and stored!");
    return { collectionData, salesData, transferData, ownersData };
  } catch (error) {
    console.error("❌ Error fetching and storing NFT data:", error);
    return null;
  }
}
