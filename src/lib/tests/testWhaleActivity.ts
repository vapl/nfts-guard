import { getNFTWhaleActivity } from "@/lib/analysis/analysisWhaleActivity";

const contractAddress = "0xed5af388653567af2f388e6224dc7c4b3241c544";
const timePeriod = 30; // Dienu skaits, ko analizēt

getNFTWhaleActivity(contractAddress, timePeriod)
  .then((results) => {
    console.log("✅ Test results:", results);
  })
  .catch((error) => {
    console.error("❌ Error testing whale activity:", error);
  });
