"use client";
import { motion } from "framer-motion";
import React from "react";

const Decoration = () => {
  return (
    <div>
      <motion.div
        animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -z-1 top-12 left-8 w-96 h-96 bg-purple-700 rounded-full blur-[120px] opacity-20"
      ></motion.div>
      <motion.div
        animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -z-1 bottom-8 right-8 w-80 h-80 bg-indigo-600 rounded-full blur-[120px] opacity-20"
      ></motion.div>
    </div>
  );
};

export default Decoration;
