import { fetchAndAnalyzeNFTData } from "../fetchAndStoreNFTData";

// 0xbd3531da5cf5857e7cfaa92426877b022e612cf8
const testContract = "0xb792864e4659d0b8076f9c6912c228f914ec66d4"; // Aizvieto ar reālu NFT kolekcijas adresi
const testTimePeriod = 30;

async function test() {
  console.log("🚀 Running NFT Data Fetch Test...");
  const result = await fetchAndAnalyzeNFTData(testContract, testTimePeriod);

  if (result) {
    console.log("✅ Test Successful! Data Fetched and Stored.");
  } else {
    console.error("❌ Test Failed.");
  }
}

test();
