import React from "react";
import { Michroma } from "next/font/google";
import { useTheme } from "next-themes";

// 🔹 Michroma fonts
const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
});

interface LogoProps {
  size?: number; // SVG izmērs
  textSize?: number; // Teksta izmērs
  color?: "white" | "black" | "purple" | "gradient" | "auto";
  label?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  size = 48,
  textSize = 24,
  color = "auto",
  label = true,
}) => {
  const { resolvedTheme } = useTheme();

  const autoColor =
    color === "auto" ? (resolvedTheme === "dark" ? "white" : "black") : color;

  const colorVariants = {
    white: "text-white fill-white",
    black: "text-black fill-black",
    purple: "text-purple-400 fill-purple-400",
    gradient:
      "text-transparent bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 bg-clip-text fill-current",
  };

  return (
    <div className="flex items-center gap-2">
      {/* 🔹 SVG Logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="10 8 480 480"
        preserveAspectRatio="xMidYMid meet"
        width={size}
        height={size}
        className={`${colorVariants[autoColor]} transition-all duration-300`}
      >
        <path d="M 42.734005,208.00001 H 456.73401 c 0,-22.16687 6.10114,-55.0329 -4.90509,-75 -9.14655,-16.59332 -30.51901,-24.37323 -46.09491,-33.603404 -35.15359,-20.83179 -70.50104,-41.440002 -106,-61.677459 -15.09146,-8.603425 -31.83389,-22.68982 -50,-22.68982 -18.16609,0 -34.90855,14.086395 -50,22.68982 -35.49896,20.237457 -70.84628,40.845609 -106.000002,61.677459 -15.575913,9.230174 -36.948363,17.010084 -46.094903,33.603404 -11.00621,19.96707 -4.9051,52.83313 -4.9051,75 m 367.000005,-47 H 89.734008 c 1.213981,-7.50714 10.996602,-10.72336 17.000002,-14.15045 16.39334,-9.35831 32.76079,-18.82972 49,-28.45295 22.23111,-13.17398 44.76921,-25.826204 67,-39.000004 6.73961,-3.99383 19.09969,-14.56018 27,-14.56018 8.19504,0 20.99115,11.03632 28,15.15277 23.26975,13.66681 46.55286,27.370584 70,40.729954 15.40537,8.77744 30.61865,17.88401 46,26.70215 5.82068,3.33701 14.82205,6.29456 16,13.57871 m -367.000005,96 v 72 c 0,13.15591 -1.59388,27.19311 5.4784,39 9.53,15.90997 30.175426,23.50937 45.521603,32.60339 35.153632,20.83179 70.501112,41.44 106.000002,61.67746 15.20157,8.66623 33.3523,24.25159 52,22.41821 16.34699,-1.60714 30.22119,-11.93045 44,-20.09567 23.54483,-13.95251 47.22073,-27.77392 71,-41.32254 19.077,-10.86941 38.13605,-21.84579 57,-33.08023 10.61475,-6.32162 21.86975,-11.91077 28.09491,-23.20062 6.56839,-11.91233 4.90509,-25.92398 4.90509,-39 v -71 h -207 v 47 h 120 29 c 3.15024,0.001 7.93369,-0.73703 9.97223,2.3179 1.71118,2.56436 1.02759,6.76514 1.02777,9.6821 4.6e-4,7.43301 2.99396,22.94464 -3.14813,28.21451 -8.98773,7.71139 -21.64597,12.80215 -31.85187,18.79629 -23.60001,13.86075 -47.21954,27.72077 -71,41.27005 -16.17438,9.21561 -34.21603,24.53623 -52,29.96219 -4.31488,1.31653 -8.47424,-2.36914 -12,-4.39273 -8.68442,-4.98438 -17.3969,-9.92734 -26,-15.05093 -30.13876,-17.94916 -60.57761,-35.48438 -91,-52.94907 -8.02348,-4.60605 -28.851603,-12.11701 -32.396609,-20.94367 -2.786041,-6.93692 -0.603393,-18.47323 -0.603393,-25.90664 v -58 z" />
      </svg>

      {/* 🔹 Teksts */}
      {label && (
        <span
          className={`${michroma.className} font-extrabold`}
          style={{ fontSize: `${textSize}px` }}
        >
          <div className="flex flex-col tracking-tight leading-none">
            <span
              className={`${colorVariants[autoColor]} leading-none`}
              style={{ fontSize: `${textSize}px` }}
            >
              NFTs
            </span>
            <span
              className={`${colorVariants[autoColor]} leading-none`}
              style={{ fontSize: `${(textSize * 19) / 27}px` }}
            >
              GUARD
            </span>
          </div>
        </span>
      )}
    </div>
  );
};

export default Logo;
