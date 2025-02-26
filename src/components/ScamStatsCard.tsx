import React from "react";
import { ShieldAlert, TrendingUp, BarChart3, Clock } from "lucide-react";

const ScamStatsBanner = () => {
  const stats = [
    {
      icon: <ShieldAlert size={32} className="text-red-500" />,
      title: "NFT Scams Detected",
      value: "12,500+",
      description: "in the past month",
    },
    {
      icon: <TrendingUp size={32} className="text-yellow-500" />,
      title: "Market Value Lost",
      value: "$25M+",
      description: "due to fraudulent NFTs",
    },
    {
      icon: <BarChart3 size={32} className="text-purple-400" />,
      title: "Risky Contracts",
      value: "8,300+",
      description: "flagged by our system",
    },
    {
      icon: <Clock size={32} className="text-blue-400" />,
      title: "Real-Time Protection",
      value: "24/7",
      description: "continuous monitoring",
    },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 py-12 border border-white/20 shadow-xl mb-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        Why You Need NFT Protection
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-black/20 p-6 rounded-lg border border-white/20"
          >
            {stat.icon}
            <h3 className="text-xl font-semibold mt-4">{stat.title}</h3>
            <p className="text-4xl font-bold mt-2">{stat.value}</p>
            <p className="text-sm text-gray-300 mt-1">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScamStatsBanner;
