import React, { useState } from "react";
import Image from "next/image";

export default function NFTScanSection() {
  const [nftInput, setNftInput] = useState("");

  const handleScan = () => {
    if (nftInput.trim()) {
      alert(`Scanning NFT: ${nftInput}`);
    } else {
      alert("Please enter a valid NFT contract address or token ID.");
    }
  };

  return (
    <section className="w-full px-6 lg:px-16 xl:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* 🟣 Kreisa puse - Teksts un ievade */}
        <div className="animate-fadein">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Never Get <span className="text-purple-400">Scammed</span> Again
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10">
            Protect your NFTs from scams with real-time verification. Join early
            adopters for safety!
          </p>

          {/* 🟢 Ievades lauks un poga */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Enter NFT contract address or token ID"
              value={nftInput}
              onChange={(e) => setNftInput(e.target.value)}
              className="w-full sm:w-3/4 px-5 py-4 rounded-lg bg-[#1c1c3c] text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleScan}
              className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-bold px-8 py-4 rounded-lg shadow-lg text-lg text-nowrap transition"
            >
              Scan Now
            </button>
          </div>
        </div>

        {/* 🔵 Labā puse - NFT attēls */}
        <div className="relative z-0">
          <Image
            src="/image/hero-section/hero-image-right.jpg"
            alt="NFT Scan Preview"
            width={650}
            height={650}
            className="rounded-2xl shadow-xl z-0"
          />
        </div>
      </div>

      {/* 🟠 Fona dekorācijas */}
      <div className="absolute top-16 left-16 w-96 h-96 bg-purple-700 rounded-full filter blur-[120px] opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-700 rounded-full filter blur-[100px] opacity-30"></div>
    </section>
  );
}
