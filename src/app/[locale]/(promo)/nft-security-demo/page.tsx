"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Search, ShieldCheck } from "lucide-react";
import Image from "next/image";
import FAQSection from "@/components/FaqSection";
import NewsletterSection from "@/components/NewsLetterSection";
import Logo from "@/components/logo/Logo";
import SocialIcons from "@/components/SocialIcons";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "@/context/TranslationContext";

const benefits = [
  {
    icon: <ShieldCheck size={48} className="text-purple-400" />,
    title: "Rug Pull Detection",
    description:
      "Identify potential rug pulls before they happen and stay protected from scams.",
  },
  {
    icon: <Search size={48} className="text-purple-400" />,
    title: "Real-Time Verification",
    description:
      "Scan any NFT instantly to check for authenticity and contract vulnerabilities.",
  },
  {
    icon: <AlertTriangle size={48} className="text-purple-400" />,
    title: "Advanced Fraud Analysis",
    description:
      "AI-powered risk assessment ensures your investments are safe from malicious attacks.",
  },
];

const steps = [
  {
    step: "Step 1",
    title: "Upload NFT",
    description: "Upload your NFT for an in-depth analysis.",
    icon: "🔍",
  },
  {
    step: "Step 2",
    title: "AI Verification",
    description: "Our AI scans for plagiarism, scams, and price authenticity.",
    icon: "🤖",
  },
  {
    step: "Step 3",
    title: "Get Insights",
    description: "Receive a detailed report on the NFT's authenticity.",
    icon: "📊",
  },
];

interface nftData {
  name: string;
  description: string;
  owner: string;
  image?: string;
}

interface EmailRequest {
  email: string;
  nftData: nftData;
  contractAddress: string;
}

