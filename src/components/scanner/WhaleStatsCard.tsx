import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import "react-calendar-heatmap/dist/styles.css";
import { WhaleStats } from "@/types/apiTypes/globalApiTypes";
import { DollarSign, User } from "lucide-react";
import { useMemo } from "react";

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

  const topWhaleData = stats.topWhale
    ? [
        {
          name: "ETH Spent",
          value: parseFloat(stats.topWhale.total_eth_spent.toFixed(2)),
        },
        {
          name: "Total Activity",
          value: stats.topWhale.total_activity,
        },
      ]
    : [];

  const radarData = [
    {
      metric: "ETH Spent",
      value: stats.topWhale?.total_eth_spent ?? 0,
    },
    {
      metric: "Activity",
      value: stats.topWhale?.total_activity ?? 0,
    },
    {
      metric: "Hold Time",
      value: stats.avgHoldTime ?? 0,
    },
    {
      metric: "Volatility",
      value: stats.avgVolatility ?? 0,
    },
  ];

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
    <div className="bg-[#1c1c3c] text-white p-6 rounded-2xl mt-6 shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <User size={20} /> Whale Statistics Overview
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          Total Whales:{" "}
          <span className="text-purple-400 font-semibold">
            {stats.totalWhales || "N/A"}
          </span>
        </div>
        <div>Total Buys: {stats.totalBuys || "N/A"}</div>
        <div>Total Sells: {stats.totalSells || "N/A"}</div>
        <div>Total Transfers: {stats.totalTransfers || "N/A"}</div>
        <div>Total ETH Spent: {stats.totalEthSpent || "N/A"}</div>
        <div>Avg. Hold Time: {stats.avgHoldTime || "N/A"} days</div>
        <div>Avg. Volatility: {stats.avgVolatility || "N/A"}</div>
      </div>

      {stats.topWhale && (
        <div className="mt-4 border-t border-white/20 pt-4">
          <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
            <DollarSign size={16} /> Top Whale
          </h4>
          <p>
            Wallet:{" "}
            <span className="text-purple-400 font-mono">
              {stats.topWhale.wallet.slice(0, 6)}...
            </span>
          </p>
          <p>Type: {stats.topWhale.whale_type}</p>
          <p>ETH Spent: {stats.topWhale.total_eth_spent.toFixed(2)}</p>
          <p>Total Activity: {stats.topWhale.total_activity}</p>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {pieData.length > 0 && (
          <div className="bg-gradient-to-br from-[#1e1e3f] to-[#12122c] p-6 rounded-2xl shadow hover:shadow-xl">
            <h4 className="text-sm font-semibold mb-4">
              Whale Type Distribution
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
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
          </div>
        )}

        {topWhaleData.length > 0 && (
          <div className="bg-gradient-to-br from-[#1e1e3f] to-[#12122c] p-6 rounded-2xl shadow hover:shadow-xl">
            <h4 className="text-sm font-semibold mb-4">Top Whale Stats</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topWhaleData} barSize={40}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="bg-gradient-to-br from-[#1e1e3f] to-[#12122c] p-6 rounded-2xl shadow hover:shadow-xl md:col-span-2">
          <h4 className="text-sm font-semibold mb-4">
            Top Whale Radar Profile
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} outerRadius={100}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey="metric" stroke="#ccc" />
              <PolarRadiusAxis stroke="#ccc" />
              <Radar
                name="Metrics"
                dataKey="value"
                stroke="#22d3ee"
                fill="#22d3ee"
                fillOpacity={0.4}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {timeSeriesData.length > 0 && (
          <div className="bg-gradient-to-br from-[#1e1e3f] to-[#12122c] p-6 rounded-2xl shadow hover:shadow-xl md:col-span-2">
            <h4 className="text-sm font-semibold mb-4">
              ETH Spending Over Time
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid stroke="#333" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
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
