import React from "react";

interface SafetyScoreProps {
  score: number;
  riskLevel: string;
}

const SafetyScore: React.FC<SafetyScoreProps> = ({ score, riskLevel }) => {
  const getColor = () => {
    switch (riskLevel) {
      case "Low":
        return "rgb(var(--success))";
      case "Medium":
        return "rgb(var(--warning))";
      case "High":
        return "rgb(var(--danger))";
      default:
        return "rgb(var(--text))";
    }
  };

  const getTextColor = () => {
    switch (riskLevel) {
      case "Low":
        return "text-green-100";
      case "Medium":
        return "text-yellow-100";
      case "High":
        return "text-red-100";
      default:
        return "text-gray-100";
    }
  };

  const getLabel = () => {
    switch (riskLevel) {
      case "Low":
        return "Secure";
      case "Medium":
        return "Caution";
      case "High":
        return "Dangerous";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-nowrap">
      <p className="text-heading text-lg font-semibold mb-2">Safety Score</p>
      <div className="relative w-20 h-20">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-paragraph"
            fill="none"
            strokeWidth="4"
            stroke="currentColor"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            style={{
              color: getColor(),
            }}
            fill="none"
            strokeWidth="4"
            strokeDasharray={`${(score / 100) * 100}, 100`}
            strokeLinecap="round"
            stroke="currentColor"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-heading text-lg font-bold">
          {score}
        </div>
      </div>
      <span
        style={{ backgroundColor: getColor() }}
        className={`inline-block mt-3 text-xs px-4 py-1 rounded-full ${getTextColor()}`}
      >
        {getLabel()}
      </span>
    </div>
  );
};

export default SafetyScore;
