"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

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

  const handleSubscribe = () => {
    // Šeit var veikt formu validāciju un nosūtīt datus uz serveri, e-pastu sarakstu u.c.
    alert(`Subscribed with email: ${email}`);
    setEmail("");
  };

  return (
    <section
      className="
        relative 
        flex 
        flex-col 
        items-center 
        justify-center 
        py-16 
        px-6 
        md:px-12 
        text-white 
        bg-[#1c1c3c]/50
        rounded-xl
        max-w-7xl 
        w-auto
        mx-auto
        shadow-lg
      "
    >
      <motion.div
        className="text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-6xl font-extrabold mb-4">
          {headingText}
        </h2>
        <p className="text-lg text-gray-300">{bodyText}</p>
      </motion.div>

      <motion.div
        className="
          flex 
          flex-col 
          md:flex-row 
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
        <input
          type="email"
          placeholder="Your email"
          className="
            w-full 
            flex-1 
            px-5 
            py-3 
            rounded-lg 
            bg-[#2a2a4f] 
            text-white 
            text-base 
            focus:outline-none 
            focus:ring-2 
            focus:ring-purple-600
          "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleSubscribe}
          className="
            bg-gradient-to-r 
            from-purple-600 
            to-indigo-500 
            hover:from-purple-700 
            hover:to-indigo-600 
            text-white 
            font-semibold 
            px-6 
            py-3 
            rounded-lg 
            shadow-lg 
            text-base 
            transition 
            transform 
            hover:scale-105
          "
        >
          {ctaText}
        </button>
      </motion.div>
    </section>
  );
};

export default NewsletterSection;
