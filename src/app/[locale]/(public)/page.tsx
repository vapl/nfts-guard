"use client";

import React, { useState } from "react";
import ScamStatsBanner from "@/components/ScamStatsCard";
import AuthModal from "@/components/modals/AuthModal";
import { Clock, Shield, Zap } from "lucide-react";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import FAQSection from "@/components/FaqSection";
// import { useTranslations } from "@/context/TranslationContext";

const MainPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  // const { t } = useTranslations();

  // Open Register modal
  const openRegisterModal = () => {
    setAuthMode("register");
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-to-br from-gradientStart via-gradientMid to-gradientEnd text-foreground pt-20">
      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-0 md:px-6 pt-16 pb-16">
        {/* Hero Section */}
        <HeroSection />

        {/* About section */}
        <AboutSection />

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          {[
            {
              icon: Clock,
              title: "Real-Time Analysis",
              desc: "Instant security checks within seconds.",
            },
            {
              icon: Shield,
              title: "98% Scam Detection",
              desc: "Advanced blockchain scanning algorithms.",
            },
            {
              icon: Zap,
              title: "In-Depth Risk Assessment",
              desc: "Detailed safety review for each NFT.",
            },
          ].map(({ icon: Icon, title, desc }, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-4 border border-border shadow-md"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="text-purple-500" size={24} />
                <span className="text-lg font-semibold">{title}</span>
              </div>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        {/* SCAM stats */}
        <ScamStatsBanner />
        <FAQSection />

        {/* Call to Action */}
        <div className="text-center py-10">
          <h2 className="text-4xl font-extrabold mb-4">
            Don’t Risk Your NFTs! Verify Before You Buy!
          </h2>
          <p className="text-muted-foreground mb-6">
            Check up to 3 NFTs daily for free. Upgrade to Premium for €5/month
            and get unlimited checks + alerts!
          </p>
          <button
            onClick={openRegisterModal}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 rounded-lg transition-all duration-200"
          >
            Start Free Scans
          </button>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          authMode={authMode}
        />
      </main>
    </div>
  );
};

export default MainPage;
