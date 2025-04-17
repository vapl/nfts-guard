import { RISK_RULES } from "@/lib/config/riskRulesConfig";

export function calculateSafetyScore(params: {
  rugPullRiskLevel: "Low" | "Medium" | "High" | "Uncertain" | "N/A";
  washTradingIndex: number;
  whaleDumpPercent?: number;
  liquidityRatio?: number;
  floorDropPercent?: number;
  volatilityRiskLevel?: "Low" | "Medium" | "High";
  salesCount?: number;
  uniqueBuyers?: number;
  uniqueSellers?: number;
  accumulatingWhalePercent?: number;
}): number {
  const weights = RISK_RULES.safetyScoreWeights;
  const score = 100;

  const isDataSparse =
    (params.salesCount ?? 0) === 0 ||
    (params.uniqueBuyers ?? 0) === 0 ||
    (params.uniqueSellers ?? 0) === 0;

  const sparseDataPenalty = isDataSparse ? 25 : 0;

  const rugPullPenalty = {
    High: 100 * weights.rugPull,
    Medium: 50 * weights.rugPull,
    Low: 0,
    Uncertain: 20 * weights.rugPull,
    "N/A": 10 * weights.rugPull,
  }[params.rugPullRiskLevel];

  const washTradingPenalty =
    params.washTradingIndex > RISK_RULES.washTrading.highThreshold
      ? 100 * weights.washTrading
      : params.washTradingIndex > RISK_RULES.washTrading.mediumThreshold
      ? 50 * weights.washTrading
      : params.washTradingIndex < 5
      ? -10
      : 0;

  const whaleDumpPenalty =
    params.whaleDumpPercent && params.whaleDumpPercent > 30
      ? 100 * weights.whaleDump
      : params.whaleDumpPercent && params.whaleDumpPercent > 15
      ? 50 * weights.whaleDump
      : 0;

  const liquidityPenalty =
    params.liquidityRatio !== undefined && params.liquidityRatio >= 1
      ? 100 * weights.liquidity
      : params.liquidityRatio !== undefined && params.liquidityRatio >= 0.75
      ? 50 * weights.liquidity
      : 0;

  const floorDropPenalty =
    params.floorDropPercent && params.floorDropPercent < -50
      ? 100 * weights.floorPrice
      : params.floorDropPercent && params.floorDropPercent < -25
      ? 50 * weights.floorPrice
      : 0;

  const volatilityPenalty = {
    High: 100 * weights.volatility,
    Medium: 50 * weights.volatility,
    Low: 0,
  }[params.volatilityRiskLevel ?? "Low"];

  const whaleAccumulationBonus =
    params.accumulatingWhalePercent && params.accumulatingWhalePercent > 25
      ? 10
      : params.accumulatingWhalePercent && params.accumulatingWhalePercent > 15
      ? 5
      : 0;

  const totalPenalty =
    rugPullPenalty +
    washTradingPenalty +
    whaleDumpPenalty +
    liquidityPenalty +
    floorDropPenalty +
    volatilityPenalty +
    sparseDataPenalty;

  let finalScore = score - totalPenalty + whaleAccumulationBonus;

  // Aizsardzība: ja likviditāte ir 100% un nav neviena pirkuma — ļoti aizdomīgi
  if (
    params.liquidityRatio !== undefined &&
    params.liquidityRatio >= 1 &&
    isDataSparse
  ) {
    finalScore = Math.min(finalScore, 30);
  }

  return Math.max(0, Math.min(100, finalScore));
}
