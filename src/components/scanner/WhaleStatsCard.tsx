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

interface WhaleStatsDashboardProps {
  stats: WhaleStats;
  tooltipInfo?: string;
}

const COLORS = ["#8b5cf6", "#f43f5e", "#22d3ee", "#f59e0b"];

export const WhaleStatsDashboard: React.FC<WhaleStatsDashboardProps> = ({
  stats,
  tooltipInfo,
}) => {
  const pieData = useMemo(() => {
    return Object.entries(stats.typeCounts || {}).map(([type, count]) => ({
      name: type,
      value: count,
      percent:
        stats.typePercentages?.[type] !== undefined
          ? stats.typePercentages[type]
          : stats.totalWhales > 0
          ? (count / stats.totalWhales) * 100
          : 0,
    }));
  }, [stats]);

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
    <div className="relative bg-card p-6 rounded-2xl drop-shadow-lg">
      <div className="flex-1 flex gap-3">
        <h4 className="text-paragraph text-sm mb-1">
          Whale Statistics Overview
        </h4>
        <TooltipInfo content={tooltipInfo} />
      </div>
      <div className="text-2xl font-bold text-heading">
        Total{" "}
        <span className="text-accent-purple font-bold">
          {stats.totalWhales || "N/A"}
        </span>{" "}
        Whales
      </div>

      <ul className="flex flex-wrap mt-4 text-paragraph gap-5">
        {[
          { label: "Total Buys", value: stats.totalBuys },
          { label: "Total Sells", value: stats.totalSells },
          { label: "Total Transfers", value: stats.totalTransfers ?? "N/A" },
          {
            label: "Total ETH Spent:",
            value: stats.totalEthSpent?.toFixed(3) ?? "N/A",
          },
          {
            label: "Avg. Hold Days:",
            value: stats.avgHoldTime ?? "N/A",
          },
          {
            label: "Avg. Volatility:",
            value: stats.avgVolatility?.toFixed(3) ?? "N/A",
          },
        ].map(({ label, value }) => (
          <li key={label} className="flex flex-col justify-end">
            <span className="flex text-xs text-wrap pb-0.5 border-b-1 min-h-10 items-end border-gray-600">
              {label}
            </span>
            <span className="text-md text-paragraph font-semibold text-nowrap">
              {value}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col md:flex-row gap-3 mt-6 h-full">
        {pieData.length > 0 && (
          <div className="w-full md:w-2/5 bg-card p-6 rounded-2xl border border-gray-400 dark:border-gray-600">
            <h4 className="text-sm font-semibold mb-4">
              Whale Type Distribution
            </h4>
            <div className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={true}
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
              <div className="mt-4 space-y-1 text-xs">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span className="text-paragraph font-medium">
                      {entry.name}: {entry.percent.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {timeSeriesData.length > 0 && (
          <div className="flex flex-col gap-8 w-full md:w-4/5 border border-gray-400 dark:border-gray-600 p-6 rounded-2xl">
            <h4 className="text-sm font-semibold mb-4">
              ETH Spending Over Time
            </h4>
            <ResponsiveContainer width="100%" height={200} className="text-xs">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#aaa" />
                <XAxis dataKey="date" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip wrapperClassName="bg-card" />
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
