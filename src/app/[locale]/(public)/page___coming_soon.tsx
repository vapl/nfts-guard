"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Logo from "@/components/logo/Logo";
import SocialIcons from "@/components/SocialIcons";
import { supabase } from "@/lib/supabase/supabase";
import NetworkEffect from "@/components/NetworkEffect";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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

    const { error } = await supabase
      .from("subscribers")
      .insert([{ email, source: "coming_soon" }]);

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
      <div className="flex flex-col items-center justify-center h-screen max-w-screen text-center px-6">
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
          className="text-5xl md:text-6xl font-extrabold mb-4 relative z-10 text-heading"
        >
          Coming <span className="text-accent-purple">Soon</span>
        </motion.h1>

        {/* 🔥 Apakšvirsraksts */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-lg text-paragraph mb-6 max-w-lg relative z-10"
        >
          Spot NFT scams before they strike! NFTs Guard&apos;s advanced
          analytics are coming soon. Join the waitlist!
        </motion.p>

        {/* ✉️ E-pasta abonēšana */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8 }}
          className="flex flex-col items-center w-full max-w-md md:max-w-lg relative z-10"
        >
          <div className="relative z-10 flex flex-col md:flex-row gap-2 items-center bg-card p-2 rounded-lg w-full max-w-lg md:max-w-2xl drop-shadow-lg">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button label={"Notify Me"} onClick={handleSubscribe} />
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
          <p className="text-xs text-paragraph mt-2">
            By subscribing, you agree to our{" "}
            <Link href="/terms" className="text-purple-500 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-purple-500 hover:underline">
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
        <div className="absolute top-10 left-10 w-40 h-40 max-w-[40vw] max-h-[40vh] bg-purple-700 rounded-full filter blur-[80px] opacity-20 -z-0"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 max-w-[40vw] max-h-[40vh] bg-indigo-700 rounded-full filter blur-[80px] opacity-20 -z-0"></div>
      </div>
    </>
  );
}
