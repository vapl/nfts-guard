import { detectWashTrading } from "@/lib/analysis/detectWashTrading";

const contractAddress = "0xed5af388653567af2f388e6224dc7c4b3241c544"; // Nomaini ar reālu adresi

detectWashTrading(contractAddress, 30)
  .then((result) => {
    console.log("🚀 Wash trading results:", result);
  })
  .catch((error) => {
    console.error("❌ Error detecting wash trading:", error);
  });
