import { ethers } from "ethers";
import "dotenv/config";

// QuickNode RPC URL no .env faila
const QUICKNODE_ENDPOINT_URL = process.env.QUICKNODE_ENDPOINT_URL;

if (!QUICKNODE_ENDPOINT_URL) {
  throw new Error("❌ QUICKNODE_ENDPOINT_URL is not defined in .env");
}

// Ethereum nodrošinātājs (RPC savienojums ar QuickNode)
const provider = new ethers.JsonRpcProvider(QUICKNODE_ENDPOINT_URL);

/**
 * Fetch NFT owners from the blockchain using Ethers.js
 * @param contractAddress - NFT kolekcijas smart contract adrese
 * @param tokenIds - Tokenu ID masīvs, ja nepieciešams filtrēt
 * @returns Īpašnieku masīvs
 */
export async function getNFTOwners(
  contractAddress: string,
  tokenIds?: number[]
): Promise<{ wallet: string; tokenId: number }[]> {
  try {
    const contract = new ethers.Contract(
      contractAddress,
      ["function ownerOf(uint256 tokenId) external view returns (address)"],
      provider
    );

    const owners: { wallet: string; tokenId: number }[] = [];

    // Ja tokenIds nav norādīti, pieņemam, ka kolekcijā ir 10,000 NFT (pielāgo pēc vajadzības)
    const totalTokens = tokenIds ? tokenIds.length : 10000;

    for (let tokenId = 1; tokenId <= totalTokens; tokenId++) {
      try {
        const owner = await contract.ownerOf(tokenId);
        owners.push({ wallet: owner, tokenId });
        console.log(`✅ Token ${tokenId} owned by ${owner}`);
      } catch {
        console.warn(`⚠️ Token ${tokenId} not found (burned or invalid)`);
      }
    }

    return owners;
  } catch (error) {
    console.error("❌ Error fetching NFT owners:", error);
    return [];
  }
}
