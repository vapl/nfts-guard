import { getNFTSales } from "@/lib/getReservoirSales";

async function test() {
  const contractAddress = "0xbd3531da5cf5857e7cfaa92426877b022e612cf8"; // Example collection

  const sales = await getNFTSales(contractAddress, 1);

  console.log("Fetched sales:", sales);
  console.log("Fetched sales count:", sales.length);
}

test();
