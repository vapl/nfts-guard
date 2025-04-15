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
    listedPercent,
    collectionName,
    safetyScore,
    washTrading,
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
  You are a Web3 degen NFT pro. Your job is to generate a short, hype-style tweet (max 280 characters) summarizing this NFT scan result.
  
  Collection: ${collectionName}
  Status: ${status}
  Volume: ${volumeEth} ETH
  Listed: ${listedPercent}%
  Safety Score: ${safetyScore}
  Wash Trading: ${washTrading}%
  Rug Pull Risk: ${rugPullRisk}
  
  Your tweet MUST:
  - Start with: ${status}
  - Include 1 short sentence of degen-style insight based on volume, listings, or risks (e.g. “Clean metrics ✅ but low volume 👀”)
  - Mention 1–2 emojis in the middle
  - End with: “Scan before you ape. Try @NFTsGuard 🔍”
  - Use 2–3 hashtags: #NFTs #Web3 #DYOR #NFTCommunity #RugPull
  
  ⚠️ Return ONLY the tweet text, no explanations or extra comments.
  ⚠️ Do NOT write like a customer support agent.
  ⚠️ Use casual, bold Web3-native voice, like you're tweeting to fellow NFT degens.
  
  Max length: 280 characters.
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
    safetyScore > 80 &&
    volumeEth > 10 &&
    listedPercent < 10 &&
    rugPullRisk === "Low" &&
    washTrading < 10
  ) {
    return "Still alive 🔥";
  }

  if (volumeEth < 1 && listedPercent > 60) return "Dead 💀";

  if (volumeEth < 5 && listedPercent > 50) return "Ghost town 👻";

  if (safetyScore < 40 || rugPullRisk === "High" || washTrading > 50) {
    return "Sketchy ⚠️";
  }

  return "Still alive 🔥";
}
