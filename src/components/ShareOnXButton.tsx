// components/ShareOnXButton.tsx
import { FaXTwitter } from "react-icons/fa6";
import { generateTweet } from "@/utils/tweetGenerator";

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
  const handleShare = () => {
    const baseTweet = generateTweet({
      collectionName,
      safetyScore,
      washTrading,
      whaleRisk: riskLevel,
      rugPullRisk,
      url: appUrl,
    });

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      baseTweet
    )}`;

    window.open(tweetUrl, "_blank");
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <button
        onClick={handleShare}
        className="flex items-center cursor-pointer gap-2 px-5 py-3 bg-[#000000] text-white font-medium rounded-xl shadow-lg hover:bg-neutral-950 transition-all duration-200"
      >
        <FaXTwitter size={18} />
        Share Result
      </button>
    </div>
  );
};
