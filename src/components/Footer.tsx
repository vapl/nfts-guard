import React from "react";
import { getNavLinks } from "@/constants/navLinks";
import SocialIcons from "./SocialIcons";
import Logo from "./logo/Logo";

const Footer = () => {
  const navLinks = getNavLinks();

  return (
    <footer className="px-6 max-w-7xl mx-auto text-white py-10 border-t-0">
      <div className="container mx-auto flex flex-col lg:flex-col items-center text-center gap-6">
        {/* 🌟 Galvenā sadaļa (lielā ekrāna rinda, mazā ekrāna kolonna) */}
        <div className="w-full flex flex-col lg:flex-row justify-between gap-6 items-center lg:gap-12">
          {/* 🔹 Logo */}
          <div className="flex items-center gap-2">
            <Logo textSize={20} size={40} />
          </div>

          {/* 🔹 Navigācijas linki */}
          <ul className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-md md:text-lg hover:text-purple-400"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* 🔹 Sociālo tīklu ikonas */}
          <div className="hidden lg:flex gap-6">
            <SocialIcons icons={["twitter", "discord"]} />
          </div>
        </div>

        {/* 🌟 Copyright vienmēr ir atsevišķā rindā */}
        <p className="text-gray-500 text-sm w-full text-center">
          &copy; {new Date().getFullYear()} NFTs Guard. All rights reserved.
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
