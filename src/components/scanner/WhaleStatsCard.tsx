import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import "react-calendar-heatmap/dist/styles.css";
import { WhaleStats } from "@/types/apiTypes/globalApiTypes";
import { useMemo } from "react";
import TooltipInfo from "../tooltips/TooltipInfo";
// import TopWhaleRadar from "../charts/TopWhaleRadar";

interface WhaleStatsDashboardProps {
  stats: WhaleStats;
}

const COLORS = ["#8b5cf6", "#f43f5e", "#22d3ee", "#f59e0b"];

export const WhaleStatsDashboard: React.FC<WhaleStatsDashboardProps> = ({
  stats,
}) => {
  const pieData = Object.entries(stats.typeCounts || {}).map(
    ([type, count]) => ({
      name: type,
      value: count,
    })
  );

  const timeSeriesData = useMemo(() => {
    if (!Array.isArray(stats.activityLog)) return [];
    return stats.activityLog.reduce((acc, tx) => {
      const date = tx.date.slice(0, 10);
      const existing = acc.find((d) => d.date === date);
      if (existing) {
        existing.eth += tx.eth;
      } else {
        acc.push({ date, eth: tx.eth });
      }
      return acc;
    }, [] as { date: string; eth: number }[]);
  }, [stats]);

  return (
    <div className="bg-card p-6 rounded-2xl mt-6 drop-shadow-lg">
      <div className="flex-1 flex gap-3">
        <h4 className="text-paragraph text-sm mb-1">
          Whale Statistics Overview
        </h4>

        <TooltipInfo content="This section provides a summary of trading activity by high-value NFT holders ('whales').It includes total buys, sells, transfers, ETH spent, average holding days, and portfolio volatility. Understanding whale behavior helps assess collection stability, accumulation patterns, and potential risks of price manipulation." />
      </div>
      <div className="text-2xl font-bold text-heading">
        Total{" "}
        {
          <span className="text-accent-purple font-bold">
            {stats.totalWhales || "N/A"}
          </span>
        }{" "}
        Whales
      </div>

      <ul className="flex flex-wrap mt-4 text-paragraph gap-5">
        <li className="flex flex-col justify-end">
          <span className="text-xs">Total Buys</span>
          <span className="text-md text-paragraph font-semibold">
            {stats.totalBuys || "N/A"}
          </span>
        </li>
        <li className="flex flex-col justify-end">
          <span className="text-xs text-nowrap">Total Sells</span>
          <span className="text-md text-paragraph font-semibold">
            {stats.totalSells || "N/A"}
          </span>
        </li>
        <li className="flex flex-col justify-end">
          <span className="text-xs text-nowrap">Total Transfers:</span>
          <span className="text-md text-paragraph font-semibold">
            {stats.totalTransfers || "N/A"}
          </span>
        </li>
        <li className="flex flex-col justify-end">
          <span className="text-xs text-nowrap">Total ETH Spent:</span>
          <span className="text-md text-paragraph font-semibold">
            {stats.totalEthSpent.toFixed(3) || "N/A"}
          </span>
        </li>
        <li className="flex flex-col justify-end">
          <span className="text-xs text-nowrap">Avg. Hold Days:</span>
          <span className="text-md text-paragraph font-semibold">
            {stats.avgHoldTime || "N/A"}
          </span>
        </li>
        <li className="flex flex-col justify-end">
          <span className="text-xs text-nowrap">Avg. Volatility:</span>
          <span className="text-md text-paragraph font-semibold">
            {stats.avgVolatility.toFixed(3) || "N/A"}
          </span>
        </li>
      </ul>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {pieData.length > 0 && (
          <div className="w-full lg:w-3/5 bg-card p-6 rounded-2xl border border-gray-400">
            <h4 className="text-sm font-semibold mb-4">
              Whale Type Distribution
            </h4>
            <div className="flex flex-col sm:flex-row items-center justify-center">
              <ResponsiveContainer width="80%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={false}
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-1 text-sm">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-paragraph font-medium">
                      {entry.name}:{" "}
                      {((entry.value / (stats.totalWhales || 1)) * 100).toFixed(
                        0
                      )}
                      %
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {timeSeriesData.length > 0 && (
          <div className="w-full lg:w-4/5 border border-gray-400  p-6 rounded-2xl">
            <h4 className="text-sm font-semibold mb-4">
              ETH Spending Over Time
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid stroke="rgb(var(--text-paragraph))" />
                <XAxis dataKey="date" stroke="rgb(var(--text-paragraph))" />
                <YAxis stroke="rgb(var(--text-paragraph))" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="eth"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
