// utils/tweetGenerator.ts

interface TweetData {
  collectionName: string;
  safetyScore: number;
  washTrading: number;
  whaleRisk: string;
  rugPullRisk: string;
  url: string;
}

export function generateTweet({
  collectionName,
  safetyScore,
  washTrading,
  whaleRisk,
  rugPullRisk,
  url,
}: TweetData): string {
  const safetyLabel =
    safetyScore >= 90 ? "Secure" : safetyScore >= 70 ? "Moderate" : "Risky";

  const verdict =
    safetyScore >= 85
      ? "✅ This NFT looks legit."
      : safetyScore >= 70
      ? "🧐 This NFT may be moderately safe."
      : "⚠️ This NFT might be risky. Do your own research!";

  return `🚨 Just scanned ${collectionName} with @NFTsGuard!
  
  🛡️ Safety Score: ${safetyScore}/100 (${safetyLabel})
  🧨 Rug Pull Risk: ${rugPullRisk}
  🔍 Wash Trading: ${washTrading}%
  🐋 Whale Risk: ${whaleRisk}
  
  ${verdict}
  
  🔗 Scan yours 👉 ${url}`;
}
