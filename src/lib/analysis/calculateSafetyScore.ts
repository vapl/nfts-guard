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

  // 🚫 Penalize for insufficient market data
  const isDataSparse =
    (params.salesCount ?? 0) === 0 ||
    (params.uniqueBuyers ?? 0) === 0 ||
    (params.uniqueSellers ?? 0) === 0;
  const sparseDataPenalty = isDataSparse ? 20 : 0;

  // 🧨 Rug pull impact
  const rugPullPenalty =
    params.rugPullRiskLevel === "High"
      ? 100 * weights.rugPull
      : params.rugPullRiskLevel === "Medium"
      ? 50 * weights.rugPull
      : 0;

  // 🔁 Wash trading impact
  const washTradingPenalty =
    params.washTradingIndex > RISK_RULES.washTrading.highThreshold
      ? 100 * weights.washTrading
      : params.washTradingIndex > RISK_RULES.washTrading.mediumThreshold
      ? 50 * weights.washTrading
      : params.washTradingIndex < 5
      ? -5 // ✅ Bonus for clean market
      : 0;

  // 🐋 Whale dump impact
  const whaleDumpPenalty =
    params.whaleDumpPercent && params.whaleDumpPercent > 30
      ? 100 * weights.whaleDump
      : 0;

  // 💧 Liquidity risk
  const liquidityPenalty =
    params.liquidityRatio && params.liquidityRatio < 0.3
      ? 100 * weights.liquidity
      : params.liquidityRatio && params.liquidityRatio < 0.5
      ? 50 * weights.liquidity
      : 0;

  // 📉 Floor price drop
  const floorDropPenalty =
    params.floorDropPercent && params.floorDropPercent < -50
      ? 100 * weights.floorPrice
      : params.floorDropPercent && params.floorDropPercent < -25
      ? 50 * weights.floorPrice
      : 0;

  // 📊 Volatility risk
  const volatilityPenalty =
    params.volatilityRiskLevel === "High"
      ? 100 * weights.volatility
      : params.volatilityRiskLevel === "Medium"
      ? 50 * weights.volatility
      : 0;

  // 🟢 Positive signal: whale accumulation
  const whaleAccumulationBonus =
    params.accumulatingWhalePercent && params.accumulatingWhalePercent > 15
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

  const finalScore = Math.max(
    0,
    Math.min(100, score - totalPenalty + whaleAccumulationBonus)
  );

  return finalScore;
}
