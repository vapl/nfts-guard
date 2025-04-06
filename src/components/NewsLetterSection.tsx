"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/Input";
import Button from "./ui/Button";
import { supabase } from "@/lib/supabase/supabase";
import { MdEmail } from "react-icons/md";
import { getValidationError } from "@/utils/validation";

interface NewsletterProps {
  headingText?: React.ReactNode;
  bodyText?: React.ReactNode;
  ctaText?: string;
}

const NewsletterSection: React.FC<NewsletterProps> = ({
  headingText = "Get Newsletter",
  bodyText = "Get updated with news, tips & tricks",
  ctaText = "Subscribe",
}) => {
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
    const error = getValidationError("email", email, undefined, true);
    if (error) {
      setMessage(error);
      setMessageType("error");
      clearMessageAfterDealay();
      return;
    }

    const { error: dbError } = await supabase
      .from("subscribers")
      .insert([{ email, source: "coming_soon" }]);

    if (dbError) {
      setMessage("This email is already subscribed!");
      setMessageType("error");
      setEmail("");
      clearMessageAfterDealay();
      return;
    }

    try {
      const response = await fetch("/api/subscribeEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, source: "landing_page" }),
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
    <section
      className="
        relative 
        flex 
        flex-col 
        items-center 
        justify-center
        px-6 
        md:px-12 
        text-text
        rounded-xl
        max-w-7xl
        w-auto
        mx-auto
        pt-48
      "
    >
      <motion.div
        className="text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-6xl text-heading font-extrabold mb-4">
          {headingText}
        </h2>
        <p className="text-lg text-paragraph">{bodyText}</p>
      </motion.div>

      <motion.div
        className="
          flex 
          flex-col 
          items-center 
          gap-4 
          mt-8 
          w-full 
          max-w-xl
        "
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Input
          type="email"
          placeholder="Enter Your email"
          value={email}
          iconLeft={<MdEmail size={24} className="ml-2" />}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button label={ctaText} onClick={handleSubscribe} />
      </motion.div>
      {messageType && (
        <p
          className={`mt-2 text-sm font-medium ${
            messageType === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </section>
  );
};

export default NewsletterSection;
