"use client";

import React, { useEffect, useState } from "react";
import { getNavLinks } from "@/constants/navLinks";
import SocialIcons from "./SocialIcons";
import Logo from "./logo/Logo";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname();
  const navLinks = getNavLinks();
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="flex-1 text-paragraph py-12 mt-36 border-t-1 bg-card border-gray-300 dark:border-gray-800">
      <div className="px-6 max-w-7xl mx-auto flex flex-col lg:flex-col items-center text-center gap-6">
        {/* 🌟 Galvenā sadaļa (lielā ekrāna rinda, mazā ekrāna kolonna) */}
        <div className="w-full flex flex-col lg:flex-row justify-between gap-6 items-center lg:gap-12">
          {/* 🔹 Logo */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <Logo textSize={20} size={40} label={false} />
            </Link>
          </div>

          {/* 🔹 Navigācijas linki */}
          <ul className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-md md:text-lg transition hover:text-purple-400 hover:underline underline-offset-8 ${
                      isActive
                        ? "text-purple-500 underline underline-offset-8"
                        : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/privacy"
                className={`text-md md:text-lg transition hover:text-purple-400 hover:underline underline-offset-8 ${
                  pathname === "/privacy"
                    ? "text-purple-500 underline underline-offset-8"
                    : ""
                }`}
              >
                Privacy policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className={`text-md md:text-lg transition hover:text-purple-400 hover:underline underline-offset-8 ${
                  pathname === "/terms"
                    ? "text-purple-500 underline underline-offset-8"
                    : ""
                }`}
              >
                Terms & Conditions
              </Link>
            </li>
          </ul>

          {/* 🔹 Sociālo tīklu ikonas */}
          <div className="hidden lg:flex gap-6">
            <SocialIcons icons={["twitter", "discord"]} />
          </div>
        </div>

        {/* 🌟 Copyright vienmēr ir atsevišķā rindā */}
        <p className="text-gray-500 text-sm w-full text-center">
          &copy; {year} NFTs Guard. All rights reserved.
        </p>

        {/* 🟣 Sociālie tīkli apakšā tikai uz mazajiem ekrāniem */}
        <div className="lg:hidden flex">
          <SocialIcons icons={["twitter", "discord"]} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
