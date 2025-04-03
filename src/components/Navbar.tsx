"use client";

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { getNavLinks } from "@/constants/navLinks";
import SocialIcons from "./SocialIcons";
import Logo from "./logo/Logo";
import Button from "@/components/ui/Button";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

export default function Navbar() {
  const navLinks = getNavLinks();
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsClient(true);
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

  if (!isClient) return null;

  return (
    <nav
      className={`fixed w-full  ${
        isScrolled && !isMenuOpen ? "bg-card drop-shadow-lg" : "bg-transparent"
      } text-paragraph py-7 px-8 flex justify-between items-center z-50 transition duration-300 ease-in-out`}
    >
      {/* Logo */}
      <div className="text-lg font-extrabold flex items-center">
        <Link href={"/"}>
          <Logo textSize={20} size={40} />
        </Link>
      </div>

      {/* Navigācija */}
      <ul className="hidden lg:flex space-x-8">
        {navLinks.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              className="text-lg text-paragraph hover:text-primary transition duration-300"
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

        <ThemeToggle />

        {/* Join Now poga */}
        <Button
          label={isHovered ? "Coming Soon" : "Lounch App"}
          onClick={() => {}}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-transparent border-2 border-purple-500 hover:border-indigo-600 !py-2 !px-3.5 !rounded-full !bg-none !text-gray-800 dark:!text-gray-200"
        />
      </div>

      {/* Mobilais menu */}
      {isMenuOpen && (
        <div className="fixed top-0 right-0 w-2/3 h-full bg-background-dark text-paragraph p-6 z-50 shadow-lg transition-transform transform">
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
