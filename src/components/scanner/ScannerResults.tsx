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
import SafetyScore from "../charts/SafetyScore";
import { ShareOnXButton } from "../ShareOnXButton";

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
    { time: "30d", price: Number(collectionData.floor_price_change_30d ?? 0) },
    { time: "7d", price: Number(collectionData.floor_price_change_7d ?? 0) },
    { time: "24h", price: Number(collectionData.floor_price_change_24h ?? 0) },
  ];

  const liquidityRatio =
    Number(collectionData.on_sale_count) / Number(collectionData.total_supply);

  const cards = [
    {
      title: "Rug Pull Risk",
      value: `${rugPullAnalysis?.risk_level ?? "N/A"}`,
      details: [
        {
          label: "Whale Drop",
          value: `${Number(rugPullAnalysis?.whale_drop_percent ?? 0).toFixed(
            2
          )}%`,
        },
        {
          label: "Seller/Buyer Ratio",
          value: rugPullAnalysis?.seller_to_buyer_ratio ?? "N/A",
        },
        {
          label: "Unique Sellers",
          value: rugPullAnalysis?.unique_sellers ?? "N/A",
        },
        {
          label: "Unique Buyers",
          value: rugPullAnalysis?.unique_buyers ?? "N/A",
        },
      ],
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
      tooltipInfo:
        "Indicates the risk of the collection experiencing a rug pull, assessed by analyzing the percentage of whales dumping NFTs, seller-to-buyer ratio, and activity from unique sellers and buyers.",
    },
    {
      title: "Wash Trading Index",
      value: `${(washTradingAnalysis?.washTradingIndex ?? 0).toFixed(1)}%`,
      details: [
        {
          label: "Suspicious Sales",
          value: washTradingAnalysis?.suspiciousSalesCount ?? 0,
        },
        {
          label: "Top Wallets",
          value: washTradingAnalysis?.topWallets?.length ?? 0,
        },
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
      tooltipInfo:
        "Represents the proportion of suspicious trades that could be wash trading, highlighting artificial inflation of sales. Includes the count of suspicious sales and top wallets involved.",
    },
    {
      title: "Volume & Sales",
      value: `${Number(collectionData.volume_all ?? 0).toFixed(2)} Ξ total`,
      details: [
        {
          label: "24h Volume",
          value: `${Number(collectionData.volume_1day ?? 0).toFixed(2)} Ξ`,
        },
        {
          label: "7d Volume",
          value: `${Number(collectionData.volume_7day ?? 0).toFixed(2)} Ξ`,
        },
        {
          label: "30d Volume",
          value: `${Number(collectionData.volume_30day ?? 0).toFixed(2)} Ξ`,
        },
        {
          label: "Sales Count",
          value: collectionData.sales_count ?? 0,
        },
      ],
      riskScore: 0,
      volume: collectionData.volume_all,
      activity: 0,
      tooltipInfo:
        "Summarizes the total volume traded and sales count, including recent volume metrics (24h, 7 days, 30 days). Useful for assessing market activity.",
    },
    {
      title: "Liquidity Score",
      value: `${(liquidityRatio * 100).toFixed(1)}% Listed`,
      details: [
        {
          label: "On Sale",
          value: collectionData.on_sale_count ?? 0,
        },
        {
          label: "Total Supply",
          value: collectionData.total_supply ?? 0,
        },
      ],
      icon: <Droplet />,
      variant:
        liquidityRatio < 0.1
          ? "Secure"
          : liquidityRatio < 0.3
          ? "Caution"
          : "Dangerous",
      riskScore: liquidityRatio < 0.1 ? 1 : liquidityRatio < 0.3 ? 2 : 3,
      volume: 0,
      activity: 0,
      tooltipInfo:
        "Indicates how many NFTs are currently listed for sale out of the total supply. Higher listing = more selling pressure. Lower listing = stronger holder confidence and better long-term potential.",
    },
    {
      title: "Floor Price Change",
      value: `Current: ${Number(collectionData.floor_price ?? 0).toFixed(3)} Ξ`,
      details: [
        {
          label: "24h",
          value: `${Number(collectionData.floor_price_change_24h ?? 0).toFixed(
            3
          )} Ξ`,
        },
        {
          label: "7d",
          value: `${Number(collectionData.floor_price_change_7d ?? 0).toFixed(
            3
          )} Ξ`,
        },
        {
          label: "30d",
          value: `${Number(collectionData.floor_price_change_30d ?? 0).toFixed(
            3
          )} Ξ`,
        },
      ],
      riskScore: 0,
      volume: 0,
      activity: 0,
      tooltipInfo:
        "Tracks recent fluctuations in the collection's lowest available price (floor price) over 24 hours, 7 days, and 30 days. Helpful in understanding short-term price trends.",
      chart: <MiniFloorPriceChart data={floorPriceData} />,
    },
    {
      title: "Volatility Score",
      value: `Index: ${collectionData.volatility_index?.toFixed(2) ?? "N/A"}`,
      details: [
        {
          label: "Risk Level",
          value: collectionData.volatility_risk_level ?? "N/A",
        },
      ],
      icon:
        collectionData.volatility_risk_level === "Low" ? (
          <ShieldCheck />
        ) : collectionData.volatility_risk_level === "Medium" ? (
          <ShieldQuestion />
        ) : (
          <AlertTriangle />
        ),
      variant: !collectionData.volatility_risk_level
        ? "No data"
        : collectionData.volatility_risk_level === "Low"
        ? "Secure"
        : collectionData.volatility_risk_level === "Medium"
        ? "Caution"
        : "Dangerous",

      riskScore:
        collectionData.volatility_risk_level === "Low"
          ? 1
          : collectionData.volatility_risk_level === "Medium"
          ? 2
          : 3,
      volume: 0,
      activity: 0,
      tooltipInfo:
        "Volatility measures how much the floor price fluctuates over time. Higher volatility may indicate market instability or speculative activity.",
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
      <div className="col-span-full bg-card rounded-xl p-6 relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 drop-shadow-lg">
        <div className="flex w-full sm:w-auto items-center justify-between">
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
          <div className="flex sm:hidden flex-col justify-center items-center">
            <SafetyScore score={derivedSafetyScore} riskLevel={riskLevel} />
          </div>
        </div>
        <div className="flex-1 flex-col">
          <div className="flex-1 flex gap-3">
            <h2 className="text-2xl font-bold mb-2 text-heading">
              {collectionData.name}
            </h2>
            <span
              className="text-md text-paragraph font-mono opacity-70 flex items-center gap-1 cursor-pointer"
              onClick={copyToClipboard}
            >
              {shortenAddress(contractAddress)}
              {copied ? <FaCheck /> : <FaRegCopy />}
            </span>
          </div>
          <ul className="grid grid-cols-3 gap-2 text-sm opacity-80">
            <li className="bg-card drop-shadow-lg p-2 rounded-lg border border-gray-300 dark:border-gray-700">
              Floor:{" "}
              <span className="font-semibold">
                {Number(collectionData.floor_price).toFixed(3)} Ξ
              </span>
            </li>
            <li className="bg-card drop-shadow-lg p-2 rounded-lg border border-gray-300 dark:border-gray-700">
              Top Bid:{" "}
              <span className="font-semibold">
                {collectionData.top_bid?.toFixed(3)} Ξ
              </span>
            </li>
            <li className="bg-card drop-shadow-lg p-2 rounded-lg border border-gray-300 dark:border-gray-700">
              Owners:{" "}
              <span className="font-semibold">
                {collectionData.owner_count}
              </span>
            </li>
            <li className="bg-card drop-shadow-lg p-2 rounded-lg border border-gray-300 dark:border-gray-700">
              Supply:{" "}
              <span className="font-semibold">
                {collectionData.total_supply}
              </span>
            </li>
            <li className="bg-card drop-shadow-lg p-2 rounded-lg border border-gray-300 dark:border-gray-700">
              On Sale:{" "}
              <span className="font-semibold">
                {collectionData.on_sale_count}
              </span>
            </li>
          </ul>
        </div>

        <div className="hidden sm:flex flex-col justify-center items-center">
          <SafetyScore score={derivedSafetyScore} riskLevel={riskLevel} />
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
            tooltipInfo={card.tooltipInfo}
          />
        ))}
        {holderDistribution && (
          <HolderDistributionChart
            data={holderDistribution}
            totalHolders={collectionData.owner_count || 0}
            contractAddress={contractAddress}
          />
        )}
      </div>

      {/* Whale Stats Card */}
      {whaleActivityAnalysis && (
        <WhaleStatsDashboard stats={whaleActivityAnalysis.whaleStats} />
      )}

      <ShareOnXButton
        collectionName={collectionData.name || "N/A"}
        safetyScore={derivedSafetyScore}
        riskLevel={riskLevel}
        washTrading={Number(
          washTradingAnalysis?.washTradingIndex.toFixed(2) ?? 0
        )}
        rugPullRisk={rugPullAnalysis?.risk_level ?? "N/A"}
        appUrl="https://nftsguard.com"
      />
    </div>
  );
}
