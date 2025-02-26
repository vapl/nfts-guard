import React from "react";
import { Mail, Twitter, Instagram, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-purple-900 text-white py-10 border-t-0">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-purple-400" size={24} />
            <h2 className="text-xl font-bold">NFTs Guard</h2>
          </div>
          <p className="text-gray-400">
            Protecting your NFTs from scams with real-time verification and
            advanced blockchain analysis.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-purple-400">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                Premium
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Mail size={20} />
              <a
                href="mailto:support@nftguard.io"
                className="hover:text-purple-400"
              >
                support@nftguard.io
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Twitter size={20} />
              <a href="#" className="hover:text-purple-400">
                Twitter
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram size={20} />
              <a href="#" className="hover:text-purple-400">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500">
        &copy; {new Date().getFullYear()} NFTs Guard. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
