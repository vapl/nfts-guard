// core.ts
import { ethers } from "ethers";

const RPC_URL = process.env.ALCHEMY_URL!; // Nodrošini, ka .env satur šo mainīgo!
export const provider = new ethers.JsonRpcProvider(RPC_URL);
