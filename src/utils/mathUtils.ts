export function getAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

export function getStandardDeviation(values: number[]): number {
  const avg = getAverage(values);
  const squaredDiffs = values.map((val) => Math.pow(val - avg, 2));
  return Math.sqrt(getAverage(squaredDiffs));
}

export function getZScore(value: number, values: number[]): number {
  const mean = getAverage(values);
  const std = getStandardDeviation(values);
  if (std === 0) return 0;
  return (value - mean) / std;
}
