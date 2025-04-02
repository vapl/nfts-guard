export function analyzeActivityVolatility(volume7d: number, volume30d: number) {
  const avgWeeklyVolume = volume30d / 4 || 1;
  const volatilityIndex =
    ((volume7d - avgWeeklyVolume) / avgWeeklyVolume) * 100;

  let riskLevel: "Low" | "Medium" | "High" = "Low";
  if (Math.abs(volatilityIndex) > 75) riskLevel = "High";
  else if (Math.abs(volatilityIndex) > 40) riskLevel = "Medium";

  return {
    volatilityIndex: +volatilityIndex.toFixed(2),
    riskLevel,
  };
}
