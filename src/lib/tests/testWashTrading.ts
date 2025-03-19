import { detectWashTrading } from "@/lib/analysis/detectWashTrading";

const contractAddress = "0xbd3531da5cf5857e7cfaa92426877b022e612cf8"; // Nomaini ar reālu adresi

detectWashTrading(contractAddress, 30)
  .then((result) => {
    console.log("🚀 Wash trading results:", result);
  })
  .catch((error) => {
    console.error("❌ Error detecting wash trading:", error);
  });
