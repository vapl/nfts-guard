import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const faqData = [
  {
    questions: [
      {
        question: "What is NFTs Guard?",
        answer:
          "NFTs Guard is an advanced security and authenticity verification platform for NFTs. We help users detect plagiarism, identify rug pulls, analyze market sentiment, and check for price manipulation using AI and blockchain data.",
      },
      {
        question: "How does NFTs Guard detect fake NFTs?",
        answer:
          "We use AI-powered image recognition and metadata analysis to compare NFTs against known collections on marketplaces like OpenSea, Rarible, and Magic Eden. Our system can detect duplicates, stolen artwork, and unauthorized reproductions.",
      },
    ],
  },
  {
    questions: [
      {
        question: "Can NFTs Guard protect me from rug pulls?",
        answer:
          "Yes! Our Rug Pull Alert System analyzes the liquidity lock status, developer wallet transactions, and NFT distribution to detect potential scams. If a collection has red flags, we warn users before they invest.",
      },
    ],
  },
  {
    questions: [
      {
        question: "How does sentiment analysis work in NFTs Guard?",
        answer:
          "We scan social media platforms like Twitter, Reddit, and Discord to analyze public sentiment around an NFT collection. Our AI categorizes discussions into positive, neutral, or negative, helping users identify hype-driven or suspicious projects.",
      },
    ],
  },
  {
    questions: [
      {
        question: "What is wash trading, and how does NFTs Guard detect it?",
        answer:
          "Wash trading occurs when traders artificially inflate the price of an NFT by repeatedly buying and selling it between their own wallets. NFTs Guard tracks wallet activity, transaction frequency, and suspicious trading patterns to flag manipulated prices.",
      },
    ],
  },
  {
    questions: [
      {
        question: "Is NFTs Guard free to use?",
        answer:
          "We offer a free plan with up to 3 daily scans. For more in-depth analysis, premium features, and unlimited scans, you can subscribe to our Standard (€15/month) or Pro (€40/month) plans.",
      },
      {
        question: "How accurate is NFTs Guard?",
        answer:
          "Our AI models continuously learn from real-time blockchain data, improving accuracy over time. While no system is 100% foolproof, our multi-layered verification process significantly reduces risks in NFT investments.",
      },
    ],
  },
  {
    questions: [
      {
        question: "Does NFTs Guard support all blockchains?",
        answer:
          "Currently, we support Ethereum, Solana, Binance Smart Chain (BSC), and Polygon. We are actively working on integrating more blockchains in the future.",
      },
    ],
  },
  {
    questions: [
      {
        question: "How can I report a suspicious NFT?",
        answer:
          "You can use our “Report NFT” feature to flag any suspicious NFT or collection. Our system will analyze it, and if it meets scam criteria, it will be added to our database.",
      },
    ],
  },
  {
    questions: [
      {
        question: "How do I get started?",
        answer:
          "Simply sign up for free, connect your wallet, and start scanning NFTs. Upgrade to a premium plan anytime for advanced security features.",
      },
    ],
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Apvieno visus jautājumus vienā masīvā
  const allFaqs = faqData.flatMap((item) => item.questions);

  // Sadalām masīvu divās kolonnās ar 5 jautājumiem katrā
  const firstColumn = allFaqs.slice(0, 5);
  const secondColumn = allFaqs.slice(5, 10);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full py-20 lg:px-16 xl:px-24 text-center">
      <span className="bg-purple-700 bg-opacity-20 text-purple-400 text-sm px-4 py-1 rounded-full uppercase tracking-wider">
        FAQ
      </span>
      <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-12 mt-6 max-w-3xl mx-auto">
        Frequently Asked <span className="text-purple-400">Questions</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {[firstColumn, secondColumn].map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-2">
            {column.map((faq, index) => {
              const globalIndex = colIndex * 5 + index;
              const isOpen = openIndex === globalIndex;
              return (
                <motion.div
                  key={globalIndex}
                  className="bg-[#1c1c3c] rounded-lg p-5 shadow-lg cursor-pointer"
                  onClick={() => toggleFAQ(globalIndex)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-md md:text-lg text-left max-w-[93%] font-semibold text-red">
                      {faq.question}
                    </h4>
                    <FaChevronDown
                      className={`text-purple-400 transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                  {isOpen && (
                    <motion.p
                      className="text-left text-gray-400 mt-2 text-sm md:text-base"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
