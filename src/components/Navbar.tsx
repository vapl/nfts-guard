"use client";

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { getNavLinks } from "@/constants/navLinks";
import SocialIcons from "./SocialIcons";
import Logo from "./logo/Logo";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navLinks = getNavLinks();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full bg-background ${
        isScrolled && !isMenuOpen
          ? "dark:bg-background-dark drop-shadow-lg transition duration-300 ease-in-out"
          : "dark:bg-background-dark/50"
      } text-text dark:text-white py-7 px-8 flex justify-between items-center shadow-lg z-50`}
    >
      {/* Logo */}
      <div className="text-lg font-extrabold flex items-center">
        <Logo textSize={20} size={40} />
      </div>

      {/* Navigācija */}
      <ul className="hidden lg:flex space-x-8">
        {navLinks.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              className="text-lg text-white hover:text-primary transition duration-300"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex gap-6">
        {/* Hamburger ikona */}
        <div className="lg:hidden order-last">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Join Now poga */}
        <div className="lg:block">
          <button className="relative bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6 py-2 rounded-full shadow-lg hover:opacity-80 transition">
            <span className="absolute inset-0 bg-black bg-opacity-20 rounded-full"></span>
            <span className="relative z-10 text-nowrap">Join Now</span>
          </button>
        </div>
      </div>

      {/* Mobilais menu */}
      {isMenuOpen && (
        <div className="fixed top-0 right-0 w-2/3 h-full bg-background-dark text-white p-6 z-50 shadow-lg transition-transform transform">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4"
          >
            <X size={24} />
          </button>
          <ul className="flex flex-col space-y-6 mt-10">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="block hover:text-primary transition duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex w-full p-6 justify-center self-end">
            <SocialIcons icons={["twitter", "discord"]} />
          </div>
        </div>
      )}
    </nav>
  );
}
