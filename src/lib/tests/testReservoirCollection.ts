import { getCollectionData } from "@/lib/reservoir/getReservoirCollections";

async function test() {
  const contractAddress = "0x1B41d54B3F8de13d58102c50D7431Fd6Aa1a2c48"; // CryptoPunks piemērs
  console.log(`🔎 Iegūstam NFT kolekcijas (${contractAddress}) datus...`);

  const data = await getCollectionData(contractAddress, true); // ← force refresh!

  console.log("📌 Kolekcijas dati:", data);
}

test();
