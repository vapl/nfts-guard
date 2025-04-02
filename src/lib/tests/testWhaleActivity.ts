import { getNFTWhaleActivity } from "@/lib/analysis/analysisWhaleActivity";

const contractAddress = "0xbd3531da5cf5857e7cfaa92426877b022e612cf8";
const timePeriod = 30; // Dienu skaits, ko analizēt

getNFTWhaleActivity(contractAddress, timePeriod)
  .then((results) => {
    console.log("✅ Test results:", results);
  })
  .catch((error) => {
    console.error("❌ Error testing whale activity:", error);
  });
