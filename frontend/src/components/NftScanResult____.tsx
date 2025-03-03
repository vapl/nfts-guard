import React from "react";
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

interface NftData {
  id: string;
  name: string;
  tokenId: string;
  image?: string;
  contract: string;
  isVerifiedContract: boolean; // ✅ Kontrakta autentifikācija (verificēts)

  hasHiddenFunctions: boolean; // ✅ Līguma analīze: vai ir slēptas funkcijas?

  currentPrice: number;
  lastSale: number;
  collectionFloor: number;
  rarityRank: number;
  totalSupply: number;
  salesVolume7d: number;

  safetyScore: {
    score: number; // ✅ Galvenais drošības vērtējums
    reason: { factor: string; impact: string }[]; // ✅ Paskaidrojums par drošības punktiem
  };

  ownersCount: number; // ✅ Unikālo īpašnieku skaits
  transactionCount: number; // ✅ Darījumu skaits
  transferCount: number; // ✅ NFT pārsūtīšanas biežums

  suspiciousTransfers: {
    detected: boolean; // ✅ Vai ir aizdomīgi darījumi?
    reason: string; // ✅ Kāpēc šie darījumi ir aizdomīgi?
  };

  whaleHolders: {
    percentage: number; // 🐋 % no NFT turētājiem, kas pieder lielajiem investoriem
    suspiciousActivity: {
      detected: boolean; // 🚨 Vai lielie turētāji nesen iztukšoja savas pozīcijas?
      reason: string; // ✅ Paskaidrojums
    };
  };

  anonymousCreators: {
    detected: boolean; // 🚨 Vai radītāji ir anonīmi?
    reason: string; // ✅ Paskaidrojums
  };

  rugPullRisk: {
    level: "Low" | "Medium" | "High"; // 🚨 Rug-pull riska līmenis
    reason: string; // ✅ Kāpēc šis risks pastāv?
    lastLargeOutflow: string; // 📅 Kad pēdējoreiz notika liels naudas aizplūdums?
  };

  washTradingRisk: {
    level: "Low" | "Medium" | "High"; // 🚨 Wash-trading riska līmenis
    percentage: string; // ✅ Procentuālais wash trading apjoms
    detectedInTransactions: number; // ✅ Cik wash trading transakcijas tika atrastas?
    reason: string; // ✅ Detalizēts skaidrojums
  };

  socialSignals: {
    twitterFollowers: number; // 📢 Twitter sekotāju skaits
    discordMembers: number; // 📢 Discord biedru skaits
    twitterEngagement: string; // 📢 Twitter aktivitātes līmenis (piem. 8% engagement)
  };

  contractCreationDate: string; // 📅 Kad tika izveidots viedlīgums?
  firstSaleDate: string; // 📅 Kad notika pirmais pārdošanas darījums?
  lastActivity: string; // 📅 Pēdējā reģistrētā aktivitāte?

  metadataHosting: {
    provider: string; // 📂 NFT metadatu mitinātājs (IPFS, Privāts serveris utt.)
    securityRisk: "Low" | "Medium" | "High"; // ✅ Vai centralizēts serveris rada risku?
  };

  userReports: {
    count: number; // 🚨 Scam reportu skaits
    context: string; // ✅ Laika periods, piemēram: "Last 30 days, user-submitted"
  };
}

interface NFTResultsProps {
  results: NftData[];
}

const NFTResults: React.FC<NFTResultsProps> = ({ results }) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-start">Scan Results</h3>
      {results.map((result) => (
        <div
          key={result.id}
          className="p-6 rounded-xl shadow-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* NFT Image */}
            <div className="col-span-2 md:col-span-1">
              <Image
                width={500}
                height={500}
                src={result.image || "/images/placeholder.png"}
                alt={result.name}
                className="w-full h-40 md:h-60 object-cover rounded-lg border border-gray-700"
              />
            </div>

            {/* NFT Details */}
            <div className="col-span-2 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                <h3 className="text-2xl font-bold">
                  {result.name} #{result.tokenId}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium text-nowrap ${
                    result.isVerifiedContract
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {result.isVerifiedContract
                    ? "Official Contract"
                    : "Unverified Contract"}
                </span>
              </div>
              <p className="text-gray-400">Contract: {result.contract}</p>

              {/* Price & Rarity Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    label: "Current Price",
                    value: `${result.currentPrice} ETH`,
                  },
                  { label: "Last Sale", value: `${result.lastSale} ETH` },
                  {
                    label: "Collection Floor",
                    value: `${result.collectionFloor} ETH`,
                  },
                  {
                    label: "Rarity Rank",
                    value: `#${result.rarityRank} / ${result.totalSupply}`,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-black/40 p-3 rounded-lg text-center border border-white/10"
                  >
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Rug Pull & Wash Trading Risks */}
              {result.washTradingRisk.level !== "Low" && (
                <div className="bg-yellow-600/20 p-3 rounded-lg text-yellow-400">
                  <AlertTriangle size={20} /> Wash Trading:{" "}
                  {result.washTradingRisk.percentage} detected in{" "}
                  {result.washTradingRisk.detectedInTransactions} transactions
                </div>
              )}
              {result.rugPullRisk.level !== "Low" && (
                <div className="bg-red-600/20 p-3 rounded-lg text-red-400">
                  <AlertOctagon size={20} /> Rug Pull Risk:{" "}
                  {result.rugPullRisk.level} - {result.rugPullRisk.reason}
                </div>
              )}

              {/* Safety Score */}
              <div className="flex items-center gap-2">
                {result.safetyScore.score >= 80 ? (
                  <ShieldCheck className="text-green-400" size={20} />
                ) : (
                  <AlertTriangle className="text-yellow-400" size={20} />
                )}
                <p className="text-md">
                  Safety Score: <strong>{result.safetyScore.score}/100</strong>
                  <br />
                  <span className="text-sm text-gray-400">
                    {result.safetyScore.reason.map((r) => (
                      <span key={r.factor}>
                        {r.factor}: {r.impact} |{" "}
                      </span>
                    ))}
                  </span>
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Contract Created",
                    value: result.contractCreationDate,
                  },
                  { label: "First Sale", value: result.firstSaleDate },
                  { label: "Last Activity", value: result.lastActivity },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-black/40 p-3 rounded-lg text-center border border-white/10"
                  >
                    <Clock size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Scam Reports */}
              {result.userReports.count > 0 && (
                <div className="bg-red-600/20 p-3 rounded-lg text-red-400">
                  <AlertOctagon size={20} /> {result.userReports.count} Scam
                  Reports ({result.userReports.context})
                </div>
              )}

              {/* Metadata Hosting */}
              <div className="bg-gray-700 p-3 rounded-lg text-white">
                <FileCheck2 size={16} /> Metadata Hosting:{" "}
                {result.metadataHosting.provider} (
                {result.metadataHosting.securityRisk} risk)
              </div>

              {/* Social Signals */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <Globe size={20} className="text-blue-400" />
                  <p className="text-md">
                    <strong>{result.socialSignals.twitterFollowers}</strong>{" "}
                    Twitter Followers
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} className="text-purple-400" />
                  <p className="text-md">
                    <strong>{result.socialSignals.discordMembers}</strong>{" "}
                    Discord Members
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NFTResults;
