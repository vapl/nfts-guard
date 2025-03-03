import type { NextApiRequest, NextApiResponse } from "next";
import { Alchemy, Network } from "alchemy-sdk";
import { isAddress } from "ethers"; // ✅ Pareizs import no ethers

// Load environment variables
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const settings = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { contractAddress, tokenId } = req.body;

  if (!contractAddress || !tokenId) {
    return res
      .status(400)
      .json({ error: "Missing contractAddress or tokenId" });
  }

  // ✅ Validate Ethereum contract address
  if (!isAddress(contractAddress)) {
    return res.status(400).json({ error: "Invalid Ethereum contract address" });
  }

  try {
    // Fetch NFT metadata using Alchemy SDK
    const nft = await alchemy.nft.getNftMetadata(contractAddress, tokenId);

    if (!nft) {
      return res.status(404).json({ error: "NFT not found" });
    }

    // ✅ Fix tokenUri type
    const tokenUri = typeof nft.tokenUri === "string" ? nft.tokenUri : null;

    return res.status(200).json({
      contractAddress,
      tokenId,
      name: nft.name || "Unknown NFT",
      image: nft.image || null,
      description: nft.description || "No description available",
      owner: nft.contract?.address || "Unknown",
      tokenUri: tokenUri, // ✅ Pārbaudīta un droša vērtība
    });
  } catch (error) {
    console.error("Error fetching NFT data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
