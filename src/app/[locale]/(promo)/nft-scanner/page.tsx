"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck } from "lucide-react";
import { GiSpeedometer } from "react-icons/gi";
import Image from "next/image";
import FAQSection from "@/components/FaqSection";
import NewsletterSection from "@/components/NewsLetterSection";
import Logo from "@/components/logo/Logo";
import SocialIcons from "@/components/SocialIcons";
import { useTranslations } from "@/context/TranslationContext";
import ScannerPage from "@/components/scanner/ScannerPage";
import ThemeToggle from "@/components/ThemeToggle";
import { GoSearch } from "react-icons/go";
import { TbTopologyStar } from "react-icons/tb";
import { FaRegChartBar } from "react-icons/fa";
import Button from "@/components/ui/Button";
import ScrollToTop from "@/components/ui/ScrollToTop";

const benefits = [
  {
    icon: <ShieldCheck size={48} className="text-accent-purple" />,
    title: "Rug Pull & Scam Detection",
    description:
      "Spot potential rug pulls using real whale activity, selling patterns, and on-chain anomalies — before it's too late.",
  },
  {
    icon: <Search size={48} className="text-accent-purple" />,
    title: "Deep NFT Intelligence",
    description:
      "Get instant insights into wash trading, suspicious wallets, holder distribution and liquidity risks in any NFT collection.",
  },
  {
    icon: <GiSpeedometer size={48} className="text-accent-purple" />,
    title: "Safety Score",
    description:
      "Every NFT collection gets a Safety Score (0–100) based on objective risk signals — including rug pull indicators, wash trading, liquidity, and whale behavior. Transparent, easy to understand, and actionable.",
  },
];

const steps = [
  {
    step: "Step 1",
    title: "Check Your NFT",
    description: "Input your NFT’s address for on-chain verification.",
    icon: <GoSearch className="text-accent-purple" />,
  },
  {
    step: "Step 2",
    title: "Smart Contract Check",
    description: "We scan for scams, fakes, and market value risks.",
    icon: <TbTopologyStar className="text-accent-purple" />,
  },
  {
    step: "Step 3",
    title: "See the Full Report",
    description: "Get a detailed analysis of your NFT’s safety.",
    icon: <FaRegChartBar className="text-accent-purple" />,
  },
];

export default function HeroSection() {
  const { t } = useTranslations();
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <>
      <ScrollToTop position="right" />
      <div className="w-full flex justify-end">
        <ThemeToggle />
      </div>
      <ScrollToTop position="right" />

      <section
        id="hero"
        className="relative flex flex-col items-center justify-center mt-18"
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute top-16 left-[0px] w-96 h-96 bg-purple-700 opacity-10 dark:opacity-30 rounded-full filter blur-[120px]"
          animate={{ scale: [0.5, 0.7, 0.5] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />

        {/* Main Content */}
        <div className="relative text-center md:px-16 max-w-4xl">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold text-heading tracking-tight leading-tight mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-accent-purple">
              {t("landing.hero-section.title").split(" ")[0]}
            </span>{" "}
            {t("landing.hero-section.title").split(" ")[1]}{" "}
            <span className="text-accent-purple">
              {t("landing.hero-section.title").split(" ")[2]}
            </span>{" "}
            {t("landing.hero-section.title").split(" ").slice(3).join(" ")}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-paragraph mb-8"
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
          ></motion.div>
          {/* Display API response */}
        </div>
        <ScannerPage />
      </section>

      {/* Key benefits section */}
      <section
        id="benefits"
        className="relative w-full py-32 lg:px-16 xl:px-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold leading-tight text-heading">
            Why <span className="text-accent-purple">NFTs Guard?</span> is{" "}
            <span className="text-accent-purple">Trusted</span> by Investors
          </h2>
          <p className="text-lg text-paragraph mt-4">
            Real-time blockchain insights that help you spot risks, detect
            fraud, and make confident NFT decisions.
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
              className="flex flex-col items-center text-center bg-card p-8 rounded-2xl drop-shadow-lg"
            >
              {benefit.icon}
              <h3 className="text-2xl font-bold text-heading mt-4">
                {benefit.title}
              </h3>
              <p className="text-paragraph mt-2">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How its works section */}
      <section className="relative w-full flex flex-col py-24 lg:px-16 xl:px-24 items-center justify-between text-center md:text-left">
        {/* Text Content */}
        <span className="bg-purple-700 bg-opacity-20 text-white text-sm px-4 py-1 rounded-full uppercase tracking-wider">
          How It Works
        </span>
        <h2 className="text-5xl md:text-7xl font-extrabold mb-12 mt-6">
          How <span className="text-accent-purple">NFTs Guard</span> Works
        </h2>
        <div className="flex flex-col justify-around items-center md:flex-row md:w-full gap-8 mt-16 mb-24">
          <div className="">
            <div className="flex flex-col gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative bg-card rounded-lg p-8 shadow-lg flex items-center gap-4"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.3 }}
                >
                  <div className="text-3xl">{step.icon}</div>
                  <div>
                    <h3 className="text-xl text-heading font-semibold mb-1">
                      {step.title}
                    </h3>
                    <p className="text-paragraph-400 text-sm">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Animated Image */}
          <motion.div
            className="relative flex justify-center mt-12 md:mt-0"
            animate={isAnimating ? { x: [0, 12, 0], y: [0, -12, 0] } : {}}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            onMouseEnter={() => setIsAnimating(true)}
            onMouseLeave={() => setIsAnimating(false)}
          >
            <Image
              src="/image/landing-page/how_it_works.webp"
              alt="NFTs Guard Analysis"
              width={300}
              height={300}
              sizes="(max-width: 500px) 100vw (max-width: 500px) 50vw, 33vw"
              className="block mx-auto rounded-[50px] drop-shadow-xl w-[300px] md:w-[500px] lg:w-[500px] max-w-full z-1"
            />
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 rounded-[50px] drop-shadow-xl w-[100%] max-w-[400px] md:max-w-[500px] lg:max-w-[500px] h-[100%] bg-purple-900 opacity-20 z-0 rotate-3" />
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 rounded-[50px] drop-shadow-xl w-[100%] max-w-[400px] md:max-w-[500px] lg:max-w-[500px] h-[100%] bg-purple-950 opacity-25 z-0 rotate-8" />
          </motion.div>
        </div>

        <Button
          label="Try Demo Scan Now"
          animate={true}
          onClick={() => {
            const section = document.getElementById("hero");
            section?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </section>

      <FAQSection />

      <NewsletterSection
        headingText={
          <>
            Don’t Miss the <span className="text-accent-purple">Launch!</span>
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
        <Logo color="auto" />
        <SocialIcons icons={["twitter", "discord"]} />
      </footer>
    </>
  );
}
