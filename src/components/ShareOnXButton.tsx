import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { fetchAIGeneratedTweet } from "@/lib/openai/fetchAIGeneratedTweet";

interface ShareOnXButtonProps {
  collectionName: string;
  safetyScore: number;
  riskLevel: string;
  washTrading: number;
  rugPullRisk: string;
  appUrl: string;
}

export const ShareOnXButton = ({
  collectionName,
  safetyScore,
  riskLevel,
  washTrading,
  rugPullRisk,
  appUrl,
}: ShareOnXButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    const tweet = await fetchAIGeneratedTweet({
      collectionName,
      safetyScore,
      washTrading,
      whaleRisk: riskLevel,
      rugPullRisk,
    });

    const tweetWithUrl = `${tweet}\n\nScan now: ${appUrl}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetWithUrl
    )}`;
    window.open(tweetUrl, "_blank");
    setLoading(false);
  };

  return (
    <div className="w-full flex justify-center">
      <button
        onClick={handleShare}
        className="flex items-center justify-center cursor-pointer h-14 w-14 bg-card text-heading font-medium rounded-full shadow-lg hover:bg-purple transition-all duration-200"
        disabled={loading}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-heading"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <FaXTwitter size={24} />
        )}
      </button>
    </div>
  );
};
