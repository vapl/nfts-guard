import { Alchemy, Network } from "alchemy-sdk";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import "dotenv/config";

// ✅ Konfigurē Alchemy SDK NFT API piekļuvei
const alchemySettings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

export const alchemy = new Alchemy(alchemySettings);

// ✅ Konfigurē viem klientu bloku un transakciju datiem
export const viemClient = createPublicClient({
  chain: mainnet,
  transport: http(
    `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  ),
});
