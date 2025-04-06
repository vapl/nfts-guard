"use client";
import { motion } from "framer-motion";
import React from "react";

const Decoration = () => {
  return (
    <>
      <motion.div
        animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -z-10 top-12 left-8 w-96 h-96 max-w-[100vw] pointer-events-none bg-purple-700 rounded-full blur-[100px] opacity-20"
      ></motion.div>
      <motion.div
        animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -z-1 bottom-8 right-8 w-80 h-80 bg-indigo-600 rounded-full blur-[120px] opacity-20"
      ></motion.div>
    </>
  );
};

export default Decoration;
