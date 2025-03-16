import { fetchAndStoreNFTData } from "../fetchAndStoreNFTData";

const testContract = "0xbd3531da5cf5857e7cfaa92426877b022e612cf8"; // Aizvieto ar reālu NFT kolekcijas adresi
const testTimePeriod = 30; // Testējam pēdējās 7 dienas

async function test() {
  console.log("🚀 Running NFT Data Fetch Test...");
  const result = await fetchAndStoreNFTData(testContract, testTimePeriod);

  if (result) {
    console.log("✅ Test Successful! Data Fetched and Stored.");
  } else {
    console.error("❌ Test Failed.");
  }
}

test();
