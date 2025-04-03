import React, { useEffect, useState } from "react";
import { FaChevronCircleUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTop: React.FC<{ position?: "left" | "right" }> = ({
  position = "right",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      <div className="flex w-full">
        {isVisible && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-6 ${
              position === "right" ? "right-6" : "left-6"
            } cursor-pointer z-50`}
            aria-label="Scroll to top"
          >
            <FaChevronCircleUp
              size={38}
              className="text-text drop-shadow-lg opacity-70 hover:opacity-100: focus:outline-none"
            />
          </motion.button>
        )}
      </div>
    </AnimatePresence>
  );
};

export default ScrollToTop;
