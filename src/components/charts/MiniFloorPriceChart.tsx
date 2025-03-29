"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DataPoint {
  time: string;
  price: number;
}

interface MiniFloorPriceChartProps {
  data: DataPoint[];
}

export const MiniFloorPriceChart: React.FC<MiniFloorPriceChartProps> = ({
  data,
}) => {
  return (
    <div className="w-full h-32 mt-4 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="time" stroke="#aaa" />
          <YAxis stroke="#aaa" domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1c1c3c", border: "none" }}
            labelStyle={{ color: "#ccc" }}
            itemStyle={{ color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#a855f7"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
