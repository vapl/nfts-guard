"use client";

import { useState, useRef, useEffect } from "react";
import { benefits } from "@/components/sections/benefits"; // Your benefit array

export default function BenefitsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const children = container.children;
      if (children.length === 0) return;
      const cardWidth = children[0].clientWidth + 20;

      const index = Math.round(container.scrollLeft / cardWidth);
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full lg:hidden">
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory overflow-x-auto hide-scrollbar gap-4 pb-4 pr-4 scrollbar-hide scroll-smooth"
      >
        {benefits.map((benefit, i) => (
          <div
            key={i}
            className="snap-center flex flex-col min-w-[70%] bg-card p-6 rounded-2xl drop-shadow-lg first:ml-4"
          >
            <div className="text-3xl mb-4 self-center">{benefit.icon}</div>
            <h3 className="text-xl font-bold text-heading mb-2">
              {benefit.title}
            </h3>
            <p className="text-paragraph text-sm">{benefit.description}</p>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-2">
        {benefits.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeIndex === i ? "bg-purple-600 scale-125" : "bg-gray-500/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
