// Refaktors turpinās: izmanto fetchHolderDistribution helperi datu ielādei
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaRegCopy, FaCheck, FaDownload } from "react-icons/fa";
import { ScanResultCard } from "./ScannerResultCard";
import { WhaleStatsDashboard } from "./WhaleStatsCard";
import { HolderDistributionChart } from "../charts/HolderDistributionChart";
import SafetyScore from "../charts/SafetyScore";
import { ShareOnXButton } from "../ShareOnXButton";
import { AISummary } from "@/components/scanner/AISummaryCard";
import { calculateSafetyScore } from "@/lib/analysis/calculateSafetyScore";
import {
  fetchSectionExplanation,
  fetchScanSummary,
} from "@/lib/openai/fetchAIExplanation";
import { generateScanCards } from "@/components/scanner/generateScanCards";
import { fetchHolderDistribution } from "@/lib/fetch/fetchHolderDistribution";
import { ScannerResultsProps } from "@/types/apiTypes/globalApiTypes";
import { HolderDistribution } from "@/types/apiTypes/holderDistribution";
import { ScanSummaryInput } from "@/types/apiTypes/scanSummary";
import LoadingSummaryCardSkeleton from "../loadings/LoadingSummaryCardSceleton";
import { handleDownloadPDF } from "./ScannerResultsPdf";

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
  const [cardExplanations, setCardExplanations] = useState<{
    [key: string]: string;
  }>({});
  const [summary, setSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const derivedSafetyScore =
    safetyScore ??
    calculateSafetyScore({
      rugPullRiskLevel: rugPullAnalysis?.risk_level,
      washTradingIndex: washTradingAnalysis?.washTradingIndex,
      whaleDumpPercent: rugPullAnalysis?.whale_drop_percent,
    });

  const cards = useMemo(
    () =>
      generateScanCards({
        collectionData,
        rugPullAnalysis,
        washTradingAnalysis,
      }),
    [collectionData, rugPullAnalysis, washTradingAnalysis]
  );

  useEffect(() => {
    async function generateSummary() {
      const scanData: ScanSummaryInput = {
        contractAddress,
        safetyScore: derivedSafetyScore,
        washTradingIndex: washTradingAnalysis?.washTradingIndex ?? 0,
        rugPullRiskLevel: rugPullAnalysis?.risk_level ?? "N/A",
        whaleDumpPercent: rugPullAnalysis?.whale_drop_percent ?? 0,
        sellerBuyerRatio: parseFloat(
          rugPullAnalysis?.seller_to_buyer_ratio ?? "0"
        ),
        uniqueBuyers: rugPullAnalysis?.unique_buyers ?? 0,
        uniqueSellers: rugPullAnalysis?.unique_sellers ?? 0,
        liquidityScore: 0, // var aizvietot ar reālu aprēķinu, ja pieejams
        volatilityIndex: 0,
        volumeTotal: 0,
        holderDistribution: {
          whalesPercent: 0,
          decentralizationScore: 0,
        },
      };
      const result = await fetchScanSummary(scanData);
      setSummary(result);
    }
    generateSummary();
  }, [
    contractAddress,
    collectionData,
    washTradingAnalysis,
    rugPullAnalysis,
    whaleActivityAnalysis.whaleStats,
    derivedSafetyScore,
  ]);

  const whaleStats = whaleActivityAnalysis?.whaleStats;

  const explanationCards = useMemo(() => {
    const base = cards.map((card) => ({
      title: card.title,
      details: card.details,
    }));

    if (whaleStats) {
      base.push({
        title: "Whale Stats",
        details: [
          { label: "Total Whales", value: whaleStats.totalWhales.toString() },
          { label: "Total Buys", value: whaleStats.totalBuys.toString() },
          { label: "Total Sells", value: whaleStats.totalSells.toString() },
          {
            label: "Total Transfers",
            value: whaleStats.totalTransfers.toString(),
          },
          { label: "ETH Spent", value: whaleStats.totalEthSpent.toFixed(3) },
        ],
      });
    }

    if (holderDistribution) {
      base.push({
        title: "Holder Distribution",
        details: [
          { label: "Single NFT", value: holderDistribution["1"].toString() },
          { label: "2–5 NFTs", value: holderDistribution["2-5"].toString() },
          { label: "6–10 NFTs", value: holderDistribution["6-10"].toString() },
          { label: "11+ NFTs", value: holderDistribution["11+"].toString() },
          {
            label: "Total Holders",
            value: (collectionData.owner_count ?? 0).toString(),
          },
        ],
      });
    }

    return base;
  }, [cards, whaleStats, holderDistribution, collectionData.owner_count]);

  useEffect(() => {
    if (!holderDistribution) return;

    async function generateCardExplanations() {
      const result = await fetchSectionExplanation(
        explanationCards,
        contractAddress
      );
      if (result) {
        setCardExplanations(result);
      }
    }

    generateCardExplanations();
  }, [explanationCards, contractAddress, holderDistribution]);

  useEffect(() => {
    async function loadDistribution() {
      const data = await fetchHolderDistribution(contractAddress);
      setHolderDistribution(data);
    }
    loadDistribution();
  }, [contractAddress]);

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="scan-result-section"
      className="relative w-full py-8 px-3 lg:px-16 xl:px-24"
    >
      {/* Header + Safety Score */}
      <div>
        <button
          onClick={handleDownloadPDF}
          className="flex flex-1 place-self-end gap-2 text-blue-600 hover:text-blue-800 hover:underline px-4 py-2 underline cursor-pointer transition-colors duration-200"
        >
          <FaDownload />
          Download a PDF snapshot of this analysis
        </button>
      </div>
      <div className="flex flex-col bg-card rounded-xl p-6  sm:flex-row items-start sm:items-center justify-between gap-6 drop-shadow-lg">
        <div className="flex w-full sm:w-auto items-center justify-between">
          {collectionData.image_url && (
            <div className="relative w-32 h-32 rounded-xl">
              <Image
                src={collectionData.image_url}
                alt={collectionData.name || "N/A"}
                fill
                priority
                className="object-cover rounded-xl"
              />
            </div>
          )}
          <div className="flex sm:hidden flex-col justify-center items-center">
            <SafetyScore score={derivedSafetyScore} riskLevel={riskLevel} />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex gap-0 mb-4 sm:gap-3 flex-col sm:flex-row">
            <h2 className="text-2xl font-bold text-heading">
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {cards.map((card, index) => (
          <ScanResultCard
            key={index}
            title={card.title}
            value={card.value}
            details={card.details}
            icon={card.icon}
            variant={card.variant}
            chart={card.chart}
            tooltipInfo={cardExplanations[card.title] || card.tooltipInfo}
          />
        ))}

        {holderDistribution && (
          <div className="md:col-span-2 xl:col-span-1">
            <HolderDistributionChart
              data={holderDistribution}
              totalHolders={collectionData.owner_count || 0}
              contractAddress={contractAddress}
              tooltipInfo={
                cardExplanations["Holder Distribution"] ||
                "Loading AI explanation..."
              }
            />
          </div>
        )}
        {/* Whale Stats */}
        <div className="xl:col-span-2 md:col-span-2">
          <WhaleStatsDashboard
            stats={whaleStats}
            tooltipInfo={
              cardExplanations["Whale Stats"] || "Loading AI explanation..."
            }
          />
        </div>
      </div>

      {/* AI Summary */}
      {!summary ? (
        <LoadingSummaryCardSkeleton />
      ) : (
        <AISummary summary={summary} />
      )}

      {/* Share block */}
      <div className="flex flex-col items-center justify-center mt-6 p-6 gap-3 text-heading">
        <h3>SHARE</h3>
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
    </div>
  );
}
