import { getNFTCollectionOwners } from "@/lib/reservoir/getReservoirOwners";

async function test() {
  const contractAddress = "0xbd3531da5cf5857e7cfaa92426877b022e612cf8"; // Example collection

  const owners = await getNFTCollectionOwners(contractAddress);

  if (owners.length === 0) {
    console.log("✅ No ownership issues detected.");
    return;
  }

  console.log("Fetched owners count:", owners.length);
}

test();
