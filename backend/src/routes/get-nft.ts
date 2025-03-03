import { NextApiRequest, NextApiResponse } from "next";
import { getOpenseaData } from "@/backend/services/opensea";
import { getEtherscanData } from "@/backend/services/etherscan";
import { getAlchemyData } from "@/backend/services/alchemy";
import { getTwitterData } from "@/backend/services/twitter";
import { getDiscordData } from "@/backend/services/discord";
import { analyzeRisk } from "@/backend/services/riskAnalysis";

export default async function handler(req: Next);
