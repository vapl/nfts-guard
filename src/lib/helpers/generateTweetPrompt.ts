export interface TweetInput {
  volumeEth: number;
  holdersCount: number;
  listedPercent: number;
  collectionName: string;
  safetyScore: number;
  washTrading: number;
  whaleRisk: string;
  rugPullRisk: string;
}

export function generateTweetPrompt(input: TweetInput): string {
  const {
    volumeEth,
    holdersCount,
    listedPercent,
    collectionName,
    safetyScore,
    washTrading,
    whaleRisk,
    rugPullRisk,
  } = input;

  const status = classifyStatus({
    safetyScore,
    volumeEth,
    listedPercent,
    rugPullRisk,
    washTrading,
  });

  return `
You are an edgy Web3 degen NFT pro. Write a short, hype-style tweet (max 280 characters) summarizing this NFT scan result.

Collection: ${collectionName}
Status: ${status}
Volume: ${volumeEth} ETH
Holders: ${holdersCount}
Listed: ${listedPercent}%
Safety Score: ${safetyScore}
Wash Trading: ${washTrading}%
Rug Pull Risk: ${rugPullRisk}
Whale Risk: ${whaleRisk}

Your tweet MUST:
- Start with: ${status}
- Include 1 bold insight based on volume, listings, or risks (e.g. “Clean metrics ✅ but low volume 👀”)
- Use 1–2 emojis mid-sentence to break monotony
- Add 1 line of opinion (“Don’t fade it”, “Decent play”, etc.)
- End with: “Scan before you ape. Try @NFTsGuard 🔍”
- Use 2–3 hashtags (e.g. #NFTs #Web3 #DYOR)

⚠️ Return ONLY the tweet text. No explanation or summary.
⚠️ Use confident, degen, informal tone. No customer service talk.

Max 280 characters.
`.trim();
}

function classifyStatus({
  safetyScore,
  volumeEth,
  listedPercent,
  rugPullRisk,
  washTrading,
}: {
  safetyScore: number;
  volumeEth: number;
  listedPercent: number;
  rugPullRisk: string;
  washTrading: number;
}): string {
  if (
    safetyScore > 90 &&
    volumeEth > 20 &&
    listedPercent < 10 &&
    rugPullRisk === "Low" &&
    washTrading < 10
  ) {
    return "🔥 Pumping";
  }

  if (volumeEth < 1 && listedPercent > 60) return "Dead 💀";

  if (volumeEth < 5 && listedPercent > 50) return "Ghost town 👻";

  if (safetyScore < 40 || rugPullRisk === "High" || washTrading > 50) {
    return "Sketchy 🚨";
  }

  return "Still alive ✅";
}
