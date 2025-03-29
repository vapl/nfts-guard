import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  Droplet,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { ScanResultCard } from "./ScannerResultCard";
import { calculateSafetyScore } from "@/lib/analysis/calculateSafetyScore";
import { MiniFloorPriceChart } from "../charts/MiniFloorPriceChart";
import { ScannerResultsProps } from "@/types/apiTypes/globalApiTypes";
import { WhaleStatsDashboard } from "./WhaleStatsCard";
import { HolderDistribution } from "@/types/apiTypes/holderDistribution";
import { HolderDistributionChart } from "../charts/HolderDistributionChart";
import { FaRegCopy, FaCheck } from "react-icons/fa";

const COLORS = {
  secure: "#8b5cf6",
  caution: "#f59e0b",
  dangerous: "#f43f5e",
};

export function ScannerResults({
  contractAddress,
  collectionData,
  washTradingAnalysis,
  rugPullAnalysis,
  safetyScore,
  riskLevel,
  whaleActivityAnalysis,
}: ScannerResultsProps) {
  const [holderDistribution, setHolderDistribution] =
    useState<HolderDistribution | null>(null);

  useEffect(() => {
    async function fetchDistribution() {
      const res = await fetch(
        `/api/holder-distribution?contractAddress=${contractAddress}`
      );
      const json = await res.json();
      setHolderDistribution(json);
    }

    fetchDistribution();
  }, [contractAddress]);

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const floorPriceData = [
    { time: "30d", price: Number(collectionData.floor_price_change_30d) },
    { time: "7d", price: Number(collectionData.floor_price_change_7d) },
    { time: "24h", price: Number(collectionData.floor_price_change_24h) },
  ];

  const liquidityRatio =
    Number(collectionData.on_sale_count) / Number(collectionData.total_supply);

  const cards = [
    {
      title: "Rug Pull Risk",
      value: `Risk level: ${rugPullAnalysis?.risk_level ?? "N/A"}`,
      details: [
        `Whale Drop: ${Number(rugPullAnalysis?.whale_drop_percent ?? 0).toFixed(
          2
        )}%`,
        rugPullAnalysis?.seller_to_buyer_ratio
          ? `Seller/Buyer Ratio: ${rugPullAnalysis?.seller_to_buyer_ratio}`
          : undefined,
        rugPullAnalysis?.unique_sellers
          ? `Unique Sellers: ${rugPullAnalysis?.unique_sellers}`
          : undefined,
        rugPullAnalysis?.unique_buyers
          ? `Unique Buyers: ${rugPullAnalysis?.unique_buyers}`
          : undefined,
      ].filter((d): d is string => typeof d === "string"),
      icon:
        rugPullAnalysis?.risk_level === "Low" ? (
          <ShieldCheck />
        ) : rugPullAnalysis?.risk_level === "Medium" ? (
          <ShieldQuestion />
        ) : (
          <AlertTriangle />
        ),
      variant:
        rugPullAnalysis?.risk_level === "Low"
          ? "Secure"
          : rugPullAnalysis?.risk_level === "Medium"
          ? "Caution"
          : "Dangerous",
      riskScore:
        rugPullAnalysis?.risk_level === "Low"
          ? 1
          : rugPullAnalysis?.risk_level === "Medium"
          ? 2
          : 3,
      volume: 0,
      activity: 0,
    },
    {
      title: "Wash Trading Index",
      value: `${(washTradingAnalysis?.washTradingIndex ?? 0).toFixed(1)}%`,
      details: [
        `Suspicious Sales: ${washTradingAnalysis?.suspiciousSalesCount ?? 0}`,
        `Top Wallets: ${washTradingAnalysis?.topWallets?.length ?? 0}`,
      ],
      icon:
        washTradingAnalysis?.washTradingIndex > 50 ? (
          <AlertTriangle />
        ) : washTradingAnalysis?.washTradingIndex > 20 ? (
          <ShieldQuestion />
        ) : (
          <ShieldCheck />
        ),
      variant:
        washTradingAnalysis?.washTradingIndex > 50
          ? "Dangerous"
          : washTradingAnalysis?.washTradingIndex > 20
          ? "Suspicious"
          : "Secure",
      riskScore: washTradingAnalysis?.washTradingIndex < 1 ? 1 : 2,
      volume: 0,
      activity: 0,
    },
    {
      title: "Volume & Sales",
      value: `${Number(collectionData.volume_all).toFixed(2)} total`,
      details: [
        `7d Volume: ${Number(collectionData.volume_7day).toFixed(2)}`,
        `Sales Count: ${collectionData.sales_count}`,
      ],
      riskScore: 0,
      volume: collectionData.volume_all,
      activity: 0,
    },
    {
      title: "Liquidity Score",
      value: `${(liquidityRatio * 100).toFixed(1)}% Listed`,
      details: [
        `On Sale: ${collectionData.on_sale_count}`,
        `Total Supply: ${collectionData.total_supply}`,
      ],
      icon: <Droplet />,
      variant:
        liquidityRatio < 0.05
          ? "Secure"
          : liquidityRatio < 0.15
          ? "Caution"
          : "Dangerous",
      riskScore: liquidityRatio < 0.05 ? 1 : liquidityRatio < 0.15 ? 2 : 3,
      volume: 0,
      activity: 0,
    },
    {
      title: "Floor Price Change",
      value: `Current: ${Number(collectionData.floor_price).toFixed(3)}`,
      details: [
        `24h: ${Number(collectionData.floor_price_change_24h).toFixed(3)}`,
        `7d: ${Number(collectionData.floor_price_change_7d).toFixed(3)}`,
        `30d: ${Number(collectionData.floor_price_change_30d).toFixed(3)}`,
      ],
      riskScore: 0,
      volume: 0,
      activity: 0,
      chart: <MiniFloorPriceChart data={floorPriceData} />,
    },
  ];

  const derivedSafetyScore =
    safetyScore ??
    calculateSafetyScore({
      rugPullRiskLevel: rugPullAnalysis?.risk_level,
      washTradingIndex: washTradingAnalysis?.washTradingIndex,
      whaleDumpPercent: rugPullAnalysis?.whale_drop_percent,
    });

  return (
    <div className="w-full py-8 lg:px-16 xl:px-24 mt-10">
      <div className="col-span-full bg-gradient-to-r from-[#1c1c3c] to-[#2a2a5a] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        {collectionData.image_url && (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden">
            <Image
              src={collectionData.image_url}
              alt={collectionData.name || "N/A"}
              fill
              priority={true}
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1 flex-col">
          <div className="flex-1 flex gap-3 text-white">
            <h2 className="text-2xl font-bold mb-2">{collectionData.name}</h2>
            <span
              className="text-md text-gray-300 font-mono opacity-70 flex items-center gap-1 cursor-pointer"
              onClick={copyToClipboard}
            >
              {shortenAddress(contractAddress)}
              {copied ? <FaCheck /> : <FaRegCopy />}
            </span>
          </div>
          <ul className="grid grid-cols-3 gap-2 text-sm opacity-80">
            <li className="bg-[#1c1c3c] shadow-md p-2 rounded-lg">
              Floor:{" "}
              <span className="text-purple-400 font-semibold">
                {Number(collectionData.floor_price).toFixed(3)}
              </span>
            </li>
            <li className="bg-[#1c1c3c] shadow-md p-2 rounded-lg">
              Top Bid: {collectionData.top_bid}
            </li>
            <li className="bg-[#1c1c3c] shadow-md p-2 rounded-lg">
              Owners: {collectionData.owner_count}
            </li>
            <li className="bg-[#1c1c3c] shadow-md p-2 rounded-lg">
              Supply: {collectionData.total_supply}
            </li>
            <li className="bg-[#1c1c3c] shadow-md p-2 rounded-lg">
              On Sale: {collectionData.on_sale_count}
            </li>
          </ul>
        </div>

        <div className="flex flex-col justify-center items-center">
          <p className="text-white text-lg font-semibold mb-2">Safety Score</p>
          <div className="relative w-20 h-20">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-700"
                fill="none"
                strokeWidth="4"
                stroke="currentColor"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                style={{
                  color:
                    riskLevel === "Low"
                      ? COLORS.secure
                      : riskLevel === "Medium"
                      ? COLORS.caution
                      : COLORS.dangerous,
                }}
                fill="none"
                strokeWidth="4"
                strokeDasharray={`${(derivedSafetyScore / 100) * 100}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
              {derivedSafetyScore}
            </div>
          </div>
          <span
            style={{
              backgroundColor:
                riskLevel === "Low"
                  ? COLORS.secure
                  : riskLevel === "Medium"
                  ? COLORS.caution
                  : COLORS.dangerous,
            }}
            className={`inline-block mt-3 text-xs px-4 py-1 rounded-full ${
              riskLevel === "Low"
                ? "text-green-100"
                : riskLevel === "Medium"
                ? "text-yellow-100"
                : "text-red-100"
            }`}
          >
            {riskLevel === "Low"
              ? "Secure"
              : riskLevel === "Medium"
              ? "Coution"
              : "Dangerous"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {cards.map((card, index) => (
          <ScanResultCard
            key={index}
            title={card.title}
            value={card.value}
            details={card.details}
            icon={card.icon}
            variant={card.variant}
            chart={card.chart}
          />
        ))}
      </div>

      {holderDistribution && (
        <HolderDistributionChart data={holderDistribution} />
      )}

      {/* Whale Stats Card */}
      {whaleActivityAnalysis && (
        <WhaleStatsDashboard stats={whaleActivityAnalysis.whaleStats} />
      )}
    </div>
  );
}
