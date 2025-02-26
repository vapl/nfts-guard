"use client";

import React, { useState } from "react";
import { ShieldCheck, TrendingUp, BarChart3 } from "lucide-react";
import FreeScanModal from "@/components/FreeScanResult";
import AuthModal from "@/components/modals/AuthModal";

const AboutPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Open Register modal
  const openRegisterModal = () => {
    setAuthMode("register");
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-6 pt-32 pb-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-center p-3 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
            Shield Against NFT Scams
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Verify NFT authenticity, secure investments, and gain peace of mind.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 rounded-lg"
          >
            Verify Free Now
          </button>
          {showModal && (
            <FreeScanModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onRegister={() => alert("Navigācija uz reģistrāciju")}
              onUpgrade={() => alert("Navigācija uz Premium")}
            />
          )}
        </section>

        {/* About Us */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">About NFTs Guard</h2>
          <p className="text-gray-300 leading-relaxed">
            NFTs Guard was created with one goal in mind: to protect NFT
            enthusiasts and traders from scams and fraudulent assets. Our
            platform provides real-time verification, smart contract analysis,
            and risk assessments, giving you confidence in your digital
            investments.
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Why Choose NFTs Guard?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Real-Time Verification",
                description:
                  "Instant checks to verify NFT authenticity and safety.",
              },
              {
                icon: TrendingUp,
                title: "High-Accuracy Scam Detection",
                description:
                  "Advanced algorithms ensure high accuracy in fraud detection.",
              },
              {
                icon: BarChart3,
                title: "Detailed Risk Assessment",
                description:
                  "Comprehensive analysis for each NFT and contract.",
              },
            ].map(({ icon: Icon, title, description }, index) => (
              <div key={index} className="bg-white/10 p-6 rounded-lg shadow-lg">
                <Icon size={32} className="text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              "Enter NFT Address",
              "Scan for Risks",
              "Get Results",
              "Take Action",
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white/10 p-6 rounded-lg text-center"
              >
                <h4 className="text-xl font-semibold mb-2">Step {index + 1}</h4>
                <p className="text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        {/* <section className="mb-16">
          <h2 className="text-4xl font-bold mb-6">What Our Users Say</h2>
          <div className="space-y-4">
            {[
              {
                name: "Sarah M.",
                feedback:
                  "NFTs Guard saved me from a $5,000 scam! Can't recommend it enough.",
              },
              {
                name: "John D.",
                feedback:
                  "Simple, fast, and reliable. A must-have for NFT collectors.",
              },
            ].map(({ name, feedback }, index) => (
              <div key={index} className="bg-white/10 p-6 rounded-lg">
                <p className="text-gray-300 italic">“{feedback}”</p>
                <p className="text-purple-400 mt-2">— {name}</p>
              </div>
            ))}
          </div>
        </section> */}

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-4xl font-bold mb-4">
            Protect Your NFTs Today! Avoid Scams Now.
          </h2>
          <p className="text-gray-300 mb-6">
            Start verifying NFTs today and avoid potential scams.
          </p>
          <button
            onClick={openRegisterModal}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 rounded-lg"
          >
            Verify Free Now
          </button>
        </section>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          authMode={authMode}
        />
      </div>
    </div>
  );
};

export default AboutPage;
