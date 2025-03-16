import { getCollectionData } from "@/lib/getReservoirCollections";

async function test() {
  const contractAddress = "0xed5af388653567af2f388e6224dc7c4b3241c544"; // CryptoPunks piemērs
  console.log(`🔎 Iegūstam NFT kolekcijas (${contractAddress}) datus...`);

  const data = await getCollectionData(contractAddress);

  console.log("📌 Kolekcijas dati:", data);
}

test();