export default function HeroSection() {
  const { t } = useTranslations();
  const [nftInput, setNftInput] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<EmailRequest | null>(null);

  const handleScan = async () => {
    if (!nftInput.trim()) {
      alert("Please enter an NFT contract address or token ID");
      return;
    }

    // Extract contract address and token ID from input
    const contractAddress = nftInput.includes(":")
      ? nftInput.split(":")[0]
      : nftInput;
    const tokenId = nftInput.includes(":") ? nftInput.split(":")[1] : "1";
    const userEmail = "nftsguard@gmail.com"; // This should be dynamic in the future

    setIsScanning(true); // Show loading state
    setResult(null); // Reset previous result

    try {
      const response = await fetch("/api/check-nft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractAddress,
          tokenId,
          email: userEmail,
        }),
      });

      const data = await response.json();
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        setResult(data);

        const emailResponse = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            nftData: data,
          }),
        });

        const emailData = await emailResponse.json();
        console.log("Email API Response:", emailData);

        if (emailData.error) {
          alert("Email Error: " + emailData.error);
        } else {
          alert(
            "NFT verification and email sent successfully! Check your inbox."
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
    setIsScanning(false);
  };

  return (
    <>
      <LanguageSwitcher />
      <section
        id="hero"
        className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-white"
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute top-16 left-[0px] w-96 h-96 bg-purple-700 rounded-full filter blur-[120px] opacity-30"
          animate={{ scale: [0.5, 0.7, 0.5] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />

        {/* Main Content */}
        <div className="relative text-center md:px-16 max-w-4xl">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-purple-400">
              {t("landing.hero-section.title").split(" ")[0]}
            </span>{" "}
            {t("landing.hero-section.title").split(" ")[1]}{" "}
            <span className="text-purple-400">
              {t("landing.hero-section.title").split(" ")[2]}
            </span>{" "}
            {t("landing.hero-section.title").split(" ").slice(3).join(" ")}
          </motion.h1>

          <motion.p
            className="md:text-lg md:text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <strong>Launching soon!</strong> Try our{" "}
            <strong>FREE Demo Scan</strong> now and join the waitlist for full
            blockchain protection! Verify authenticity, detect scams instantly.
          </motion.p>

          {/* NFT Scan Input & Button */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <input
              type="text"
              placeholder="Enter NFT contract address or token ID"
              value={nftInput}
              onChange={(e) => setNftInput(e.target.value)}
              className="w-full sm:w-3/4 px-5 py-4 rounded-lg bg-[#1c1c3c] text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleScan}
              className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-bold px-8 py-4 rounded-lg shadow-lg text-lg transition transform hover:scale-105 text-nowrap"
            >
              {isScanning ? "Checking..." : "Try Demo Scan"}
            </button>
          </motion.div>
          {/* Display API response */}
          {result && (
            <div className="mt-8 bg-gray-900 p-4 rounded-lg text-white text-left">
              <h3 className="text-xl font-semibold">Verification Result</h3>
              <p>
                <strong>Contract Address:</strong> {result.contractAddress}
              </p>
              <p>
                <strong>NFT Name:</strong> {result.nftData.name}
              </p>
              <p>
                <strong>Description:</strong> {result.nftData.description}
              </p>
              <p>
                <strong>Owner:</strong> {result.nftData.owner}
              </p>
              {result.nftData.image && (
                <Image
                  src={result.nftData.image}
                  alt="NFT Image"
                  width={200}
                  height={200}
                  className="rounded-lg mt-4"
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Key benefits section */}
      <section
        id="benefits"
        className="relative w-full py-32 lg:px-16 xl:px-24 text-white"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Why Choose <span className="text-purple-400">NFTs Guard?</span>
          </h2>
          <p className="text-lg text-gray-400 mt-4">
            The most advanced NFT security platform with real-time blockchain
            analysis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center bg-[#1c1c3c] p-8 rounded-2xl shadow-lg"
            >
              {benefit.icon}
              <h3 className="text-2xl font-bold mt-4">{benefit.title}</h3>
              <p className="text-gray-400 mt-2">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How its works section */}
      <section className="relative w-full flex flex-col py-24 lg:px-16 xl:px-24 items-center justify-between text-center md:text-left">
        {/* Text Content */}
        <span className="bg-purple-700 bg-opacity-20 text-purple-400 text-sm px-4 py-1 rounded-full uppercase tracking-wider">
          How It Works
        </span>
        <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-12 mt-6">
          How <span className="text-purple-400">NFTs Guard</span> Works
        </h2>
        <div className="flex flex-col md:flex-row md:w-full gap-8">
          <div className="md:w-1/2">
            <div className="flex flex-col gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative bg-[#1c1c3c] rounded-lg p-8 shadow-lg text-white border border-purple-600 flex items-center gap-4"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.3 }}
                >
                  <div className="text-3xl">{step.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Animated Image */}
          <motion.div
            className="md:w-1/1 flex justify-center mt-12 md:mt-0"
            animate={isAnimating ? { x: [0, 12, 0], y: [0, -12, 0] } : {}}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            onMouseEnter={() => setIsAnimating(true)}
            onMouseLeave={() => setIsAnimating(false)}
          >
            <Image
              src="/image.png"
              alt="NFTs Guard Analysis"
              width={300}
              height={300}
              sizes="(max-width: 500px) 100vw (max-width: 500px) 50vw, 33vw"
              className="block mx-auto rounded-lg shadow-xl w-[300px] md:w-[400px] lg:w-[500px] max-w-full"
            />
          </motion.div>
        </div>
        <motion.button
          className="mt-12 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold text-lg rounded-lg shadow-lg hover:opacity-80 transition"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          Try Demo Scan Now
        </motion.button>
      </section>
      <FAQSection />
      <NewsletterSection
        headingText={
          <>
            Don’t Miss the <span className="text-purple-400">Launch!</span>
          </>
        }
        bodyText={
          <>
            Be the first to know when our NFT security platform goes live.{" "}
            <strong>No spam</strong> — just real updates.
          </>
        }
        ctaText="Join the Waitlist"
      />
      <footer className="flex flex-col md:flex-row justify-between items-center gap-6 w-full py-16 max-w-7xl mx-auto">
        <Logo />
        <SocialIcons icons={["twitter", "discord"]} />
      </footer>
    </>
  );
}
