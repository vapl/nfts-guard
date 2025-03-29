export function calculateSafetyScore(params: {
  rugPullRiskLevel: "Low" | "Medium" | "High";
  washTradingIndex: number;
  whaleDumpPercent?: number;
}): number {
  let score = 100;

  // Rug pull impact
  if (params.rugPullRiskLevel === "Medium") score -= 20;
  if (params.rugPullRiskLevel === "High") score -= 40;

  // Wash trading impact
  if (params.washTradingIndex > 20) score -= 15;
  if (params.washTradingIndex > 50) score -= 30;

  // Whale aktivitātes ietekme (ja pieejama)
  if (params.whaleDumpPercent && params.whaleDumpPercent > 30) {
    score -= 15;
  }

  return Math.max(0, Math.min(100, score));
}
