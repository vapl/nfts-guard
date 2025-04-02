"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import AuthModal from "@/components/modals/AuthModal";
import ScrollToTop from "@/components/ui/ScrollToTop";

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Open Register modal
  const openRegisterModal = () => {
    setAuthMode("register");
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <ScrollToTop />
      <div className="container max-w-7xl mx-auto px-6 pt-32 pb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-6">
          Choose Your Plan
        </h1>
        <p className="text-center text-gray-300 mb-10">
          Protect NFTs with real-time detection. Start free or upgrade for
          unlimited protection!
        </p>

        {/* Free Scan Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl mb-10">
          <h2 className="text-3xl font-bold mb-4 text-purple-400">
            Try a Free NFT Scan
          </h2>
          <p className="text-gray-300 mb-6">
            Experience the power of NFT protection with one free scan. No
            registration required!
          </p>
          <button
            // onClick={handleFreeScan}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg"
          >
            Try Free Scan
          </button>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center bg-black/20 p-1 rounded-full">
            <button
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                billingCycle === "yearly"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400"
              }`}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly <span className="text-xs">(Save 20%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              Free Plan
            </h2>
            <p className="text-gray-300 mb-6">Basic NFT Protection</p>
            <p className="text-4xl font-bold mb-4">
              €0<span className="text-xl font-medium">/month</span>
            </p>
            <ul className="space-y-3 text-gray-300 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-400" size={20} /> 3 NFT scans
                per day
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-400" size={20} /> Basic scam
                detection
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="text-red-400" size={20} /> Real-time alerts
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="text-red-400" size={20} /> Unlimited scans
              </li>
            </ul>
            <button
              onClick={openRegisterModal}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg w-full"
            >
              Register for free
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-b from-purple-600 to-pink-600 rounded-2xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-3xl font-bold mb-4 text-white">Premium Plan</h2>
            <p className="text-gray-200 mb-6">Unlimited NFT Protection</p>
            <p className="text-4xl font-bold mb-4">
              {billingCycle === "monthly" ? "€5" : "€50"}
              <span className="text-xl font-medium">
                /{billingCycle === "monthly" ? "month" : "year"}
              </span>
            </p>
            <ul className="space-y-3 text-white mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-400" size={20} /> Unlimited
                NFT scans
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-400" size={20} /> Real-time
                scam detection
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-400" size={20} /> Instant
                alerts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-400" size={20} /> Priority
                support
              </li>
            </ul>
            <button
              onClick={openRegisterModal}
              className="bg-black hover:bg-gray-800 px-6 py-2 rounded-lg w-full"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4">
            Not sure which plan fits you?
          </h3>
          <p className="text-gray-400 mb-6">
            Start with the free plan and upgrade anytime!
          </p>
          <button
            onClick={openRegisterModal}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 rounded-lg transition-all duration-200"
          >
            Get Started Now
          </button>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          authMode={authMode}
        />
      </div>
    </div>
  );
};

export default PricingPage;
