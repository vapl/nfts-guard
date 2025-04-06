import { RISK_RULES } from "@/lib/config/riskRulesConfig";

export function calculateSafetyScore(params: {
  rugPullRiskLevel: "Low" | "Medium" | "High" | "Uncertain" | "N/A";
  washTradingIndex: number;
  whaleDumpPercent?: number;
  liquidityRatio?: number;
  floorDropPercent?: number;
  volatilityRiskLevel?: "Low" | "Medium" | "High";
}): number {
  const score = 100;
  const weights = RISK_RULES.safetyScoreWeights;

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
      : 0;

  // 🐋 Whale dump impact
  const whaleDumpPenalty =
    params.whaleDumpPercent && params.whaleDumpPercent > 30
      ? 100 * weights.whaleDump
      : 0;

  // 💧 Liquidity risk (optional)
  const liquidityPenalty =
    params.liquidityRatio && params.liquidityRatio > 0.5
      ? 20
      : params.liquidityRatio && params.liquidityRatio > 0.3
      ? 10
      : 0;

  // 📉 Floor price drop (optional)
  const floorDropPenalty =
    params.floorDropPercent && params.floorDropPercent < -50
      ? 20
      : params.floorDropPercent && params.floorDropPercent < -25
      ? 10
      : 0;

  // 📊 Volatility risk (optional)
  const volatilityPenalty =
    params.volatilityRiskLevel === "High"
      ? 100 * weights.volatility
      : params.volatilityRiskLevel === "Medium"
      ? 50 * weights.volatility
      : 0;

  const totalPenalty =
    rugPullPenalty +
    washTradingPenalty +
    whaleDumpPenalty +
    liquidityPenalty +
    floorDropPenalty +
    volatilityPenalty;

  return Math.max(0, Math.min(100, score - totalPenalty));
}
