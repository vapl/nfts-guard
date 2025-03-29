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

interface HolderDistributionChartProps {
  data: {
    "1": number;
    "2-5": number;
    "6-10": number;
    "11+": number;
  };
}

export const HolderDistributionChart: React.FC<
  HolderDistributionChartProps
> = ({ data }) => {
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

  const totalHolders = Object.values(data).reduce((sum, val) => sum + val, 0);

  const whalePercentage = data["11+"] / totalHolders;
  const whalePercentText = `${(whalePercentage * 100).toFixed(1)}%`;

  const interpretation =
    data["1"] / totalHolders > 0.5
      ? "✅ Most holders own only 1 NFT – this indicates healthy decentralization."
      : whalePercentage > 0.25
      ? `⚠️ A large share of NFTs (${whalePercentText}) is held by whales – potential risk of price manipulation.`
      : `ℹ️ The NFT distribution appears balanced. Whales hold about ${whalePercentText} of total wallets.`;

  return (
    <div className="bg-[#1c1c3c] p-6 rounded-2xl mt-6 shadow-md w-full">
      <h3 className="text-xl font-semibold mb-2 text-white">
        Holder Distribution
      </h3>
      <p className="text-sm text-white/60 mb-4">
        Shows how many wallets hold different amounts of NFTs in this
        collection. Useful for identifying decentralization.
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <XAxis dataKey="range" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            formatter={(value: number) => [`${value} wallets`, "Holders"]}
            labelFormatter={(label: string) => `Segment: ${label}`}
          />
          <Bar dataKey="count">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList dataKey="count" position="top" fill="#fff" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="text-sm text-white/70 mt-6 italic">{interpretation}</p>
    </div>
  );
};
