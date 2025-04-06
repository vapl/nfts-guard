"use client";

import React, { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { getNavLinks } from "@/constants/navLinks";
import SocialIcons from "./SocialIcons";
import Logo from "./logo/Logo";
import Button from "@/components/ui/Button";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import Badge from "./ui/Badge";

export default function Navbar() {
  const navLinks = getNavLinks();
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sideBarRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      sideBarRef.current &&
      !sideBarRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 512);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    <>
      <nav
        className={`fixed max-w-[2160px] w-full  ${
          isScrolled ? "bg-card drop-shadow-lg" : "bg-transparent"
        } overflow-hidden text-paragraph py-6 px-8 flex justify-between items-center z-50 transition duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div className="flex text-lg font-extrabold">
          <Link href={"/"}>
            <Logo textSize={!isMobile ? 22 : 18} size={!isMobile ? 38 : 30} />
          </Link>
          <div className="flex flex-1 items-start justify-start ml-2">
            <Badge name="beta" size="sm" className="text-[10px]" />
          </div>
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
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 cursor-pointer"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Join Now button */}
          {!isMobile && (
            <>
              <ThemeToggle />
              <Button
                label={isHovered ? "Coming Soon" : "Launch App"}
                onClick={() => {}}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="bg-transparent border-2 border-purple-500 hover:border-indigo-600 !py-2 !px-3.5 !rounded-full !bg-none !text-gray-800 dark:!text-gray-200"
              />
            </>
          )}
        </div>
      </nav>

      {/* Mobilais menu */}
      <div
        ref={sideBarRef}
        className={`fixed top-0 right-0 h-full w-[80%] sm:w-[60%] md:w-[50%] bg-card text-paragraph p-6 z-60 drop-shadow-lg transition-transform duration-300 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute top-6 left-6">
          <ThemeToggle />
        </div>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-8 right-6 cursor-pointer"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-center justify-between h-full">
          <ul className="flex flex-col items-center space-y-6 mt-16">
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
          <Button
            label={isHovered ? "Coming Soon" : "Launch App"}
            onClick={() => {}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-transparent border-2 border-purple-500 hover:border-indigo-600 !py-2 !px-3.5 !rounded-full !bg-none !text-gray-800 dark:!text-gray-200"
          />
          <div className="flex w-full p-6 justify-center self-end">
            <SocialIcons icons={["twitter", "discord"]} />
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
    </>
  );
}
