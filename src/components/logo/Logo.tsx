import React from "react";
import Image from "next/image";
import { Michroma } from "next/font/google";

// 🔹 Pievieno Michroma fontu ar Next.js Font API
const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
});

interface LogoProps {
  size?: number; // Logo izmērs (default: 48px)
  textSize?: number; // Teksta izmērs (default: 24px)
  color?: "white" | "black" | "purple" | "gradient"; // Atbalstītās krāsas
}

const Logo: React.FC<LogoProps> = ({
  size = 48,
  textSize = 24,
  color = "white",
}) => {
  // 🔹 Krāsu kartējums
  const colorVariants = {
    white: "text-white",
    black: "text-black",
    purple: "text-purple-400",
    gradient:
      "bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-transparent bg-clip-text",
  };

  return (
    <div className="flex items-center gap-3">
      {/* 🔹 Logo bilde */}
      <div className="relative flex items-center justify-center">
        <Image
          src="/image/logo/nfts-logo-image-white.svg"
          alt="NFTs Guard Logo"
          width={size}
          height={size}
          className="rounded-lg"
          style={{ filter: "invert(1)" }}
        />
        {/* Gradienta efekts aiz logo */}
        {color === "gradient" && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 blur-xl opacity-50 rounded-lg"></div>
        )}
      </div>

      {/* 🔹 Logo teksts ar Michroma fontu */}
      <span
        className={`${michroma.className} font-extrabold`}
        style={{ fontSize: `${textSize}px` }} // ✅ Pielāgo teksta izmēru dinamiski
      >
        <div className="flex flex-col m-0 p-0">
          <span className={colorVariants[color]}>NFTs</span>
          <span className={`text-sm p-0 m-0 ${colorVariants[color]}`}>
            GUARD
          </span>
        </div>
      </span>
    </div>
  );
};

export default Logo;
