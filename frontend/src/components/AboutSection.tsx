"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="w-full py-36 px-6 lg:px-16 xl:px-0">
      <div className="flex flex-col-reverse md:flex-row items-center gap-24">
        {/* 🔵 Kreisā puse - bilde ar dekorācijām */}
        <div className="relative flex justify-center basis-1/2">
          {/* ✅ Galvenā bilde */}
          <div className="relative w-[420px] h-[500px] bg-[#1c1c3c] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/images/nft-angel.png"
              alt="NFT Angel"
              layout="fill"
              objectFit="cover"
              className="rounded-3xl"
            />
          </div>
          {/* 🟣 Augšējais dekoratīvais attēls (kustība vertikāli) */}
          <motion.div
            animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -left-12 w-28 h-28 bg-white rounded-xl shadow-lg"
          >
            <Image
              src="/images/nft-avatar1.png"
              alt="NFT Avatar"
              width={100}
              height={100}
              className="rounded-xl"
            />
          </motion.div>

          {/* 🔵 Apakšējais dekoratīvais attēls (kustība horizontāli) */}
          <motion.div
            animate={{ x: [0, 10, 0], y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-4 -right-10 w-32 h-32 bg-white rounded-xl shadow-lg"
          >
            <Image
              src="/images/nft-avatar2.png"
              alt="NFT Avatar"
              width={120}
              height={120}
              className="rounded-xl"
            />
          </motion.div>

          {/* 🟠 Sīkākais apļveida dekoratīvais attēls (kustība abās asīs) */}
          <motion.div
            animate={{ x: [0, 8, 0], y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 left-6 w-12 h-12 bg-white rounded-xl shadow-lg"
          >
            <Image
              src="/images/nft-avatar3.png"
              alt="NFT Avatar"
              width={50}
              height={50}
              className="rounded-xl"
            />
          </motion.div>
        </div>

        {/* 🟢 Labā puse saturs */}
        <div className="text-white basis-1/2">
          <span className="bg-purple-700 bg-opacity-20 text-purple-400 text-sm px-4 py-1 rounded-full uppercase tracking-wider">
            Why NFTs Guard?
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mt-6">
            The Ultimate <span className="text-purple-400">NFT</span> Security
          </h2>
          <p className="text-lg text-gray-400 mt-6">
            NFTs Guard is the leading security platform for NFTs, offering
            real-time blockchain analysis, fraud detection, and wallet
            protection.
          </p>
          <p className="text-md text-gray-400 mt-4">
            Whether you are an NFT trader, collector, or investor, our system
            helps you verify smart contracts, detect vulnerabilities, and
            prevent scams, including rug pulls, before they happen.
          </p>
          <button className="mt-6 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold text-lg rounded-lg shadow-md hover:opacity-80 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
