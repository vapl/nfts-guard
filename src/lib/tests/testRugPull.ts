import { detectRugPull } from "@/lib/analysis/detectRugPull";

const contractAddress = "0xed5af388653567af2f388e6224dc7c4b3241c544";

detectRugPull(contractAddress, 30)
  .then((result) => {
    console.log("🚀 Rug pull results:", result);
  })
  .catch((error) => {
    console.error("❌ Error detecting Rug pull:", error);
  });
