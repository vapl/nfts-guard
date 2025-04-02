import { getNFTTransfers } from "@/lib/reservoir/getReservoirTransfers";

async function test() {
  const contractAddress = "0xbd3531da5cf5857e7cfaa92426877b022e612cf8"; // Example collection
  const timePeriod = 7;

  const transfers = await getNFTTransfers(contractAddress, timePeriod);
  console.log("Fetched transfers:", transfers);
  console.log("Fetched transfers count:", transfers.length);
}

test();
