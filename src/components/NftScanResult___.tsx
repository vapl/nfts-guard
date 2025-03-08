import React, { useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  AlertOctagon,
  Globe,
  MessageCircle,
  Clock,
} from "lucide-react";
import { NftData } from "@/types/___nftDataTypes";

interface NFTResultsProps {
  result: NftData;
}

const NFTResults: React.FC<NFTResultsProps> = ({ result }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 mt-8">
      <h3 className="text-3xl font-bold text-start pl-6">Scan Results</h3>
      <div className="p-6 rounded-xl shadow-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* NFT Image */}
          <div className="col-span-1">
            <Image
              width={300}
              height={300}
              src={result.image || "/images/placeholder.png"}
              alt={result.name}
              className="w-full h-48 object-cover rounded-lg border border-gray-700"
            />
          </div>

          {/* NFT Details */}
          <div className="col-span-2 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
              <h3 className="text-2xl font-bold">
                {result.name} #{result.tokenId}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.isVerifiedContract
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {result.isVerifiedContract ? "Official Contract" : "Unverified"}
              </span>
            </div>
            <p className="text-gray-400">Contract: {result.contract}</p>

            {/* Price & Rarity Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  label: "Current Price",
                  value: `${result.currentPrice} ETH`,
                  icon: <TrendingUp size={16} />,
                },
                {
                  label: "Last Sale",
                  value: `${result.lastSale} ETH`,
                  icon: <TrendingUp size={16} />,
                },
                {
                  label: "Collection Floor",
                  value: `${result.collectionFloor} ETH`,
                  icon: <TrendingUp size={16} />,
                },
                {
                  label: "Rarity Rank",
                  value: `#${result.rarityRank} / ${result.totalSupply}`,
                  icon: <TrendingUp size={16} />,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-black/40 p-3 rounded-lg text-center border border-white/10"
                >
                  {React.cloneElement(stat.icon, {
                    className: "text-gray-400",
                  })}
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Investment Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/40 p-3 rounded-lg text-center border border-white/10">
                <TrendingUp size={16} className="text-gray-400" />
                <p className="text-sm text-gray-400">ROI Potential</p>
                <p className="text-lg font-bold text-white">Medium</p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg text-center border border-white/10">
                <TrendingUp size={16} className="text-gray-400" />
                <p className="text-sm text-gray-400">Price Trend</p>
                <p className="text-lg font-bold text-white">+5% (7d)</p>
              </div>
            </div>

            {/* Warnings */}
            {result.washTradingRisk.level !== "Low" && (
              <div className="bg-yellow-600/20 p-3 rounded-lg">
                <AlertTriangle size={20} className="inline text-yellow-400" />{" "}
                <span className="text-white">
                  Wash Trading: {result.washTradingRisk.percentage} (
                  {result.washTradingRisk.detectedInTransactions} transactions)
                  - {result.washTradingRisk.reason}
                </span>
              </div>
            )}

            {result.rugPullRisk.level !== "Low" && (
              <div className="bg-red-600/20 p-3 rounded-lg">
                <AlertOctagon size={20} className="inline text-red-400" />{" "}
                <span className="text-white">
                  Rug Pull Risk: {result.rugPullRisk.level} -{" "}
                  {result.rugPullRisk.reason} (Last outflow:{" "}
                  {result.rugPullRisk.lastLargeOutflow})
                </span>
              </div>
            )}
            {result.hasHiddenFunctions && (
              <div className="bg-red-600/20 p-3 rounded-lg">
                <AlertOctagon size={20} className="inline text-red-400" />{" "}
                <span className="text-white">Hidden Functions Detected</span>
              </div>
            )}
            {result.suspiciousTransfers.detected && (
              <div className="bg-yellow-600/20 p-3 rounded-lg">
                <AlertTriangle size={20} className="inline text-yellow-400" />{" "}
                <span className="text-white">
                  Suspicious Transfers: {result.suspiciousTransfers.reason}
                </span>
              </div>
            )}
            {result.whaleHolders.suspiciousActivity.detected && (
              <div className="bg-yellow-600/20 p-3 rounded-lg">
                <AlertTriangle size={20} className="inline text-yellow-400" />{" "}
                <span className="text-white">
                  Whale Activity:{" "}
                  {result.whaleHolders.suspiciousActivity.reason}
                </span>
              </div>
            )}
            {result.anonymousCreators.detected && (
              <div className="bg-yellow-600/20 p-3 rounded-lg">
                <AlertTriangle size={20} className="inline text-yellow-400" />{" "}
                <span className="text-white">
                  Anonymous Creators: {result.anonymousCreators.reason}
                </span>
              </div>
            )}
            {result.userReports.count > 0 && (
              <div className="bg-red-600/20 p-3 rounded-lg">
                <AlertOctagon size={20} className="inline text-red-400" />{" "}
                <span className="text-white">
                  {result.userReports.count} Scam Reports (
                  {result.userReports.context})
                </span>
              </div>
            )}

            {/* Safety Score */}
            <div className="flex items-center gap-2 bg-gray-700 p-3 rounded-lg">
              {result.safetyScore.score >= 80 ? (
                <ShieldCheck className="text-green-400" size={20} />
              ) : (
                <AlertTriangle className="text-yellow-400" size={20} />
              )}
              <div>
                <p className="text-md">
                  Safety Score: <strong>{result.safetyScore.score}/100</strong>
                </p>
                <p className="text-sm text-gray-300">
                  {result.safetyScore.reason.map((r, index) => (
                    <span key={index}>
                      {r.factor}: {r.impact}
                      {index < result.safetyScore.reason.length - 1
                        ? " | "
                        : ""}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  label: "Contract Created",
                  value: result.contractCreationDate,
                  icon: <Clock size={16} />,
                },
                {
                  label: "First Sale",
                  value: result.firstSaleDate,
                  icon: <Clock size={16} />,
                },
                {
                  label: "Last Activity ",
                  value: result.lastActivity,
                  icon: <Clock size={16} />,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-black/40 p-3 rounded-lg text-center border border-white/10"
                >
                  {React.cloneElement(stat.icon, {
                    className: "text-gray-400",
                  })}
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Metadata Hosting */}
            <div className="bg-gray-700 p-3 rounded-lg">
              <FileCheck2 size={16} className="text-gray-300" />{" "}
              <span className="text-white">
                Metadata Hosting: {result.metadataHosting.provider} (
                {result.metadataHosting.securityRisk} risk)
              </span>
            </div>

            {/* Social Signals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 bg-black/40 p-3 rounded-lg border border-white/10">
                <Globe size={20} className="text-blue-400" />
                <p className="text-md">
                  <strong>{result.socialSignals.twitterFollowers}</strong>{" "}
                  Followers
                </p>
              </div>
              <div className="flex items-center gap-2 bg-black/40 p-3 rounded-lg border border-white/10">
                <MessageCircle size={20} className="text-purple-400" />
                <p className="text-md">
                  <strong>{result.socialSignals.discordMembers}</strong> Members
                </p>
              </div>
              <div className="flex items-center gap-2 bg-black/40 p-3 rounded-lg border border-white/10">
                <Globe size={20} className="text-blue-400" />
                <p className="text-md">
                  <strong>{result.socialSignals.twitterEngagement}</strong>
                </p>
              </div>
            </div>

            {/* Show Full Report Button */}
            {!showDetails && (
              <button
                onClick={() => setShowDetails(true)}
                className="mt-4 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 text-white"
              >
                Show Full Report
              </button>
            )}
            {showDetails && (
              <div className="mt-4 space-y-4 transition-all duration-300 ease-in-out">
                <button
                  onClick={() => setShowDetails(false)}
                  className="bg-gray-500 px-4 py-2 rounded-lg hover:bg-gray-600 text-white"
                >
                  Hide Details
                </button>
                {/* Detailed Safety Analysis */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-lg font-bold mb-2 text-white">
                    Detailed Safety Analysis
                  </h4>
                  <p className="text-gray-300">
                    <strong>Hidden Functions:</strong>{" "}
                    {result.hasHiddenFunctions
                      ? "Yes, detected in contract"
                      : "None detected"}
                  </p>
                  <p className="text-gray-300">
                    <strong>Suspicious Transfers:</strong>{" "}
                    {result.suspiciousTransfers.detected
                      ? result.suspiciousTransfers.reason
                      : "None detected"}
                  </p>
                  <p className="text-gray-300">
                    <strong>Whale Activity:</strong>{" "}
                    {result.whaleHolders.suspiciousActivity.detected
                      ? result.whaleHolders.suspiciousActivity.reason
                      : "No suspicious activity"}
                  </p>
                  <p className="text-gray-300">
                    <strong>Anonymous Creators:</strong>{" "}
                    {result.anonymousCreators.detected
                      ? result.anonymousCreators.reason
                      : "Creators identified"}
                  </p>
                  <p className="text-gray-300">
                    <strong>Rug Pull Risk:</strong> {result.rugPullRisk.level} -{" "}
                    {result.rugPullRisk.reason} (Last outflow:{" "}
                    {result.rugPullRisk.lastLargeOutflow})
                  </p>
                  <p className="text-gray-300">
                    <strong>Wash Trading Risk:</strong>{" "}
                    {result.washTradingRisk.level} -{" "}
                    {result.washTradingRisk.percentage} (
                    {result.washTradingRisk.detectedInTransactions}{" "}
                    transactions) - {result.washTradingRisk.reason}
                  </p>
                  <p className="text-gray-300">
                    <strong>User Reports:</strong> {result.userReports.count} (
                    {result.userReports.context})
                  </p>
                </div>
                {/* Market Insights */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-lg font-bold mb-2 text-white">
                    Market Insights
                  </h4>
                  <p className="text-gray-300">
                    <strong>7-Day Sales Volume:</strong> {result.salesVolume7d}{" "}
                    ETH
                  </p>
                  <p className="text-gray-300">
                    <strong>Historical Trend:</strong> Data not available (to be
                    added with API)
                  </p>
                </div>
                {/* Social Signal Details */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-lg font-bold mb-2 text-white">
                    Social Signal Details
                  </h4>
                  <p className="text-gray-300">
                    <strong>Last Twitter Post:</strong> Not available (to be
                    added with API)
                  </p>
                  <p className="text-gray-300">
                    <strong>Discord Activity:</strong> Not available (to be
                    added with API)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTResults;
