"use client";

import React, { useState } from "react";
import { Menu, X, Shield } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Prices", href: "#prices" },
  { name: "Marketplaces", href: "#marketplaces" },
  { name: "FAQ", href: "#faq" },
  { name: "Blog", href: "#blog" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-background dark:bg-background-dark text-text dark:text-white py-7 px-8 flex justify-between items-center shadow-lg font-sans">
      {/* Logo */}
      <div className="text-lg font-extrabold flex items-center">
        <Shield size={24} className="mr-2 text-accent-purple" />
        <span className="text-white">NFTs Guard</span>
      </div>

      {/* Hamburger ikona */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navigācija */}
      <ul className="hidden md:flex space-x-8">
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

      {/* Join Now poga */}
      <div className="hidden md:block">
        <button className="relative bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6 py-2 rounded-full shadow-lg hover:opacity-80 transition">
          <span className="absolute inset-0 bg-black bg-opacity-20 rounded-full"></span>
          <span className="relative z-10">Join Now</span>
        </button>
      </div>

      {/* Mobilais menu */}
      {isMenuOpen && (
        <div className="fixed top-0 right-0 w-3/4 h-full bg-background-dark text-white p-6 z-50 shadow-lg transition-transform transform">
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
        </div>
      )}
    </nav>
  );
}
