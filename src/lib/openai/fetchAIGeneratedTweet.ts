export async function fetchAIGeneratedTweet(data: {
  collectionName: string;
  safetyScore: number;
  washTrading: number;
  whaleRisk: string;
  rugPullRisk: string;
}) {
  const res = await fetch("/api/generate-tweet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  return result.tweet;
}
