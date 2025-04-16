// Refactored helper with correct JSX usage and types
import { MiniFloorPriceChart } from "@/components/charts/MiniFloorPriceChart";
import {
  AlertTriangle,
  Droplet,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { ScannerResultsProps } from "@/types/apiTypes/globalApiTypes";

export function generateScanCards({
  collectionData,
  rugPullAnalysis,
  washTradingAnalysis,
}: Pick<
  ScannerResultsProps,
  "collectionData" | "rugPullAnalysis" | "washTradingAnalysis"
>) {
  const liquidityRatio =
    Number(collectionData.on_sale_count) / Number(collectionData.total_supply);

  const floorPriceData = [
    {
      time: "30d",
      price: Number(collectionData.floor_price_change_30d ?? 0),
    },
    { time: "7d", price: Number(collectionData.floor_price_change_7d ?? 0) },
    {
      time: "24h",
      price: Number(collectionData.floor_price_change_24h ?? 0),
    },
  ];

  return [
    {
      title: "Rug Pull Risk",
      value: `${rugPullAnalysis?.rug_pull_percent ?? 0}%`,
      details: [
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
        ) : rugPullAnalysis?.risk_level === "Uncertain" ? (
          <ShieldQuestion />
        ) : (
          <AlertTriangle />
        ),
      variant:
        rugPullAnalysis?.risk_level === "Low"
          ? "Secure"
          : rugPullAnalysis?.risk_level === "Medium"
          ? "Caution"
          : rugPullAnalysis?.risk_level === "Uncertain"
          ? "Neutral"
          : "Dangerous",
      riskScore:
        rugPullAnalysis?.risk_level === "Low"
          ? 1
          : rugPullAnalysis?.risk_level === "Medium"
          ? 2
          : rugPullAnalysis?.risk_level === "Uncertain"
          ? 0
          : 3,
      volume: 0,
      activity: 0,
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
        washTradingAnalysis?.analysis?.includes("Not enough") ||
        washTradingAnalysis?.analysis?.includes("Too few") ? (
          <ShieldQuestion />
        ) : washTradingAnalysis?.washTradingIndex > 50 ? (
          <AlertTriangle />
        ) : washTradingAnalysis?.washTradingIndex > 20 ? (
          <ShieldQuestion />
        ) : (
          <ShieldCheck />
        ),
      variant:
        washTradingAnalysis?.analysis?.includes("Not enough") ||
        washTradingAnalysis?.analysis?.includes("Too few")
          ? "Neutral"
          : washTradingAnalysis?.washTradingIndex > 50
          ? "Dangerous"
          : washTradingAnalysis?.washTradingIndex > 20
          ? "Suspicious"
          : "Secure",
      riskScore:
        washTradingAnalysis?.analysis?.includes("Not enough") ||
        washTradingAnalysis?.analysis?.includes("Too few")
          ? 0
          : washTradingAnalysis?.washTradingIndex < 1
          ? 1
          : 2,
      volume: 0,
      activity: 0,
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
        { label: "Sales Count", value: collectionData.sales_count ?? 0 },
      ],
      riskScore: 0,
      volume: collectionData.volume_all,
      activity: 0,
    },
    {
      title: "Liquidity Score",
      value: `${(liquidityRatio * 100).toFixed(1)}% Listed`,
      details: [
        { label: "On Sale", value: collectionData.on_sale_count ?? 0 },
        { label: "Total Supply", value: collectionData.total_supply ?? 0 },
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
    },
  ];
}
