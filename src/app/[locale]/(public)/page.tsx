"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Logo from "@/components/logo/Logo";
import SocialIcons from "@/components/SocialIcons";
import { supabase } from "@/lib/supabase";
import NetworkEffect from "@/components/NetworkEffect";
import Link from "next/link";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const clearMessageAfterDealay = () => {
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter a valid email.");
      setMessageType("error");
      clearMessageAfterDealay();
      return;
    }

    if (!validateEmail(email)) {
      setMessage("Invalid email format. Please enter a valid email.");
      setMessageType("error");
      clearMessageAfterDealay();
      return;
    }

    const { error } = await supabase.from("subscribers").insert([{ email }]);

    if (error) {
      setMessage("This email is already subscribed!");
      setMessageType("error");
      setEmail("");
      clearMessageAfterDealay();
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      const maskEmail = (email: string): string => {
        const [name, domain] = email.split("@");
        return `${name[0]}***@${domain.slice(0, 2)}***.${domain
          .split(".")
          .pop()}`;
      };

      if (response.ok) {
        setMessage(
          `Thank you for subscribing! A confirmation email has been sent to ${maskEmail(
            email
          )}.`
        );
        setMessageType("success");
      } else {
        setMessage("Subscription successful, but email could not be sent.");
        setMessageType("error");
        console.error("Email send error:", result.error);
      }
    } catch (error) {
      setMessage("An error occurred while sending the confirmation email.");
      setMessageType("error");
      console.error("Error:", error);
    }

    setEmail("");
    clearMessageAfterDealay();
  };

  return (
    <>
      <NetworkEffect />
      <div className="overflow-hidden flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white text-center px-6">
        {/* 🔵 NFT Guard Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8 relative z-10"
        >
          <Logo />
        </motion.div>

        {/* 🟣 "Coming Soon" Virsraksts */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="text-5xl md:text-6xl font-extrabold mb-4 relative z-10"
        >
          Coming <span className="text-purple-400">Soon</span>
        </motion.h1>

        {/* 🔥 Apakšvirsraksts */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-lg text-gray-300 mb-6 max-w-lg relative z-10"
        >
          Protect your NFTs like never before! Our advanced security system will
          be launching soon. Stay updated!
        </motion.p>

        {/* ✉️ E-pasta abonēšana */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8 }}
          className="flex flex-col items-center w-full max-w-md sm:max-w-lg  relative z-10"
        >
          <div className="flex flex-col sm:flex-row gap-2 items-center bg-gray-800 p-2 rounded-lg w-full max-w-md sm:max-w-lg sm:gap-1">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow  w-full sm:w-3/4 px-4 py-3 bg-gray-900 text-white rounded-lg outline-none border border-gray-700 focus:border-purple-500 transition relative z-10"
            />
            <button
              onClick={handleSubscribe}
              className="bg-purple-500 hover:bg-purple-600 w-full sm:w-1/4 px-6 py-3 rounded-lg text-white font-semibold transition sm:ml-2 whitespace-nowrap relative z-10"
            >
              Notify Me
            </button>
          </div>
          {messageType && (
            <p
              className={`mt-2 text-sm font-medium ${
                messageType === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            By subscribing, you agree to our{" "}
            <Link href="en/terms" className="text-purple-400 hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-purple-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>

        {/* 🔗 Sociālie tīkli */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2 }}
          className="flex gap-6 mt-12 relative z-10"
        >
          <SocialIcons icons={["twitter", "discord"]} />
        </motion.div>

        {/* 🔵 Dekoratīvā gaisma */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-700 rounded-full filter blur-[100px] opacity-20 -z-0"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-700 rounded-full filter blur-[100px] opacity-20 -z-0"></div>
      </div>
    </>
  );
}
