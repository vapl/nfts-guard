import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  label: string;
  style?: "primary" | "secondary";
  disabled?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
  className?: string;
  animate?: boolean;
  transition?: object;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
  label,
  style = "primary",
  disabled = false,
  isLoading = false,
  loadingLabel = "",
  className = "",
  animate = false,
  transition,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const baseClasses =
    "px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap z-10 flex items-center justify-center gap-2 active:scale-95";

  const styleClasses =
    style === "primary"
      ? "btn-gradient text-white"
      : "border border-gray-500 text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800";

  const disabledClasses =
    disabled || isLoading
      ? "cursor-not-allowed opacity-50 pointer-events-none"
      : "cursor-pointer";

  // ✅ Ja animate true, iestata noklusējuma animāciju
  const motionAnimate = animate ? { scale: [1, 1.05, 1] } : undefined;
  const motionTransition = animate
    ? transition || {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      }
    : undefined;

  return (
    <motion.button
      onClick={isLoading || disabled ? undefined : onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={isLoading}
      className={`${baseClasses} ${styleClasses} ${disabledClasses} ${className}`}
      animate={motionAnimate}
      transition={motionTransition}
    >
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {isLoading ? loadingLabel : label}
    </motion.button>
  );
};

export default Button;
