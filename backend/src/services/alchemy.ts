import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

export const fetchNFTMetadata = async (
  contractAddress: string,
  tokenId: string
) => {
  try {
    const response = await alchemy.nft.getNftMetadata(contractAddress, tokenId);
    return response;
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    throw new Error("Failed to fetch NFT metadata");
  }
};
