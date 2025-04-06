import { ShieldCheck, Search } from "lucide-react";
import { GiSpeedometer } from "react-icons/gi";
import { LuBrainCircuit } from "react-icons/lu";

export const benefits = [
  {
    icon: <ShieldCheck size={48} className="text-accent-purple" />,
    title: "Rug Pull & Scam Detection",
    description:
      "Detect high-risk collections by analyzing whale behavior, unusual sell activity, and on-chain anomalies — before a rug pull strikes.",
  },
  {
    icon: <LuBrainCircuit size={48} className="text-accent-purple" />,
    title: "AI-Powered Analysis",
    description:
      "Get smart AI summaries that explain whale moves, trading risks, and key collection signals — in seconds.",
  },
  {
    icon: <Search size={48} className="text-accent-purple" />,
    title: "Deep NFT Intelligence",
    description:
      "Uncover suspicious trading, wallet manipulation, liquidity gaps, and holder concentration across any NFT collection in seconds.",
  },
  {
    icon: <GiSpeedometer size={48} className="text-accent-purple" />,
    title: "Risk Score",
    description:
      "A clear risk indicator that summarizes on-chain threats like wash trading, liquidity issues, and whale behavior — at a glance.",
  },
];
