"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import TooltipInfo from "../tooltips/TooltipInfo";
import { AiOutlineSafety } from "react-icons/ai";
import { LuShieldAlert } from "react-icons/lu";
import { GoShieldCheck } from "react-icons/go";
import { NFTCollectionOwnerProps } from "@/types/apiTypes/globalApiTypes";

interface HolderGroupData {
  "1": number;
  "2-5": number;
  "6-10": number;
  "11+": number;
}

interface HolderDistributionChartProps {
  data: HolderGroupData;
  totalHolders: number;
  contractAddress: string;
}

export function generateHolderDistributionData(
  owners: NFTCollectionOwnerProps[]
): HolderGroupData {
  const result: HolderGroupData = {
    "1": 0,
    "2-5": 0,
    "6-10": 0,
    "11+": 0,
  };

  for (const owner of owners) {
    const count = owner.token_count;
    if (count === 1) result["1"] += 1;
    else if (count >= 2 && count <= 5) result["2-5"] += 1;
    else if (count >= 6 && count <= 10) result["6-10"] += 1;
    else if (count >= 11) result["11+"] += 1;
  }

  return result;
}

export const HolderDistributionChart: React.FC<
  HolderDistributionChartProps
> = ({ data, totalHolders }) => {
  const chartData = [
    {
      range: "Single NFT",
      count: data["1"],
      fill: "#4ade80", // green
    },
    {
      range: "Small Holders (2–5)",
      count: data["2-5"],
      fill: "#60a5fa", // blue
    },
    {
      range: "Mid Holders (6–10)",
      count: data["6-10"],
      fill: "#c084fc", // purple
    },
    {
      range: "🐳 Whales (11+)",
      count: data["11+"],
      fill: "#f472b6", // pink
    },
  ];

  const whalePercentage = data["11+"] / totalHolders;
  const whalePercentText = `${(whalePercentage * 100).toFixed(1)}%`;

  const interpretation =
    data["1"] / totalHolders > 0.5 ? (
      <span className="flex items-center gap-2 text-sm text-paragraph">
        <GoShieldCheck size={32} className="text-success" />
        Most holders own only 1 NFT – this indicates healthy decentralization.
      </span>
    ) : whalePercentage > 0.25 ? (
      <span className="flex items-center gap-2 text-sm text-paragraph">
        <LuShieldAlert size={32} className="text-warning" />A large share of
        NFTs ({whalePercentText}) is held by whales – potential risk of price
        manipulation.
      </span>
    ) : (
      <span className="flex items-center gap-2 text-sm text-paragraph">
        <AiOutlineSafety size={32} className="text-accent" />
        The NFT distribution appears balanced. Whales hold about{" "}
        {whalePercentText} of total wallets.
      </span>
    );

  return (
    <div className="bg-card p-6 rounded-xl drop-shadow-lg w-full">
      <div className="flex-1 flex gap-3">
        <h4 className="text-paragraph text-sm mb-1">Holder Distribution</h4>
        <TooltipInfo content="Shows how many wallets hold different amounts of NFTs in this collection. Useful for identifying decentralization." />
      </div>

      <div className="text-2xl font-bold text-heading">{`Whales ${whalePercentText}`}</div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 30, bottom: 30 }}>
          <XAxis
            dataKey="range"
            stroke="rgb(var(--text-paragraph))"
            tick={{ fontSize: 12, textAnchor: "end" }}
            angle={-25}
          />
          <YAxis stroke="rgb(var(--text-paragraph))" />
          <Tooltip
            formatter={(value: number) => [`${value} wallets`, "Holders"]}
            labelFormatter={(label: string) => `Segment: ${label}`}
          />
          <Bar dataKey="count">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList
              dataKey="count"
              position="top"
              fill="rgb(var(--text-paragraph))"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="text-sm text-paragraph mt-6 italic">{interpretation}</p>
    </div>
  );
};
