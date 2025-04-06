import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

export const faqData = [
  {
    questions: [
      {
        question: "What is NFTs Guard?",
        answer:
          "NFTs Guard is a Web3 security platform that helps NFT buyers identify risks like rug pulls, wash trading, and whale manipulation using on-chain data analytics and wallet behavior patterns.",
      },
      {
        question: "How does NFTs Guard detect fake NFTs?",
        answer:
          "This feature is currently in development. In the future, we plan to detect fake NFTs by analyzing image hashes and metadata to identify duplicates and unauthorized reuse.",
      },
    ],
  },
  {
    questions: [
      {
        question: "Can NFTs Guard protect me from rug pulls?",
        answer:
          "Yes. NFTs Guard analyzes wallet outflows, sudden whale exits, floor price drops, and NFT transfer anomalies to detect potential rug pull behavior. If the risk is high, the system alerts you instantly.",
      },
    ],
  },
  {
    questions: [
      {
        question: "How does sentiment analysis work in NFTs Guard?",
        answer:
          "This feature is coming soon. We plan to include social sentiment analysis by tracking community discussions on platforms like Twitter and Discord, helping users spot hype or negative trends early.",
      },
    ],
  },
  {
    questions: [
      {
        question: "What is wash trading, and how does NFTs Guard detect it?",
        answer:
          "Wash trading is when a user artificially inflates sales volume by trading NFTs between their own wallets. NFTs Guard detects it by analyzing same-wallet swaps, rapid back-and-forth trades, and frequent sales from single wallets.",
      },
    ],
  },
  {
    questions: [
      {
        question: "Is NFTs Guard free to use?",
        answer:
          "Yes. The free plan includes 5 scans per month. For power users, we offer a credit-based or subscription plan (e.g., €10 = 50 scans or monthly Pro for unlimited access).",
      },
      {
        question: "How accurate is NFTs Guard?",
        answer:
          "While no tool is 100% accurate, NFTs Guard combines multiple data sources and risk signals to provide a strong assessment. We continuously improve detection models based on new fraud patterns.",
      },
    ],
  },
  {
    questions: [
      {
        question: "Which blockchains are supported?",
        answer:
          "Currently, NFTs Guard analyzes NFT collections on Ethereum. We plan to add support for Solana, Polygon, and BNB Chain soon.",
      },
    ],
  },
  {
    questions: [
      {
        question: "How can I report a suspicious NFT?",
        answer:
          "Soon you'll be able to use our 'Report NFT' feature to flag suspicious collections. Meanwhile, feel free to contact us through our support page.",
      },
    ],
  },
  {
    questions: [
      {
        question: "How do I get started?",
        answer:
          "No sign-up needed. Just paste an NFT collection address or name and click 'Scan'. Connect your wallet later to unlock advanced features like saved scans and premium access.",
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
    <section className="relative w-full  px-4 lg:px-16 xl:px-24 text-center pt-36">
      <span className="bg-purple-700 bg-opacity-20 text-white text-sm px-4 py-1 rounded-full uppercase tracking-wider">
        FAQ
      </span>
      <h2 className="text-5xl md:text-7xl font-extrabold text-heading mb-12 mt-6 max-w-3xl mx-auto">
        Frequently Asked <span className="text-accent-purple">Questions</span>
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
                  className="bg-card rounded-lg p-5 drop-shadow-lg cursor-pointer"
                  onClick={() => toggleFAQ(globalIndex)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-md md:text-lg text-left max-w-[93%] font-semibold">
                      {faq.question}
                    </h4>
                    <FaChevronDown
                      className={`text-accent-purple transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                  {isOpen && (
                    <motion.p
                      className="text-left text-paragraph mt-2 text-sm md:text-base"
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
