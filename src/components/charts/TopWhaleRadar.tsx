import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface TopWhaleRadarProps {
  radarData: { metric: string; value: number }[];
}

const TopWhaleRadar: React.FC<TopWhaleRadarProps> = ({ radarData }) => {
  const [showRadar, setShowRadar] = useState(false);

  return (
    <div className="border border-gray-400 p-6 rounded-2xl shadow hover:shadow-xl">
      <div
        onClick={() => setShowRadar(!showRadar)}
        className="flex items-center justify-between cursor-pointer mb-2"
      >
        <h4 className="text-sm font-semibold">Top Whale Radar Profile</h4>
        {showRadar ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {showRadar && (
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData} outerRadius={100}>
            <PolarGrid stroke="rgb(var(--text-paragraph))" />
            <PolarAngleAxis
              dataKey="metric"
              stroke="rgb(var(--text-paragraph))"
            />
            <PolarRadiusAxis stroke="rgb(var(--text-paragraph))" />
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
      )}
    </div>
  );
};

export default TopWhaleRadar;
